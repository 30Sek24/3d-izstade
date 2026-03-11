#include "DroneTrafficManager.h"
#include "Engine/World.h"

ADroneTrafficManager::ADroneTrafficManager()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ADroneTrafficManager::BeginPlay()
{
    Super::BeginPlay();
    SpawnDroneSwarm();
}

void ADroneTrafficManager::SpawnDroneSwarm()
{
    if (!BaseDroneClass) return;

    for (int32 i = 0; i < MaxActiveDrones; ++i)
    {
        // Procedurally define spline paths between skyscrapers
        FVector StartLoc = FVector(FMath::RandRange(-50000.0f, 50000.0f), FMath::RandRange(-50000.0f, 50000.0f), FMath::RandRange(2000.0f, 10000.0f));
        
        FActorSpawnParameters Params;
        GetWorld()->SpawnActor<ADroneSystem>(BaseDroneClass, StartLoc, FRotator::ZeroRotator, Params);
    }
}
