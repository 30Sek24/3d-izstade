#include "WarpalaDistrict.h"
#include "Engine/World.h"
#include "WarpalaCompanyBuilding.h"

AWarpalaDistrict::AWarpalaDistrict()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    DistrictType = EWarpalaDistrictType::Tech;
    DistrictSize = FVector(10000.f, 10000.f, 100.f);
    PlotSpacing = 2000.f;
}

void AWarpalaDistrict::BeginPlay()
{
    Super::BeginPlay();
}

void AWarpalaDistrict::GenerateDistrict(int32 NumberOfPlots)
{
    SpawnPlots(NumberOfPlots);
    OnDistrictGenerated();
}

void AWarpalaDistrict::SpawnPlots(int32 Count)
{
    if (!BuildingClass) return;

    int32 GridSize = FMath::CeilToInt(FMath::Sqrt((float)Count));
    int32 Spawned = 0;

    for (int32 X = 0; X < GridSize; ++X)
    {
        for (int32 Y = 0; Y < GridSize; ++Y)
        {
            if (Spawned >= Count) break;

            FVector SpawnLocation = GetActorLocation() + FVector(X * PlotSpacing, Y * PlotSpacing, 0.f);
            FRotator SpawnRotation = FRotator::ZeroRotator;
            
            FActorSpawnParameters SpawnParams;
            SpawnParams.Owner = this;
            SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

            AWarpalaCompanyBuilding* NewBuilding = GetWorld()->SpawnActor<AWarpalaCompanyBuilding>(BuildingClass, SpawnLocation, SpawnRotation, SpawnParams);
            
            if (NewBuilding)
            {
                FWarpalaCompany TempCompany;
                TempCompany.Id = FString::Printf(TEXT("proto_comp_%d"), Spawned + 1);
                TempCompany.Name = FString::Printf(TEXT("Company %d"), Spawned + 1);
                TempCompany.ActivityScore = 0.5f;
                
                // FIXED: Using SetupCompanyData instead of SetupCompany
                NewBuilding->SetupCompanyData(TempCompany, TEXT("BoothLevel"));
            }

            Spawned++;
        }
    }
}
