#include "ExpoEventManager.h"
#include "Kismet/GameplayStatics.h"
#include "EngineUtils.h"
#include "Net/UnrealNetwork.h"

AExpoEventManager::AExpoEventManager()
{
    PrimaryActorTick.bCanEverTick = true;
    bIsEventActive = false;
    
    // Enable Replication
    bReplicates = true;
    bAlwaysRelevant = true;
}

void AExpoEventManager::BeginPlay()
{
    Super::BeginPlay();

    // Find all stages in the world
    for (TActorIterator<AEventSpace> It(GetWorld()); It; ++It)
    {
        AvailableStages.Add(*It);
    }
}

void AExpoEventManager::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AExpoEventManager, bIsEventActive);
    DOREPLIFETIME(AExpoEventManager, ActiveEventLocation);
}

void AExpoEventManager::OnRep_EventActive()
{
    if (bIsEventActive)
    {
        OnEventStarted.Broadcast(EExpoEventType::ExpoStage, ActiveEventLocation);
    }
    else
    {
        OnEventEnded.Broadcast();
    }
}

void AExpoEventManager::TriggerGlobalEvent(EExpoEventType EventType, FString EventName, FString VideoUrl)
{
    // Must be called on server
    if (!HasAuthority()) return;

    if (AvailableStages.Num() == 0) return;

    int32 RandomIdx = FMath::RandRange(0, AvailableStages.Num() - 1);
    AEventSpace* SelectedStage = AvailableStages[RandomIdx];

    if (SelectedStage)
    {
        bIsEventActive = true;
        ActiveEventLocation = SelectedStage->GetActorLocation();
        TimeRemaining = 300.0f;

        // Visual trigger on server
        SelectedStage->StartEvent(EventName, VideoUrl);
        
        // Notify local server listeners
        OnRep_EventActive();
        
        UE_LOG(LogTemp, Log, TEXT("ExpoEventManager: Global Event Started on Server: %s"), *EventName);
    }
}

void AExpoEventManager::EndEvent()
{
    if (!HasAuthority() || !bIsEventActive) return;

    bIsEventActive = false;
    
    for (AEventSpace* Stage : AvailableStages)
    {
        Stage->EndEvent();
    }

    OnRep_EventActive();
    UE_LOG(LogTemp, Log, TEXT("ExpoEventManager: Global Event Ended on Server"));
}

void AExpoEventManager::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    if (HasAuthority() && bIsEventActive)
    {
        TimeRemaining -= DeltaTime;
        if (TimeRemaining <= 0)
        {
            EndEvent();
        }
    }
}
