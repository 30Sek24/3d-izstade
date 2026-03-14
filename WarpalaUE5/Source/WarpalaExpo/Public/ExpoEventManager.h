#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Events/EventSpace.h"
#include "ExpoEventManager.generated.h"

UENUM(BlueprintType)
enum class EExpoEventType : uint8
{
    ProductLaunch,
    Conference,
    ExpoStage
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnExpoEventStarted, EExpoEventType, Type, FVector, Location);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnExpoEventEnded);

/**
 * Manages live events in the Expo City. 
 * Replicated to all clients so they see the same shared events.
 */
UCLASS()
class WARPALAEXPO_API AExpoEventManager : public AActor
{
    GENERATED_BODY()

public:
    AExpoEventManager();

    UPROPERTY(BlueprintAssignable, Category = "Warpala|Events")
    FOnExpoEventStarted OnEventStarted;

    UPROPERTY(BlueprintAssignable, Category = "Warpala|Events")
    FOnExpoEventEnded OnEventEnded;

    UFUNCTION(BlueprintCallable, Category = "Warpala|Events")
    void TriggerGlobalEvent(EExpoEventType EventType, FString EventName, FString VideoUrl);

    UFUNCTION(BlueprintCallable, Category = "Warpala|Events")
    void EndEvent();

    UPROPERTY(ReplicatedUsing = OnRep_EventActive, BlueprintReadOnly, Category = "Warpala|Events")
    bool bIsEventActive;

    UPROPERTY(Replicated, BlueprintReadOnly, Category = "Warpala|Events")
    FVector ActiveEventLocation;

    UFUNCTION()
    void OnRep_EventActive();

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

private:
    float TimeRemaining;
    
    UPROPERTY()
    TArray<AEventSpace*> AvailableStages;
};
