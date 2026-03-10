#include "ExpoEventManager.h"
#include "Kismet/GameplayStatics.h"

AExpoEventManager::AExpoEventManager()
{
    PrimaryActorTick.bCanEverTick = true;
    bIsEventActive = false;
    TimeRemaining = 0.0f;
}

void AExpoEventManager::StartEvent(EExpoEventType EventType, FVector Location, float Duration)
{
    bIsEventActive = true;
    ActiveEventLocation = Location;
    TimeRemaining = Duration;

    UE_LOG(LogTemp, Warning, TEXT("Expo Event Started at Location: %s"), *Location.ToString());

    // Here you would broadcast an event or use the Navigation System 
    // to tell MassAI or standard AExpoVisitorAI to change their target destination
    // to this newly active Event Location.
}

void AExpoEventManager::EndEvent()
{
    bIsEventActive = false;
    UE_LOG(LogTemp, Warning, TEXT("Expo Event Ended"));

    // Notify AI to resume normal wandering
}

void AExpoEventManager::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (bIsEventActive)
    {
        TimeRemaining -= DeltaTime;
        if (TimeRemaining <= 0.0f)
        {
            EndEvent();
        }
    }
}
