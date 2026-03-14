#include "BoothInteriorLoader.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/LevelStreaming.h"

ABoothInteriorLoader::ABoothInteriorLoader()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ABoothInteriorLoader::BeginPlay()
{
    Super::BeginPlay();
}

void ABoothInteriorLoader::LoadBoothInterior(const FName& LevelName)
{
    if (LevelName.IsNone()) return;

    UE_LOG(LogTemp, Log, TEXT("BoothInteriorLoader: Requesting load of streaming level %s"), *LevelName.ToString());

    FLatentActionInfo LatentInfo;
    LatentInfo.CallbackTarget = this;
    LatentInfo.ExecutionFunction = FName("OnLevelLoaded");
    LatentInfo.Linkage = 0;
    LatentInfo.UUID = FMath::Rand();

    if (!ActiveLoads.Contains(LevelName)) { ActiveLoads.Add(LevelName); UGameplayStatics::LoadStreamLevel(this, LevelName, true, false, LatentInfo); }
}

void ABoothInteriorLoader::UnloadBoothInterior(const FName& LevelName)
{
    if (LevelName.IsNone()) return;

    UE_LOG(LogTemp, Log, TEXT("BoothInteriorLoader: Requesting unload of streaming level %s"), *LevelName.ToString());

    FLatentActionInfo LatentInfo;
    LatentInfo.CallbackTarget = this;
    LatentInfo.ExecutionFunction = FName("OnLevelUnloaded");
    LatentInfo.Linkage = 0;
    LatentInfo.UUID = FMath::Rand();

    if (ActiveLoads.Contains(LevelName)) { ActiveLoads.Remove(LevelName); UGameplayStatics::UnloadStreamLevel(this, LevelName, LatentInfo, false); }
}

void ABoothInteriorLoader::OnLevelLoaded()
{
    UE_LOG(LogTemp, Log, TEXT("BoothInteriorLoader: Level loaded successfully."));
}

void ABoothInteriorLoader::OnLevelUnloaded()
{
    UE_LOG(LogTemp, Log, TEXT("BoothInteriorLoader: Level unloaded successfully."));
}
