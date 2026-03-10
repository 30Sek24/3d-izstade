#include "CityGenerator.h"
#include "Engine/World.h"

ACityGenerator::ACityGenerator()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ACityGenerator::BeginPlay()
{
    Super::BeginPlay();

    ApiClient = NewObject<UWarpalaAPIClient>(this);
    if (ApiClient)
    {
        ApiClient->OnSceneDataReceived.AddDynamic(this, &ACityGenerator::OnDataReceived);
        ApiClient->OnSceneDataError.AddDynamic(this, &ACityGenerator::OnDataError);
        
        ApiClient->FetchExpoScene(BackendApiUrl);
    }
}

void ACityGenerator::OnDataReceived(const FWarpalaSceneData& SceneData)
{
    UE_LOG(LogTemp, Log, TEXT("Warpala: Successfully received Scene Data. Sectors: %d, Companies: %d"), SceneData.Sectors.Num(), SceneData.Companies.Num());
    BuildDistricts(SceneData);
}

void ACityGenerator::OnDataError(const FString& ErrorMsg)
{
    UE_LOG(LogTemp, Error, TEXT("Warpala API Error: %s"), *ErrorMsg);
}

void ACityGenerator::BuildDistricts(const FWarpalaSceneData& SceneData)
{
    if (!BuildingGeneratorClass) return;

    for (const FWarpalaSector& Sector : SceneData.Sectors)
    {
        // Filter companies belonging to this sector
        TArray<FWarpalaCompany> SectorCompanies;
        for (const FWarpalaCompany& Company : SceneData.Companies)
        {
            if (Company.SectorId == Sector.Id)
            {
                SectorCompanies.Add(Company);
            }
        }

        if (SectorCompanies.Num() > 0)
        {
            // Spawn a generator for this specific district
            FActorSpawnParameters SpawnParams;
            ABuildingGenerator* DistrictGenerator = GetWorld()->SpawnActor<ABuildingGenerator>(BuildingGeneratorClass, FVector::ZeroVector, FRotator::ZeroRotator, SpawnParams);
            
            if (DistrictGenerator)
            {
                DistrictGenerator->GenerateBuildingsForSector(Sector, SectorCompanies, SceneData.Booths);
            }
        }
    }
}
