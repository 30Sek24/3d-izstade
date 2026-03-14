#include "Events/EventSpace.h"
#include "Components/SpotLightComponent.h"
#include "GameFramework/Character.h"

AEventSpace::AEventSpace()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    StageMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StageMesh"));
    StageMesh->SetupAttachment(Root);

    BigScreenMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BigScreenMesh"));
    BigScreenMesh->SetupAttachment(StageMesh);

    PresentationWidget = CreateDefaultSubobject<UWidgetComponent>(TEXT("PresentationWidget"));
    PresentationWidget->SetupAttachment(BigScreenMesh);
    PresentationWidget->SetWidgetSpace(EWidgetSpace::World);

    AudienceArea = CreateDefaultSubobject<UBoxComponent>(TEXT("AudienceArea"));
    AudienceArea->SetupAttachment(StageMesh);
    AudienceArea->SetBoxExtent(FVector(2000.f, 2000.f, 500.f));

    StageLight = CreateDefaultSubobject<USpotLightComponent>(TEXT("StageLight"));
    StageLight->SetupAttachment(StageMesh);
    StageLight->SetIntensity(0.f); // Off by default
}

void AEventSpace::BeginPlay()
{
    Super::BeginPlay();
    AudienceArea->OnComponentBeginOverlap.AddDynamic(this, &AEventSpace::OnAudienceEnter);
}

void AEventSpace::StartEvent(const FString& EventName, const FString& VideoUrl)
{
    UE_LOG(LogTemp, Log, TEXT("EventSpace: Starting Event - %s"), *EventName);

    // Turn on the spotlight with a bright, dynamic Lumen bounce
    StageLight->SetIntensity(100000.f); 

    // In Blueprints, we would load the VideoUrl into a UMediaPlayer and apply it to a Material on the BigScreenMesh
}

void AEventSpace::EndEvent()
{
    UE_LOG(LogTemp, Log, TEXT("EventSpace: Ending Event"));
    StageLight->SetIntensity(0.f);
}

void AEventSpace::OnAudienceEnter(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if (Cast<ACharacter>(OtherActor))
    {
        // Could trigger UI prompt or audio volume change
    }
}
