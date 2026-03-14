#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/ExponentialHeightFogComponent.h"
#include "Components/DirectionalLightComponent.h"
#include "Components/SkyLightComponent.h"
#include "Components/SkyAtmosphereComponent.h"
#include "CityLightingManager.generated.h"

/**
 * Manages the dynamic time-of-day, Lumen Global Illumination, 
 * and Volumetric Fog to create the massive wow-effect.
 */
UCLASS()
class WARPALACITY_API ACityLightingManager : public AActor
{
    GENERATED_BODY()
    
public:    
    ACityLightingManager();

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

public:    
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Environment")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Environment")
    UDirectionalLightComponent* SunLight;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Environment")
    USkyLightComponent* SkyLight;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Environment")
    USkyAtmosphereComponent* SkyAtmosphere;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Environment")
    UExponentialHeightFogComponent* VolumetricFog;

    // Time of day in hours (0.0 to 24.0)
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Time")
    float TimeOfDay;

    // How fast time passes. Set to 0 for static time.
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Time")
    float TimeScale;

    UFUNCTION(BlueprintCallable, Category = "Warpala|Environment")
    void SetTimeOfDay(float NewTime);

private:
    void UpdateLighting();
};
