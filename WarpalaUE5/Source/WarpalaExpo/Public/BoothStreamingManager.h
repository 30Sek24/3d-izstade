#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BoothStreamingManager.generated.h"

/**
 * Handles seamless loading and unloading of highly detailed Booth Interiors.
 * Ensures the city map remains lightweight, only streaming 8K textures and complex geometry 
 * when the player approaches or enters a building.
 */
UCLASS()
class WARPALAEXPO_API ABoothStreamingManager : public AActor
{
    GENERATED_BODY()

public:
    ABoothStreamingManager();

    UFUNCTION(BlueprintCallable, Category = "Warpala|Streaming")
    void LoadBoothInterior(const FString& CompanyId, FName LevelName);

    UFUNCTION(BlueprintCallable, Category = "Warpala|Streaming")
    void UnloadBoothInterior(FName LevelName);

protected:
    UFUNCTION()
    void OnLevelLoaded();

private:
    FName CurrentStreamingLevel;
};
