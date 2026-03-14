#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MassSpawner.h"
#include "ExpoEventManager.h"
#include "NPCManager.generated.h"

UENUM(BlueprintType)
enum class ENPCBehaviorState : uint8
{
    Roaming,
    HeadingToEvent,
    AttendingEvent
};

/**
 * Handles spawning and managing Visitor AI NPCs within the city using the Mass Entity framework.
 * This replaces the legacy ACharacter/AAIController spawning to support 10,000+ entities.
 */
UCLASS()
class WARPALAAI_API ANPCManager : public AActor
{
    GENERATED_BODY()

public:
    ANPCManager();

protected:
    virtual void BeginPlay() override;

public:
    // Reference to a Mass Spawner configured in the level
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|AI")
    AMassSpawner* MassCrowdSpawner;

    // We can inject POI (Points of Interest) into the Mass system
    UFUNCTION(BlueprintCallable, Category = "Warpala|AI")
    void SetCrowdFocusPoint(FVector FocusLocation);

    // Behavior switching for the global crowd
    UFUNCTION()
    void OnGlobalEventStarted(EExpoEventType Type, FVector Location);

    UFUNCTION()
    void OnGlobalEventEnded();

private:
    ENPCBehaviorState CurrentState;
    FVector ActivePOI;
};
