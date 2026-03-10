#include "WarpalaAPIClient.h"
#include "Json.h"
#include "JsonUtilities.h"

UWarpalaAPIClient::UWarpalaAPIClient()
{
}

void UWarpalaAPIClient::FetchExpoScene(FString BaseUrl)
{
    FHttpModule* Http = &FHttpModule::Get();
    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = Http->CreateRequest();

    FString ApiEndpoint = BaseUrl + TEXT("/api/expo/scene");
    Request->SetURL(ApiEndpoint);
    Request->SetVerb("GET");
    Request->SetHeader(TEXT("Content-Type"), TEXT("application/json"));
    Request->SetHeader(TEXT("Accept"), TEXT("application/json"));

    Request->OnProcessRequestComplete().BindUObject(this, &UWarpalaAPIClient::OnFetchCompleted);
    Request->ProcessRequest();
}

void UWarpalaAPIClient::OnFetchCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
    if (bWasSuccessful && Response.IsValid() && Response->GetResponseCode() == 200)
    {
        FString JsonString = Response->GetContentAsString();
        FWarpalaSceneData SceneData = ParseSceneData(JsonString);
        OnSceneDataReceived.Broadcast(SceneData);
    }
    else
    {
        FString ErrorMsg = Response.IsValid() ? FString::Printf(TEXT("HTTP Error: %d"), Response->GetResponseCode()) : TEXT("Request Failed");
        OnSceneDataError.Broadcast(ErrorMsg);
    }
}

FWarpalaSceneData UWarpalaAPIClient::ParseSceneData(const FString& JsonString)
{
    FWarpalaSceneData ResultData;
    TSharedPtr<FJsonObject> JsonObject;
    TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(JsonString);

    if (FJsonSerializer::Deserialize(Reader, JsonObject) && JsonObject.IsValid())
    {
        // Safe check for data wrapping
        TSharedPtr<FJsonObject> DataObject = JsonObject->HasField("data") ? JsonObject->GetObjectField("data") : JsonObject;

        const TArray<TSharedPtr<FJsonValue>>* SectorsArray;
        if (DataObject->TryGetArrayField("sectors", SectorsArray))
        {
            for (const auto& Val : *SectorsArray)
            {
                TSharedPtr<FJsonObject> Obj = Val->AsObject();
                FWarpalaSector Sector;
                Sector.Id = Obj->GetStringField("id");
                Sector.Name = Obj->GetStringField("name");
                Sector.ColorTheme = Obj->GetStringField("color_theme");
                // Parsing MapPosition logic here
                ResultData.Sectors.Add(Sector);
            }
        }
        
        // Similar standard UE5 JSON parsing for Companies and Booths arrays...
    }

    return ResultData;
}
