#include "Ads/HologramAd.h"
#include "Components/StaticMeshComponent.h"
#include "NiagaraFunctionLibrary.h"

AHologramAd::AHologramAd()
{
    PrimaryActorTick.bCanEverTick = false;

    Root = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    RootComponent = Root;

    ProjectorBase = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("ProjectorBase"));
    ProjectorBase->SetupAttachment(Root);

    HologramEffect = CreateDefaultSubobject<UNiagaraComponent>(TEXT("HologramEffect"));
    HologramEffect->SetupAttachment(ProjectorBase);
    
    HologramColor = FLinearColor(0.f, 0.8f, 1.f, 1.f); // Cyan default
}

void AHologramAd::BeginPlay()
{
    Super::BeginPlay();
    UpdateHologramVisuals();
}

void AHologramAd::UpdateHologramVisuals()
{
    if (HologramEffect)
    {
        // Pass color to the Niagara system user variables
        HologramEffect->SetVariableLinearColor(FName("User.HologramColor"), HologramColor);

        if (AdTexture)
        {
            // Pass texture to the Niagara system if supported
            HologramEffect->SetVariableTexture(FName("User.AdTexture"), AdTexture);
        }
    }
}
