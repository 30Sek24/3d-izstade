#include "Procedural/ProceduralBuildingManager.h"
#include "PCGComponent.h"

AProceduralBuildingManager::AProceduralBuildingManager()
{
    PrimaryActorTick.bCanEverTick = false;
    
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));

    PCGComponent = CreateDefaultSubobject<UPCGComponent>(TEXT("PCGComponent"));
    
    PlotSize = 3000.f;
}

void AProceduralBuildingManager::BeginPlay()
{
    Super::BeginPlay();
}

void AProceduralBuildingManager::ClearCity()
{
    if (PCGComponent)
    {
        PCGComponent->Cleanup();
        UE_LOG(LogTemp, Log, TEXT("ProceduralBuildingManager: PCG Graph Cleaned."));
    }
}

void AProceduralBuildingManager::GenerateBuildings(const TArray<FWarpalaCompany>& Companies, const TArray<FWarpalaBooth>& AllBooths)
{
    if (!PCGComponent) return;

    if (Companies.Num() == 0)
    {
        UE_LOG(LogTemp, Warning, TEXT("ProceduralBuildingManager: No companies provided for generation."));
        return;
    }

    UE_LOG(LogTemp, Log, TEXT("ProceduralBuildingManager: Passing %d companies to PCG Graph."), Companies.Num());

    // Instead of doing nested loops here, we inject our structural data (number of companies, grid size)
    // into the PCG Component's parameters.
    
    // Example: Passing data into the PCG graph as dynamic parameters.
    // The PCG Graph (Blueprint/Asset) will catch these variables and use native multithreaded logic
    // to hash the space and place the HISM blocks efficiently.
    
    int32 GridSize = FMath::CeilToInt(FMath::Sqrt((float)Companies.Num()));
    
    // In a full implementation, you'd write a custom UPCGData or pass an array of transforms to a custom PCG node.
    // For now, we set fundamental graph parameters:
    // (Assuming these parameters are exposed in your PCG Graph)
    // PCGComponent->SetVariableInt(TEXT("GridSize"), GridSize);
    // PCGComponent->SetVariableFloat(TEXT("PlotSpacing"), PlotSize);

    // Trigger the graph generation (which runs asynchronously and efficiently in C++)
    PCGComponent->Generate();
}
