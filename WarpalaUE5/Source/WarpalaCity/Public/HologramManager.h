#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/StaticMeshComponent.h"
#include "HologramManager.generated.h"

/**
 * Controls Cyberpunk-style giant floating holograms and LED billboards.
 */
UCLASS()
class WARPALACITY_API AHologramManager : public AActor
{
    GENERATED_BODY()

public:
    AHologramManager();

    UFUNCTION(BlueprintCallable, Category = "Warpala|Visuals")
    void SpawnGiantHologram(FVector Location, UMaterialInterface* HologramMaterial);

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    USceneComponent* Root;
};
