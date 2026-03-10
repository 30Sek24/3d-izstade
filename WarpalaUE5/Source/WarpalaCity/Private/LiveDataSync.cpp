#include "LiveDataSync.h"
#include "Engine/World.h"
#include "TimerManager.h"

ALiveDataSync::ALiveDataSync()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ALiveDataSync::BeginPlay()
{
    Super::BeginPlay();

    ApiClient = NewObject<UWarpalaAPIClient>(this);
    if (ApiClient)
    {
        ApiClient->OnSceneDataReceived.AddDynamic(this, &ALiveDataSync::OnDataReceived);
    }

    if (BuildingSpawnerClass)
    {
        FActorSpawnParameters SpawnParams;
        ActiveSpawner = GetWorld()->SpawnActor<ACompanyBuildingSpawner>(BuildingSpawnerClass, FVector::ZeroVector, FRotator::ZeroRotator, SpawnParams);
    }

    // Start periodic polling
    GetWorldTimerManager().SetTimer(SyncTimerHandle, this, &ALiveDataSync::PerformSync, SyncIntervalSeconds, true, 0.0f);
}

void ALiveDataSync::PerformSync()
{
    if (ApiClient)
    {
        ApiClient->FetchExpoScene(BackendApiUrl);
    }
}

void ALiveDataSync::OnDataReceived(const FWarpalaSceneData& SceneData)
{
    if (!ActiveSpawner) return;

    for (const FWarpalaCompany& Company : SceneData.Companies)
    {
        // Detect new companies that we haven't spawned yet
        if (!KnownCompanyIds.Contains(Company.Id))
        {
            KnownCompanyIds.Add(Company.Id);
            
            // Find the sector to place it in the correct district
            FWarpalaSector TargetSector;
            for (const FWarpalaSector& Sector : SceneData.Sectors)
            {
                if (Sector.Id == Company.SectorId)
                {
                    TargetSector = Sector;
                    break;
                }
            }

            ActiveSpawner->SpawnSingleBuilding(TargetSector, Company);
        }
    }
}
