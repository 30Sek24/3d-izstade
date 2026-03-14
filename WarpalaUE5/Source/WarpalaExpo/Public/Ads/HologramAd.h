#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "NiagaraComponent.h"
#include "HologramAd.generated.h"

/**
 * A volumetric holographic advertisement projector using Niagara particles.
 * Placed on top of buildings or in public squares to give a cyberpunk/futuristic feel.
 */
UCLASS()
class WARPALAEXPO_API AHologramAd : public AActor
{
    GENERATED_BODY()
    
public:    
    AHologramAd();

protected:
    virtual void BeginPlay() override;

public:    
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Ads")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Ads")
    class UStaticMeshComponent* ProjectorBase;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Ads")
    UNiagaraComponent* HologramEffect;

    // Controls the color of the hologram particles
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Ads")
    FLinearColor HologramColor;

    // Optional texture to project (read by Niagara through a texture sample)
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Ads")
    class UTexture2D* AdTexture;

    UFUNCTION(BlueprintCallable, Category = "Warpala|Ads")
    void UpdateHologramVisuals();
};
