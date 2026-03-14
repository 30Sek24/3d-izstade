#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ExpoDataTypes.h"
#include "Components/HierarchicalInstancedStaticMeshComponent.h"
#include "ProceduralChunk.generated.h"

UCLASS()
class WARPALASIMULATION_API AProceduralChunk : public AActor
{
    GENERATED_BODY()

public:
    AProceduralChunk();

    UFUNCTION(BlueprintCallable, Category = "Warpala|Simulation")
    void InitializeChunk(const FCityChunkData& InChunkData, const TArray<UStaticMesh*>& BuildingMeshes);

private:
    UPROPERTY()
    TArray<UHierarchicalInstancedStaticMeshComponent*> HISMComponents;

    UPROPERTY()
    USceneComponent* SceneRoot;
};
