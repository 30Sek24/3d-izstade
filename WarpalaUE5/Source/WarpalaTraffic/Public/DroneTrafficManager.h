#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "NiagaraComponent.h"
#include "NiagaraSystem.h"
#include "DroneTrafficManager.generated.h"

/**
 * Handles massive amounts of flying drones in the sky using Niagara GPU Simulation.
 * Replaces the old CPU-bound Instanced Static Mesh approach.
 */
UCLASS()
class WARPALATRAFFIC_API ADroneTrafficManager : public AActor
{
    GENERATED_BODY()
    
public:    
    ADroneTrafficManager();

protected:
    virtual void BeginPlay() override;

public:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Traffic")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Traffic")
    UNiagaraComponent* DroneNiagaraComponent;

    // The Niagara System asset that handles the drone swarm behavior
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Traffic")
    UNiagaraSystem* DroneSwarmSystem;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Traffic")
    int32 MaxDrones = 10000; // Increased significantly since GPU handles it

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Traffic")
    FVector FlightBounds = FVector(20000.f, 20000.f, 5000.f);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Traffic")
    float BaseAltitude = 3000.f;

    UFUNCTION(BlueprintCallable, Category = "Warpala|Traffic")
    void InitializeTraffic();
};
