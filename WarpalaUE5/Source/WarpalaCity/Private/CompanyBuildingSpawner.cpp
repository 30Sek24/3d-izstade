#include "CompanyBuildingSpawner.h"
#include "Components/HierarchicalInstancedStaticMeshComponent.h"

ACompanyBuildingSpawner::ACompanyBuildingSpawner()
{
    PrimaryActorTick.bCanEverTick = false;
    
    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    BuildingISM = CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>(TEXT("BuildingISM"));
    BuildingISM->SetupAttachment(Root);
    BuildingISM->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
}

void ACompanyBuildingSpawner::SpawnSingleBuilding(const FWarpalaSector& Sector, const FWarpalaCompany& CompanyInfo)
{
    if (!BaseNaniteMesh) return;
    
    BuildingISM->SetStaticMesh(BaseNaniteMesh);

    FVector SpawnLocation = CalculateNextAvailablePlot(Sector);
    FVector Scale = FVector(1.0f, 1.0f, FMath::RandRange(1.0f, 4.0f));
    
    FTransform Transform(FRotator::ZeroRotator, SpawnLocation, Scale);
    int32 InstanceId = BuildingISM->AddInstance(Transform);

    AttachCompanyMetadata(InstanceId, CompanyInfo);
}

FVector ACompanyBuildingSpawner::CalculateNextAvailablePlot(const FWarpalaSector& Sector)
{
    int32& Count = SectorCompanyCounts.FindOrAdd(Sector.Id, 0);
    int32 GridSize = 100; // 100x100 grid per district
    float Spacing = 3000.0f; // 30m spacing

    int32 Row = Count / GridSize;
    int32 Col = Count % GridSize;
    Count++;

    return Sector.MapPosition + FVector(Row * Spacing, Col * Spacing, 0);
}

void ACompanyBuildingSpawner::AttachCompanyMetadata(int32 InstanceIndex, const FWarpalaCompany& CompanyInfo)
{
    // In Unreal, to attach string metadata to an ISM index, we usually use an external Map
    // or spawn a lightweight "Sign" actor at the transform location for the player to click on.
    // This allows the interaction system to read the Company Logo and Name.
}
