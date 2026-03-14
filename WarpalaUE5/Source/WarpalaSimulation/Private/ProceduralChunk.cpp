#include "ProceduralChunk.h"

AProceduralChunk::AProceduralChunk()
{
    PrimaryActorTick.bCanEverTick = false;
    SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("SceneRoot"));
    RootComponent = SceneRoot;
}

void AProceduralChunk::InitializeChunk(const FCityChunkData& InChunkData, const TArray<UStaticMesh*>& BuildingMeshes)
{
    // Clear existing
    for (auto* Comp : HISMComponents)
    {
        Comp->DestroyComponent();
    }
    HISMComponents.Empty();

    // Create HISM for each mesh type
    for (int32 i = 0; i < BuildingMeshes.Num(); ++i)
    {
        UHierarchicalInstancedStaticMeshComponent* HISM = NewObject<UHierarchicalInstancedStaticMeshComponent>(this);
        HISM->RegisterComponent();
        HISM->AttachToComponent(RootComponent, FAttachmentTransformRules::KeepRelativeTransform);
        HISM->SetStaticMesh(BuildingMeshes[i]);
        
        // AAA Performance Settings
        HISM->InstanceStartCullDistance = 50000.0f; // 500m
        HISM->InstanceEndCullDistance = 200000.0f; // 2km
        HISM->SetCastShadow(true);
        HISM->bAffectDistanceFieldLighting = true;
        
        HISMComponents.Add(HISM);
    }

    // Add instances
    for (const FBuildingData& Building : InChunkData.Buildings)
    {
        if (HISMComponents.IsValidIndex(Building.MeshTypeIndex))
        {
            FTransform Transform;
            Transform.SetLocation(Building.RelativeLocation);
            Transform.SetScale3D(FVector(1.0f, 1.0f, Building.HeightScale));
            
            HISMComponents[Building.MeshTypeIndex]->AddInstance(Transform);
        }
    }
}
