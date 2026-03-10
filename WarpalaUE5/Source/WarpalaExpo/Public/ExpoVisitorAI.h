#pragma once

#include "CoreMinimal.h"
#include "AIController.h"
#include "ExpoVisitorAI.generated.h"

/**
 * AI Controller for massive crowd simulations.
 * Visitors walk between booths, stop to look at screens, and attend events.
 * For 100k visitors, this logic should eventually be offloaded to MassEntity (MassAI).
 */
UCLASS()
class WARPALAEXPO_API AExpoVisitorAI : public AAIController
{
    GENERATED_BODY()

public:
    AExpoVisitorAI();

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

private:
    void PickNextDestination();
    void HandleArrival();
    
    FVector CurrentDestination;
    bool bIsWatchingScreen;
    float WatchTimer;
};
