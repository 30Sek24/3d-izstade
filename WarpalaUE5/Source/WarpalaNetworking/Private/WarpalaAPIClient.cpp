#include "WarpalaAPIClient.h"
#include "Json.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonSerializer.h"
#include "Async/Async.h"

UWarpalaAPIClient::UWarpalaAPIClient() 
{
    ApiKey = "warpala-ue5-bridge-2026";
}

void UWarpalaAPIClient::FetchExpoScene(FString BaseUrl)
{
    FHttpModule* Http = &FHttpModule::Get();
    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = Http->CreateRequest();
    Request->OnProcessRequestComplete().BindUObject(this, &UWarpalaAPIClient::OnFetchCompleted);
    Request->SetURL(BaseUrl);
    Request->SetVerb("GET");
    
    // Hardened Security Header
    Request->SetHeader(TEXT("X-Warpala-API-Key"), ApiKey);
    Request->SetHeader(TEXT("Content-Type"), TEXT("application/json"));
    
    Request->ProcessRequest();
}

void UWarpalaAPIClient::FetchCities(FString BaseUrl)
{
    FHttpModule* Http = &FHttpModule::Get();
    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = Http->CreateRequest();
    Request->OnProcessRequestComplete().BindUObject(this, &UWarpalaAPIClient::OnFetchCitiesCompleted);
    Request->SetURL(BaseUrl);
    Request->SetVerb("GET");
    
    // Hardened Security Header
    Request->SetHeader(TEXT("X-Warpala-API-Key"), ApiKey);
    Request->SetHeader(TEXT("Content-Type"), TEXT("application/json"));
    
    Request->ProcessRequest();
}

void UWarpalaAPIClient::OnFetchCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
    if (bWasSuccessful && Response.IsValid() && Response->GetResponseCode() == 200)
    {
        FString JsonString = Response->GetContentAsString();
        TWeakObjectPtr<UWarpalaAPIClient> WeakThis(this);

        // Pārceļam smago JSON parsēšanu uz fona pavedienu
        AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [WeakThis, JsonString]()
        {
            if (UWarpalaAPIClient* StrongThis = WeakThis.Get())
            {
                FWarpalaSceneData SceneData = StrongThis->ParseSceneData(JsonString);

                // Kad gatavs, sūtām rezultātu atpakaļ uz Game Thread
                AsyncTask(ENamedThreads::GameThread, [WeakThis, SceneData]()
                {
                    if (UWarpalaAPIClient* FinalThis = WeakThis.Get())
                    {
                        FinalThis->OnSceneDataReceived.Broadcast(SceneData);
                    }
                });
            }
        });
    }
    else
    {
        FString ErrorDetail = Response.IsValid() ? FString::Printf(TEXT("HTTP %d"), Response->GetResponseCode()) : TEXT("No Response");
        OnSceneDataError.Broadcast(FString::Printf(TEXT("Scene Request Failed - %s"), *ErrorDetail));
    }
}

void UWarpalaAPIClient::OnFetchCitiesCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
    if (bWasSuccessful && Response.IsValid() && Response->GetResponseCode() == 200)
    {
        FString JsonString = Response->GetContentAsString();
        TWeakObjectPtr<UWarpalaAPIClient> WeakThis(this);

        // Parsējam masīvos pilsētu datus asinhroni
        AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [WeakThis, JsonString]()
        {
            if (UWarpalaAPIClient* StrongThis = WeakThis.Get())
            {
                TArray<FWarpalaCityMetadata> Cities = StrongThis->ParseCitiesData(JsonString);

                // Atgriežam atbildi atpakaļ uz Game Thread
                AsyncTask(ENamedThreads::GameThread, [WeakThis, Cities]()
                {
                    if (UWarpalaAPIClient* FinalThis = WeakThis.Get())
                    {
                        FinalThis->OnCitiesListReceived.Broadcast(Cities);
                    }
                });
            }
        });
    }
    else
    {
        FString ErrorDetail = Response.IsValid() ? FString::Printf(TEXT("HTTP %d"), Response->GetResponseCode()) : TEXT("No Response");
        OnSceneDataError.Broadcast(FString::Printf(TEXT("Cities Request Failed - %s"), *ErrorDetail));
    }
}

