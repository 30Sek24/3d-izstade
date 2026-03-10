#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WarpalaExpo/Public/ExpoDataTypes.h"
#include "Components/InstancedStaticMeshComponent.h"
#include "CompanyBuildingSpawner.generated.h"

/**
 * Handles the actual physical placement of a new company building in the world.
 * Uses Instanced Static Meshes for high performance (10,000+ buildings).
 */
UCLASS()
class WARPALACITY_API ACompanyBuildingSpawner : public AActor
{
    GENERATED_BODY()

public:
    ACompanyBuildingSpawner();

    UFUNCTION(BlueprintCallable, Category = "Warpala|City")
    void SpawnSingleBuilding(const FWarpalaSector& Sector, const FWarpalaCompany& CompanyInfo);

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    UHierarchicalInstancedStaticMeshComponent* BuildingISM;

    UPROPERTY(EditDefaultsOnly, Category = "Spawning")
    UStaticMesh* BaseNaniteMesh;

private:
    TMap<FString, int32> SectorCompanyCounts;

    FVector CalculateNextAvailablePlot(const FWarpalaSector& Sector);
    void AttachCompanyMetadata(int32 InstanceIndex, const FWarpalaCompany& CompanyInfo);
};
