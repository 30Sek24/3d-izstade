#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ExpoDataTypes.h"
#include "Components/InstancedStaticMeshComponent.h"
#include "BuildingGenerator.generated.h"

/**
 * Handles the procedural generation of buildings using Instanced Static Meshes (ISM)
 * to support rendering thousands of companies with high performance (Nanite).
 */
UCLASS()
class WARPALACITY_API ABuildingGenerator : public AActor
{
    GENERATED_BODY()

public:
    ABuildingGenerator();

    UFUNCTION(BlueprintCallable, Category = "Warpala|City")
    void GenerateBuildingsForSector(const FWarpalaSector& Sector, const TArray<FWarpalaCompany>& Companies, const TArray<FWarpalaBooth>& Booths);

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    USceneComponent* Root;

    // Use HISM for frustum culling and LODs if Nanite is not enabled on specific meshes
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    UHierarchicalInstancedStaticMeshComponent* BaseBuildingISM;

    UPROPERTY(EditDefaultsOnly, Category = "Generation")
    UStaticMesh* DefaultBuildingMesh;

private:
    void AddBuildingInstance(const FVector& Location, const FRotator& Rotation, const FVector& Scale, const FWarpalaCompany& CompanyInfo);
};
