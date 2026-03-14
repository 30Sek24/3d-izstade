#include "DistrictManager.h"
#include "Engine/World.h"

ADistrictManager::ADistrictManager()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ADistrictManager::BeginPlay()
{
    Super::BeginPlay();
}

void ADistrictManager::InitializeDistrict(const FWarpalaSector& InSectorData, const TArray<FWarpalaCompany>& InCompanies, const TArray<FWarpalaBooth>& AllBooths)
{
    SectorData = InSectorData;

    UE_LOG(LogTemp, Log, TEXT("DistrictManager: Initializing District [%s] - %s. Placing %d companies."), *SectorData.Id, *SectorData.Name, InCompanies.Num());

    if (!BuildingSpawnerClass)
    {
        UE_LOG(LogTemp, Warning, TEXT("DistrictManager: BuildingSpawnerClass is not set!"));
        return;
    }

    // Spawn the BuildingSpawner
    FActorSpawnParameters SpawnParams;
    SpawnParams.Owner = this;
    SpawnerInstance = GetWorld()->SpawnActor<AProceduralBuildingManager>(BuildingSpawnerClass, GetActorLocation(), GetActorRotation(), SpawnParams);

    if (SpawnerInstance)
    {
        // Execute generation sequence
        SpawnerInstance->GenerateBuildings(InCompanies, AllBooths);
    }
}
