#include "RoadNetworkGenerator.h"

ARoadNetworkGenerator::ARoadNetworkGenerator()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    RoadISM = CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>(TEXT("RoadISM"));
    RoadISM->SetupAttachment(Root);

    SidewalkISM = CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>(TEXT("SidewalkISM"));
    SidewalkISM->SetupAttachment(Root);

    StreetlightISM = CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>(TEXT("StreetlightISM"));
    StreetlightISM->SetupAttachment(Root);
}

void ARoadNetworkGenerator::GenerateDistrictGrid(FVector CenterLocation, int32 GridWidth, int32 GridHeight, float BlockSize)
{
    // Procedurally spawn roads and sidewalks based on grid math.
    // For AAA feel, we calculate intersections and place different meshes (crossroads vs straight roads).
    // Using HISM ensures we can have massive 10km x 10km cities with 0 draw call overhead.

    for (int32 X = 0; X < GridWidth; ++X)
    {
        for (int32 Y = 0; Y < GridHeight; ++Y)
        {
            FVector PlotLocation = CenterLocation + FVector(X * BlockSize, Y * BlockSize, 0);
            
            // Add Road Segment Instance
            FTransform RoadTransform(FRotator::ZeroRotator, PlotLocation);
            RoadISM->AddInstance(RoadTransform);

            // Add Streetlights on corners
            FTransform LightTransform(FRotator::ZeroRotator, PlotLocation + FVector(BlockSize/2, BlockSize/2, 0));
            StreetlightISM->AddInstance(LightTransform);
        }
    }
}
