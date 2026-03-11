#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/SplineComponent.h"
#include "Components/InstancedStaticMeshComponent.h"
#include "RoadNetworkGenerator.generated.h"

/**
 * Procedurally generates roads, sidewalks, and streetlights for districts.
 * Uses Splines and Instanced Static Meshes for high performance.
 */
UCLASS()
class WARPALACITY_API ARoadNetworkGenerator : public AActor
{
    GENERATED_BODY()

public:
    ARoadNetworkGenerator();

    UFUNCTION(BlueprintCallable, Category = "Warpala|City")
    void GenerateDistrictGrid(FVector CenterLocation, int32 GridWidth, int32 GridHeight, float BlockSize);

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    UHierarchicalInstancedStaticMeshComponent* RoadISM;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    UHierarchicalInstancedStaticMeshComponent* SidewalkISM;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    UHierarchicalInstancedStaticMeshComponent* StreetlightISM;
};
