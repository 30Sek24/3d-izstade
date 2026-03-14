#include "NPCManager.h"
#include "Engine/World.h"
#include "Kismet/GameplayStatics.h"
#include "EngineUtils.h"

ANPCManager::ANPCManager()
{
    // No longer needs to tick! Mass handles the logic automatically.
    PrimaryActorTick.bCanEverTick = false;
    CurrentState = ENPCBehaviorState::Roaming;
}

void ANPCManager::BeginPlay()
{
    Super::BeginPlay();

    // Find the Mass Spawner in the level if not explicitly set
    if (!MassCrowdSpawner)
    {
        for (TActorIterator<AMassSpawner> It(GetWorld()); It; ++It)
        {
            MassCrowdSpawner = *It;
            break;
        }
    }

    if (!MassCrowdSpawner)
    {
        UE_LOG(LogTemp, Warning, TEXT("NPCManager: No AMassSpawner found in the level. Crowd will not spawn."));
    }
    else
    {
        UE_LOG(LogTemp, Log, TEXT("NPCManager: Linked to Mass Crowd Spawner. Handing off spawning to the Mass Framework."));
        // The MassSpawner handles the actual spawning based on its internal configuration (count, bounds, etc.)
        MassCrowdSpawner->DoSpawning();
    }

    // Bind to Global Events
    for (TActorIterator<AExpoEventManager> It(GetWorld()); It; ++It)
    {
        It->OnEventStarted.AddDynamic(this, &ANPCManager::OnGlobalEventStarted);
        It->OnEventEnded.AddDynamic(this, &ANPCManager::OnGlobalEventEnded);
        break; 
    }
}

void ANPCManager::OnGlobalEventStarted(EExpoEventType Type, FVector Location)
{
    CurrentState = ENPCBehaviorState::HeadingToEvent;
    ActivePOI = Location;
    UE_LOG(LogTemp, Log, TEXT("NPCManager: Global Event Started. Directing Mass Crowd towards POI."));
    SetCrowdFocusPoint(ActivePOI);
}

void ANPCManager::OnGlobalEventEnded()
{
    CurrentState = ENPCBehaviorState::Roaming;
    UE_LOG(LogTemp, Log, TEXT("NPCManager: Global Event Ended. Crowd returning to Roaming."));
    // Reset focus point, perhaps to origin or random
    SetCrowdFocusPoint(FVector::ZeroVector);
}

void ANPCManager::SetCrowdFocusPoint(FVector FocusLocation)
{
    // In a full Mass implementation, we would inject a Mass Fragment (e.g., FTargetLocationFragment)
    // into the Mass Entity Query here, updating the target for all entities.
    // For now, we log the architectural intent.
    UE_LOG(LogTemp, Log, TEXT("NPCManager (Mass): Injecting new Focus Location %s into Mass Entity Database."), *FocusLocation.ToString());
}
