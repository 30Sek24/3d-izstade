#include "ExpoVisitorAI.h"
#include "NavigationSystem.h"
#include "Navigation/PathFollowingComponent.h"
#include "Kismet/GameplayStatics.h"

AExpoVisitorAI::AExpoVisitorAI()
{
    PrimaryActorTick.bCanEverTick = true;
    bIsWatchingScreen = false;
    WatchTimer = 0.0f;
}

void AExpoVisitorAI::BeginPlay()
{
    Super::BeginPlay();
    PickNextDestination();
}

void AExpoVisitorAI::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (bIsWatchingScreen)
    {
        WatchTimer -= DeltaTime;
        if (WatchTimer <= 0.0f)
        {
            bIsWatchingScreen = false;
            PickNextDestination();
        }
    }
    else
    {
        if (GetMoveStatus() == EPathFollowingStatus::Idle)
        {
            HandleArrival();
        }
    }
}

void AExpoVisitorAI::PickNextDestination()
{
    UNavigationSystemV1* NavSys = UNavigationSystemV1::GetCurrent(GetWorld());
    if (NavSys && GetPawn())
    {
        FNavLocation RandomLoc;
        // Wander radius of 500 meters
        if (NavSys->GetRandomReachablePointInRadius(GetPawn()->GetActorLocation(), 50000.0f, RandomLoc))
        {
            CurrentDestination = RandomLoc.Location;
            MoveToLocation(CurrentDestination, 100.0f);
        }
    }
}

void AExpoVisitorAI::HandleArrival()
{
    // Simulate watching a booth screen or talking
    bIsWatchingScreen = true;
    WatchTimer = FMath::RandRange(5.0f, 15.0f);
}
