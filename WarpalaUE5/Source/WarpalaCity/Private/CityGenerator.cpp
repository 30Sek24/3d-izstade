#include "CityGenerator.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"

ACityGenerator::ACityGenerator()
{
    PrimaryActorTick.bCanEverTick = false;
    
    // Create a root component
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("RootComponent"));
}

void ACityGenerator::BeginPlay()
{
    Super::BeginPlay();

    GenerateCity();
}

void ACityGenerator::GenerateCity()
{
    if (BuildingMeshes.Num() == 0) return;

    for (int x = -GridSize; x < GridSize; x++)
    {
        for (int y = -GridSize; y < GridSize; y++)
        {
            int index = FMath::RandRange(0, BuildingMeshes.Num() - 1);

            FVector location = GetActorLocation() + FVector(x * Spacing, y * Spacing, 0);

            UStaticMeshComponent* mesh = NewObject<UStaticMeshComponent>(this);

            mesh->RegisterComponent();
            mesh->SetStaticMesh(BuildingMeshes[index]);
            mesh->SetWorldLocation(location);
            mesh->AttachToComponent(RootComponent, FAttachmentTransformRules::KeepWorldTransform);
        }
    }
}
