#include "DroneTrafficManager.h"

ADroneTrafficManager::ADroneTrafficManager()
{
    // Turn off Tick! The GPU will handle everything now.
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    DroneNiagaraComponent = CreateDefaultSubobject<UNiagaraComponent>(TEXT("DroneNiagaraComponent"));
    DroneNiagaraComponent->SetupAttachment(Root);
    DroneNiagaraComponent->bAutoActivate = false;
}

void ADroneTrafficManager::BeginPlay()
{
    Super::BeginPlay();
    InitializeTraffic();
}

void ADroneTrafficManager::InitializeTraffic()
{
    if (DroneSwarmSystem)
    {
        DroneNiagaraComponent->SetAsset(DroneSwarmSystem);
        
        // Pass our variables to the Niagara System
        DroneNiagaraComponent->SetVariableInt(TEXT("SpawnCount"), MaxDrones);
        DroneNiagaraComponent->SetVariableVec3(TEXT("Bounds"), FlightBounds);
        DroneNiagaraComponent->SetVariableFloat(TEXT("BaseAltitude"), BaseAltitude);
        
        DroneNiagaraComponent->Activate();
        
        UE_LOG(LogTemp, Log, TEXT("DroneTrafficManager: Initialized %d GPU Drones via Niagara."), MaxDrones);
    }
    else
    {
        UE_LOG(LogTemp, Warning, TEXT("DroneTrafficManager: No DroneSwarmSystem assigned. Assign a Niagara System in Blueprint."));
    }
}
