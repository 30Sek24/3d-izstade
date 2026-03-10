#include "DroneSystem.h"

ADroneSystem::ADroneSystem()
{
    PrimaryActorTick.bCanEverTick = true;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    DronePath = CreateDefaultSubobject<USplineComponent>(TEXT("DronePath"));
    DronePath->SetupAttachment(Root);
    DronePath->bClosedLoop = true;

    CurrentDistanceAlongSpline = 0.0f;
    TypeOfDrone = EDroneType::CameraDrone;
}

void ADroneSystem::BeginPlay()
{
    Super::BeginPlay();
    TotalSplineLength = DronePath->GetSplineLength();
}

void ADroneSystem::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (TotalSplineLength > 0.0f)
    {
        CurrentDistanceAlongSpline += FlightSpeed * DeltaTime;
        
        // Loop back to start if we exceed the length
        if (CurrentDistanceAlongSpline >= TotalSplineLength)
        {
            CurrentDistanceAlongSpline -= TotalSplineLength;
        }

        // Get new location and rotation from spline
        FVector NewLocation = DronePath->GetLocationAtDistanceAlongSpline(CurrentDistanceAlongSpline, ESplineCoordinateSpace::World);
        FRotator NewRotation = DronePath->GetRotationAtDistanceAlongSpline(CurrentDistanceAlongSpline, ESplineCoordinateSpace::World);

        // In a real implementation, we would update the Instanced Static Mesh transform here
        // or update the attached physical Drone Actor. For massive scales, ISM is preferred.
        SetActorLocationAndRotation(NewLocation, NewRotation);
    }
}
