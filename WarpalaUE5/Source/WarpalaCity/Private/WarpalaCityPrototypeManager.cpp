#include "WarpalaCityPrototypeManager.h"
#include "Engine/World.h"

AWarpalaCityPrototypeManager::AWarpalaCityPrototypeManager()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    DistrictSpacing = 15000.f; // 150 meters between districts by default
}

void AWarpalaCityPrototypeManager::BeginPlay()
{
    Super::BeginPlay();
    
    // Automatically generate the city prototype in BeginPlay for the testing phase
    GenerateCityPrototype();
}

void AWarpalaCityPrototypeManager::GenerateCityPrototype()
{
    if (!DistrictClass)
    {
        UE_LOG(LogTemp, Warning, TEXT("DistrictClass is not set in WarpalaCityPrototypeManager!"));
        return;
    }

    FVector CenterLocation = GetActorLocation();

    // 1. Tech District
    SpawnDistrict(EWarpalaDistrictType::Tech, CenterLocation + FVector(DistrictSpacing, DistrictSpacing, 0.f), 16);
    
    // 2. Construction District
    SpawnDistrict(EWarpalaDistrictType::Construction, CenterLocation + FVector(DistrictSpacing, -DistrictSpacing, 0.f), 9);
    
    // 3. Design District
    SpawnDistrict(EWarpalaDistrictType::Design, CenterLocation + FVector(-DistrictSpacing, DistrictSpacing, 0.f), 12);
    
    // 4. Startup District
    SpawnDistrict(EWarpalaDistrictType::Startup, CenterLocation + FVector(-DistrictSpacing, -DistrictSpacing, 0.f), 25);
}

void AWarpalaCityPrototypeManager::SpawnDistrict(EWarpalaDistrictType Type, FVector Location, int32 PlotCount)
{
    FActorSpawnParameters SpawnParams;
    SpawnParams.Owner = this;
    SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

    AWarpalaDistrict* NewDistrict = GetWorld()->SpawnActor<AWarpalaDistrict>(DistrictClass, Location, FRotator::ZeroRotator, SpawnParams);
    if (NewDistrict)
    {
        NewDistrict->DistrictType = Type;
        NewDistrict->GenerateDistrict(PlotCount);
    }
}
