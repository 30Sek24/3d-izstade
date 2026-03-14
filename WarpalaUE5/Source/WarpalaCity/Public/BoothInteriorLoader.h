#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BoothInteriorLoader.generated.h"

/**
 * Handles seamless loading of booth interior maps or levels
 * when the player approaches or enters a building.
 */
UCLASS()
class WARPALACITY_API ABoothInteriorLoader : public AActor
{
    GENERATED_BODY()

public:
    ABoothInteriorLoader();

    UFUNCTION(BlueprintCallable, Category = "Warpala|LevelStreaming")
    void LoadBoothInterior(const FName& LevelName);

    UFUNCTION(BlueprintCallable, Category = "Warpala|LevelStreaming")
    void UnloadBoothInterior(const FName& LevelName);

protected:
    virtual void BeginPlay() override;

private: TSet<FName> ActiveLoads;
    UFUNCTION()
    void OnLevelLoaded();

    UFUNCTION()
    void OnLevelUnloaded();
};
