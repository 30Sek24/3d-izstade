#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/SplineComponent.h"
#include "DroneSystem.generated.h"

UENUM(BlueprintType)
enum class EDroneType : uint8
{
    CameraDrone,
    DeliveryDrone,
    AdDrone
};

/**
 * Handles drone traffic above the Expo City using spline paths.
 */
UCLASS()
class WARPALACITY_API ADroneSystem : public AActor
{
    GENERATED_BODY()

public:
    ADroneSystem();

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    USplineComponent* DronePath;

    UPROPERTY(EditAnywhere, Category = "Drones")
    EDroneType TypeOfDrone;

    UPROPERTY(EditAnywhere, Category = "Drones")
    float FlightSpeed = 500.0f;

private:
    float CurrentDistanceAlongSpline;
    float TotalSplineLength;
};
