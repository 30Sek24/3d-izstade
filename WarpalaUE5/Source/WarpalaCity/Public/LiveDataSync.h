#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WarpalaNetworking/Public/WarpalaAPIClient.h"
#include "CompanyBuildingSpawner.h"
#include "LiveDataSync.generated.h"

/**
 * Periodically polls the Warpala backend to detect new companies or changes
 * and dynamically spawns/updates buildings in the live world without restarting.
 */
UCLASS()
class WARPALACITY_API ALiveDataSync : public AActor
{
    GENERATED_BODY()

public:
    ALiveDataSync();

protected:
    virtual void BeginPlay() override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Sync")
    float SyncIntervalSeconds = 60.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Sync")
    FString BackendApiUrl = "http://127.0.0.1:3000";

    UPROPERTY()
    UWarpalaAPIClient* ApiClient;

    UPROPERTY(EditDefaultsOnly, Category = "Warpala|Sync")
    TSubclassOf<ACompanyBuildingSpawner> BuildingSpawnerClass;

    UFUNCTION()
    void OnDataReceived(const FWarpalaSceneData& SceneData);

private:
    FTimerHandle SyncTimerHandle;
    TSet<FString> KnownCompanyIds;
    ACompanyBuildingSpawner* ActiveSpawner;

    void PerformSync();
};
