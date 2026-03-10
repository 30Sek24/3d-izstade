#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WarpalaNetworking/Public/WarpalaAPIClient.h"
#include "BuildingGenerator.h"
#include "CityGenerator.generated.h"

/**
 * Master orchestrator for the procedural Expo City.
 * Connects to the API, parses data, and drives the BuildingGenerators per sector.
 */
UCLASS()
class WARPALACITY_API ACityGenerator : public AActor
{
    GENERATED_BODY()

public:
    ACityGenerator();

protected:
    virtual void BeginPlay() override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Config")
    FString BackendApiUrl = "http://127.0.0.1:3000";

    UPROPERTY()
    UWarpalaAPIClient* ApiClient;

    UPROPERTY(EditDefaultsOnly, Category = "Warpala|Spawning")
    TSubclassOf<ABuildingGenerator> BuildingGeneratorClass;

    UFUNCTION()
    void OnDataReceived(const FWarpalaSceneData& SceneData);

    UFUNCTION()
    void OnDataError(const FString& ErrorMsg);

private:
    void BuildDistricts(const FWarpalaSceneData& SceneData);
};
