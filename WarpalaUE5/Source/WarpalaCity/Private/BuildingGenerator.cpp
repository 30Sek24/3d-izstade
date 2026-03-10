#include "BuildingGenerator.h"

ABuildingGenerator::ABuildingGenerator()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    BaseBuildingISM = CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>(TEXT("BaseBuildingISM"));
    BaseBuildingISM->SetupAttachment(Root);
    // Crucial for rendering thousands of buildings efficiently
    BaseBuildingISM->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
}

void ABuildingGenerator::GenerateBuildingsForSector(const FWarpalaSector& Sector, const TArray<FWarpalaCompany>& Companies, const TArray<FWarpalaBooth>& Booths)
{
    if (!DefaultBuildingMesh) return;
    
    BaseBuildingISM->SetStaticMesh(DefaultBuildingMesh);
    BaseBuildingISM->ClearInstances();

    FVector SectorOrigin = Sector.MapPosition;
    int32 GridSize = FMath::CeilToInt(FMath::Sqrt((float)Companies.Num()));
    float Spacing = 3000.0f; // 30 meters between buildings

    for (int32 i = 0; i < Companies.Num(); ++i)
    {
        int32 Row = i / GridSize;
        int32 Col = i % GridSize;

        FVector Location = SectorOrigin + FVector(Row * Spacing, Col * Spacing, 0);
        // Vary height procedurally
        FVector Scale = FVector(1.0f, 1.0f, FMath::RandRange(1.0f, 5.0f)); 
        FRotator Rotation = FRotator::ZeroRotator;

        AddBuildingInstance(Location, Rotation, Scale, Companies[i]);
    }
}

void ABuildingGenerator::AddBuildingInstance(const FVector& Location, const FRotator& Rotation, const FVector& Scale, const FWarpalaCompany& CompanyInfo)
{
    FTransform Transform(Rotation, Location, Scale);
    BaseBuildingISM->AddInstance(Transform);

    // In a full implementation, we spawn a lightweight Actor or WidgetComponent 
    // at the base of the building to handle interaction (Door to enter Booth Interior).
}
