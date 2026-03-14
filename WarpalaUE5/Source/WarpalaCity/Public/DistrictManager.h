#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WarpalaExpo/Public/ExpoDataTypes.h"
#include "Procedural/ProceduralBuildingManager.h"
#include "DistrictManager.generated.h"

/**
 * Manages an individual District (Sector) within Warpala Expo City.
 * Takes companies parsed from the API and uses the BuildingSpawner to lay them out.
 */
UCLASS()
class WARPALACITY_API ADistrictManager : public AActor
{
    GENERATED_BODY()

public:
    ADistrictManager();

protected:
    virtual void BeginPlay() override;

public:
    // Core state
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|District")
    FWarpalaSector SectorData;

    UPROPERTY(EditDefaultsOnly, Category = "Warpala|Generation")
    TSubclassOf<AProceduralBuildingManager> BuildingSpawnerClass;

    // Called by CityGenerator to begin building this district
    UFUNCTION(BlueprintCallable, Category = "Warpala|District")
    void InitializeDistrict(const FWarpalaSector& InSectorData, const TArray<FWarpalaCompany>& InCompanies, const TArray<FWarpalaBooth>& AllBooths);

private:
    UPROPERTY()
    AProceduralBuildingManager* SpawnerInstance;
};
