#include "Ads/InteractiveScreen.h"
#include "Materials/MaterialInstanceDynamic.h"

AInteractiveScreen::AInteractiveScreen()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    ScreenMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("ScreenMesh"));
    ScreenMesh->SetupAttachment(Root);
}

void AInteractiveScreen::BeginPlay()
{
    Super::BeginPlay();

    if (ScreenMesh)
    {
        UMaterialInterface* BaseMat = ScreenMesh->GetMaterial(0);
        if (BaseMat)
        {
            DynamicMaterial = ScreenMesh->CreateDynamicMaterialInstance(0, BaseMat);
        }
    }
}

void AInteractiveScreen::PlayCompanyVideo(const FString& CompanyName, UTexture* VideoTexture)
{
    if (DynamicMaterial && VideoTexture)
    {
        DynamicMaterial->SetTextureParameterValue(VideoParamName, VideoTexture);
        UE_LOG(LogTemp, Log, TEXT("InteractiveScreen: Playing video for %s"), *CompanyName);
    }
}

void AInteractiveScreen::ResetToDefault()
{
    // Implementation could reset to a default Warpala logo or idle loop
}
