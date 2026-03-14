#include "WarpalaCityLoader.h"
#include "Engine/World.h"
#include "Blueprint/UserWidget.h"
#include "TimerManager.h"

AWarpalaCityLoader::AWarpalaCityLoader()
{
    PrimaryActorTick.bCanEverTick = false;
}

void AWarpalaCityLoader::BeginPlay()
{
    Super::BeginPlay();
}

void AWarpalaCityLoader::OpenGlobalMap()
{
    if (!GlobalMapWidgetClass) return;

    if (!GlobalMapInstance)
    {
        GlobalMapInstance = CreateWidget<UWarpalaGlobalMapWidget>(GetWorld(), GlobalMapWidgetClass);
        if (GlobalMapInstance)
        {
            GlobalMapInstance->OnCitySelected.AddDynamic(this, &AWarpalaCityLoader::OnCitySelectedFromMap);
        }
    }

    if (GlobalMapInstance)
    {
        GlobalMapInstance->AddToViewport();
        FetchAvailableCities();
    }
}

void AWarpalaCityLoader::FetchAvailableCities()
{
    if (!ApiClient)
    {
        ApiClient = NewObject<UWarpalaAPIClient>(this);
        ApiClient->OnCitiesListReceived.AddDynamic(this, &AWarpalaCityLoader::OnCityListFetched);
    }

    UE_LOG(LogTemp, Log, TEXT("CityLoader: Fetching available cities for Global Map..."));
    ApiClient->FetchCities(BackendCitiesUrl);
}

void AWarpalaCityLoader::OnCityListFetched(const TArray<FWarpalaCityMetadata>& Cities)
{
    OnCitiesListReceived.Broadcast(Cities);
    if (GlobalMapInstance)
    {
        GlobalMapInstance->UpdateCityList(Cities);
    }
}

void AWarpalaCityLoader::OnCitySelectedFromMap(const FString& CityId)
{
    if (GlobalMapInstance)
    {
        GlobalMapInstance->RemoveFromParent();
    }
    TravelToCity(CityId);
}

void AWarpalaCityLoader::TravelToCity(const FString& CityId)
{
    if (!ActiveCityGenerator) return;

    TargetCityId = CityId;
    UE_LOG(LogTemp, Log, TEXT("CityLoader: Starting travel sequence to [%s]"), *CityId);

    // 1. Play "Travel Start" animation (e.g. Fade Out)
    PlayTravelAnimation(true);

    // 2. Delayed execution to allow fade to complete
    FTimerHandle TravelTimer;
    GetWorld()->GetTimerManager().SetTimer(TravelTimer, this, &AWarpalaCityLoader::CompleteTravel, 2.0f, false);
}

void AWarpalaCityLoader::CompleteTravel()
{
    // CityGenerator logic is now handled via local procedural generation within WarpalaSimulation.
    // The previous BackendApiUrl and RefreshCityData methods have been deprecated in favor of chunk-based streaming.

    // Play "Travel End" animation (e.g. Fade In)
    PlayTravelAnimation(false);
    
    UE_LOG(LogTemp, Log, TEXT("CityLoader: Travel to [%s] complete."), *TargetCityId);
}