FWarpalaSceneData UWarpalaAPIClient::ParseSceneData(const FString& JsonString)
{
    FWarpalaSceneData SceneData;
    TSharedPtr<FJsonObject> JsonObject;
    TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(JsonString);

    if (FJsonSerializer::Deserialize(Reader, JsonObject))
    {
        TSharedPtr<FJsonObject> CityObj = JsonObject->GetObjectField("cityInfo");
        if (CityObj.IsValid())
        {
            SceneData.CityInfo.Id = CityObj->GetStringField("id");
            SceneData.CityInfo.Name = CityObj->GetStringField("name");
            SceneData.CityInfo.Style = (EArchitectureStyle)CityObj->GetIntegerField("style");
        }

        const TArray<TSharedPtr<FJsonValue>>* SectorsArray;
        if (JsonObject->TryGetArrayField("sectors", SectorsArray))
        {
            for (auto& Value : *SectorsArray)
            {
                TSharedPtr<FJsonObject> Obj = Value->AsObject();
                FWarpalaSector Sector;
                Sector.Id = Obj->GetStringField("id");
                Sector.Name = Obj->GetStringField("name");
                Sector.ColorTheme = Obj->GetStringField("color_theme");
                
                TSharedPtr<FJsonObject> PosObj = Obj->GetObjectField("map_position");
                Sector.MapPosition = FVector(PosObj->GetNumberField("x"), PosObj->GetNumberField("y"), PosObj->GetNumberField("z"));
                
                SceneData.Sectors.Add(Sector);
            }
        }

        const TArray<TSharedPtr<FJsonValue>>* CompaniesArray;
        if (JsonObject->TryGetArrayField("companies", CompaniesArray))
        {
            for (auto& Value : *CompaniesArray)
            {
                TSharedPtr<FJsonObject> Obj = Value->AsObject();
                FWarpalaCompany Company;
                Company.Id = Obj->GetStringField("id");
                Company.SectorId = Obj->GetStringField("sectorId");
                Company.Name = Obj->GetStringField("name");
                Company.LogoUrl = Obj->GetStringField("logo_url");
                Company.CurrentRevenue = Obj->GetNumberField("currentRevenue");
                Company.ActivityScore = Obj->GetNumberField("activityScore");
                Company.ActiveEmployees = Obj->GetIntegerField("activeEmployees");
                SceneData.Companies.Add(Company);
            }
        }
    }
    return SceneData;
}

TArray<FWarpalaCityMetadata> UWarpalaAPIClient::ParseCitiesData(const FString& JsonString)
{
    TArray<FWarpalaCityMetadata> Cities;
    TSharedPtr<FJsonObject> JsonObject;
    TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(JsonString);

    if (FJsonSerializer::Deserialize(Reader, JsonObject))
    {
        const TArray<TSharedPtr<FJsonValue>>* CitiesArray;
        if (JsonObject->TryGetArrayField("cities", CitiesArray))
        {
            for (auto& Value : *CitiesArray)
            {
                TSharedPtr<FJsonObject> Obj = Value->AsObject();
                FWarpalaCityMetadata City;
                City.Id = Obj->GetStringField("id");
                City.Name = Obj->GetStringField("name");
                City.Style = (EArchitectureStyle)Obj->GetIntegerField("style");
                
                TSharedPtr<FJsonObject> PosObj = Obj->GetObjectField("globalLocation");
                City.GlobalLocation = FVector(PosObj->GetNumberField("x"), PosObj->GetNumberField("y"), PosObj->GetNumberField("z"));
                
                Cities.Add(City);
            }
        }
    }
    return Cities;
}
