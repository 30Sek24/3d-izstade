#include "Environment/CityLightingManager.h"
#include "Kismet/KismetMathLibrary.h"

ACityLightingManager::ACityLightingManager()
{
    PrimaryActorTick.bCanEverTick = true;
    PrimaryActorTick.bStartWithTickEnabled = true;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    SunLight = CreateDefaultSubobject<UDirectionalLightComponent>(TEXT("SunLight"));
    SunLight->SetupAttachment(Root);
    SunLight->SetMobility(EComponentMobility::Movable);
    SunLight->bUseTemperature = true;
    SunLight->SetIntensity(10.f);

    SkyLight = CreateDefaultSubobject<USkyLightComponent>(TEXT("SkyLight"));
    SkyLight->SetupAttachment(Root);
    SkyLight->SetMobility(EComponentMobility::Movable);
    SkyLight->bRealTimeCapture = true; // Required for dynamic time of day with Lumen

    SkyAtmosphere = CreateDefaultSubobject<USkyAtmosphereComponent>(TEXT("SkyAtmosphere"));
    SkyAtmosphere->SetupAttachment(Root);

    VolumetricFog = CreateDefaultSubobject<UExponentialHeightFogComponent>(TEXT("VolumetricFog"));
    VolumetricFog->SetupAttachment(Root);
    VolumetricFog->bEnableVolumetricFog = true;
    VolumetricFog->VolumetricFogScatteringDistribution = 0.9f; 
    VolumetricFog->VolumetricFogExtinctionScale = 4.0f; // Gives a thick, cyberpunk glow in the distance

    TimeOfDay = 12.f; // Noon default
    TimeScale = 0.5f; // Real-world seconds per game hour
}

void ACityLightingManager::BeginPlay()
{
    Super::BeginPlay();
    UpdateLighting();
}

void ACityLightingManager::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (TimeScale > 0.f)
    {
        TimeOfDay += (DeltaTime / 3600.f) * TimeScale;
        if (TimeOfDay >= 24.f) TimeOfDay -= 24.f;
        UpdateLighting();
    }
}

void ACityLightingManager::SetTimeOfDay(float NewTime)
{
    TimeOfDay = FMath::Clamp(NewTime, 0.f, 24.f);
    UpdateLighting();
}

void ACityLightingManager::UpdateLighting()
{
    // Map TimeOfDay (0-24) to Sun Pitch (-90 to 270)
    // 6 AM = 0 Pitch (Sunrise)
    // 12 PM = -90 Pitch (Noon)
    // 6 PM = -180 Pitch (Sunset)

    float Pitch = (TimeOfDay / 24.f) * 360.f - 90.f;
    FRotator SunRotation = FRotator(Pitch, 0.f, 0.f);
    SunLight->SetWorldRotation(SunRotation);

    // If night time, turn off sun, let city lights and holograms illuminate fog via Lumen
    if (TimeOfDay > 18.5f || TimeOfDay < 5.5f)
    {
        SunLight->SetIntensity(0.1f);
        // Could enable a secondary moon light here
    }
    else
    {
        SunLight->SetIntensity(10.f);
    }
}
