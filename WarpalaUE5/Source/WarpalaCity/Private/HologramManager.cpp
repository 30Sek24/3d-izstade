#include "HologramManager.h"

AHologramManager::AHologramManager()
{
    PrimaryActorTick.bCanEverTick = false;
    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;
}

void AHologramManager::SpawnGiantHologram(FVector Location, UMaterialInterface* HologramMaterial)
{
    // Uses a dynamic mesh component to render giant translucent visuals
    UStaticMeshComponent* HologramMesh = NewObject<UStaticMeshComponent>(this);
    HologramMesh->SetWorldLocation(Location);
    HologramMesh->SetMaterial(0, HologramMaterial);
    
    // Make sure it doesn't cast shadows or block NavMesh
    HologramMesh->SetCastShadow(false);
    HologramMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);
    
    HologramMesh->RegisterComponentWithWorld(GetWorld());
}
