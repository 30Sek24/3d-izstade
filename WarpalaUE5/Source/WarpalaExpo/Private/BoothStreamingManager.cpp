#include "BoothStreamingManager.h"
#include "Kismet/GameplayStatics.h"

ABoothStreamingManager::ABoothStreamingManager()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ABoothStreamingManager::LoadBoothInterior(const FString& CompanyId, FName LevelName)
{
    CurrentStreamingLevel = LevelName;
    
    // Asynchronously load the level containing the heavy assets (video walls, 8K textures)
    FLatentActionInfo LatentInfo;
    LatentInfo.CallbackTarget = this;
    LatentInfo.ExecutionFunction = FName("OnLevelLoaded");
    LatentInfo.Linkage = 0;
    LatentInfo.UUID = 100;

    UGameplayStatics::LoadStreamLevel(this, LevelName, true, false, LatentInfo);
}

void ABoothStreamingManager::OnLevelLoaded()
{
    UE_LOG(LogTemp, Log, TEXT("Booth Interior Loaded Seamlessly"));
    // Here we can initialize dynamic video URL injections onto the level's screens
}

void ABoothStreamingManager::UnloadBoothInterior(FName LevelName)
{
    FLatentActionInfo LatentInfo;
    UGameplayStatics::UnloadStreamLevel(this, LevelName, LatentInfo, false);
}
