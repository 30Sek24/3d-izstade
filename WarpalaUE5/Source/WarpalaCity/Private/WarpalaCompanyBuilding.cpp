#include "WarpalaCompanyBuilding.h"
#include "Kismet/GameplayStatics.h"
#include "NiagaraComponent.h"

AWarpalaCompanyBuilding::AWarpalaCompanyBuilding()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    BuildingMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BuildingMesh"));
    BuildingMesh->SetupAttachment(Root);

    // Basic Info Widgets
    CompanyLogoWidget = CreateDefaultSubobject<UWidgetComponent>(TEXT("CompanyLogoWidget"));
    CompanyLogoWidget->SetupAttachment(BuildingMesh);
    CompanyLogoWidget->SetWidgetSpace(EWidgetSpace::World);
    CompanyLogoWidget->SetDrawAtDesiredSize(true);

    CompanyNameWidget = CreateDefaultSubobject<UWidgetComponent>(TEXT("CompanyNameWidget"));
    CompanyNameWidget->SetupAttachment(BuildingMesh);
    CompanyNameWidget->SetWidgetSpace(EWidgetSpace::World);
    CompanyNameWidget->SetDrawAtDesiredSize(true);

    // Economic Widgets
    RevenueDisplayWidget = CreateDefaultSubobject<UWidgetComponent>(TEXT("RevenueDisplayWidget"));
    RevenueDisplayWidget->SetupAttachment(BuildingMesh);
    RevenueDisplayWidget->SetWidgetSpace(EWidgetSpace::World);
    RevenueDisplayWidget->SetDrawAtDesiredSize(true);

    ActivityStatusWidget = CreateDefaultSubobject<UWidgetComponent>(TEXT("ActivityStatusWidget"));
    ActivityStatusWidget->SetupAttachment(BuildingMesh);
    ActivityStatusWidget->SetWidgetSpace(EWidgetSpace::World);
    ActivityStatusWidget->SetDrawAtDesiredSize(true);

    SuccessParticles = CreateDefaultSubobject<UNiagaraComponent>(TEXT("SuccessParticles"));
    SuccessParticles->SetupAttachment(BuildingMesh);

    BoothEntranceTrigger = CreateDefaultSubobject<UBoxComponent>(TEXT("BoothEntranceTrigger"));
    BoothEntranceTrigger->SetupAttachment(BuildingMesh);
    BoothEntranceTrigger->SetBoxExtent(FVector(100.f, 100.f, 100.f));
    BoothEntranceTrigger->SetCollisionProfileName(TEXT("Trigger"));
}

void AWarpalaCompanyBuilding::BeginPlay()
{
    Super::BeginPlay();
    BoothEntranceTrigger->OnComponentBeginOverlap.AddDynamic(this, &AWarpalaCompanyBuilding::OnEntranceOverlap);
}

void AWarpalaCompanyBuilding::SetupCompanyData(const FWarpalaCompany& InCompanyData, const FString& InBoothLevelName)
{
    CompanyData = InCompanyData;
    CompanyName = InCompanyData.Name;
    BoothLevelName = InBoothLevelName;

    UpdateEconomicVisuals();
}

void AWarpalaCompanyBuilding::UpdateEconomicVisuals()
{
    // Adjust building glow based on success (ActivityScore)
    if (BuildingMesh)
    {
        UMaterialInstanceDynamic* DynMat = BuildingMesh->CreateDynamicMaterialInstance(0);
        if (DynMat)
        {
            // Success ranges from 0.0 to 1.0. We map it to emissive intensity.
            float Intensity = FMath::Lerp(1.0f, 10.0f, CompanyData.ActivityScore);
            DynMat->SetScalarParameterValue(TEXT("EmissiveIntensity"), Intensity);
            
            // Adjust color based on sector or activity
            FLinearColor ActivityColor = FLinearColor::LerpUsingHSV(FLinearColor::Red, FLinearColor::Green, CompanyData.ActivityScore);
            DynMat->SetVectorParameterValue(TEXT("ActivityColor"), ActivityColor);
        }
    }

    // Adjust particles based on high success
    if (SuccessParticles)
    {
        if (CompanyData.ActivityScore > 0.8f)
        {
            SuccessParticles->Activate();
        }
        else
        {
            SuccessParticles->Deactivate();
        }
    }
}

void AWarpalaCompanyBuilding::OnEntranceOverlap(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if (OtherActor && OtherActor != this && !BoothLevelName.IsEmpty())
    {
        OnBoothEntered(); // Notify Blueprint
        UGameplayStatics::OpenLevel(GetWorld(), FName(*BoothLevelName));
    }
}
