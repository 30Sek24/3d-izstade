#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "DroneSystem.h" // from City module
#include "DroneTrafficManager.generated.h"

/**
 * Manages hundreds of drones flying between buildings.
 * Organizes them into distinct lanes (high altitude for delivery, low for camera/ads).
 */
UCLASS()
class WARPALATRAFFIC_API ADroneTrafficManager : public AActor
{
    GENERATED_BODY()

public:
    ADroneTrafficManager();

protected:
    virtual void BeginPlay() override;

    UPROPERTY(EditDefaultsOnly, Category = "Warpala|Traffic")
    TSubclassOf<ADroneSystem> BaseDroneClass;

    UPROPERTY(EditAnywhere, Category = "Warpala|Traffic")
    int32 MaxActiveDrones = 500;

    void SpawnDroneSwarm();
};
