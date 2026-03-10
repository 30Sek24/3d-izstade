#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ExpoEventManager.generated.h"

UENUM(BlueprintType)
enum class EExpoEventType : uint8
{
    ProductLaunch,
    Conference,
    ExpoStage
};

/**
 * Manages live events in the Expo City. 
 * Can trigger visual effects and act as a POI (Point of Interest) to attract AI Visitors.
 */
UCLASS()
class WARPALAEXPO_API AExpoEventManager : public AActor
{
    GENERATED_BODY()

public:
    AExpoEventManager();

    UFUNCTION(BlueprintCallable, Category = "Warpala|Events")
    void StartEvent(EExpoEventType EventType, FVector Location, float Duration);

    UFUNCTION(BlueprintCallable, Category = "Warpala|Events")
    void EndEvent();

    UPROPERTY(BlueprintReadOnly, Category = "Warpala|Events")
    bool bIsEventActive;

    UPROPERTY(BlueprintReadOnly, Category = "Warpala|Events")
    FVector ActiveEventLocation;

protected:
    virtual void Tick(float DeltaTime) override;

private:
    float TimeRemaining;
};
