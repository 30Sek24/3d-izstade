#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/StaticMeshComponent.h"
#include "InteractiveScreen.generated.h"

/**
 * Large screens throughout the city that display company marketing videos.
 * Can be dynamically updated by the EventManager or based on player proximity.
 */
UCLASS()
class WARPALAEXPO_API AInteractiveScreen : public AActor
{
    GENERATED_BODY()
    
public:    
    AInteractiveScreen();

protected:
    virtual void BeginPlay() override;

public:    
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Screen")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Screen")
    UStaticMeshComponent* ScreenMesh;

    // The name of the material parameter to update with the video texture
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Screen")
    FName VideoParamName = "VideoTexture";

    UFUNCTION(BlueprintCallable, Category = "Warpala|Screen")
    void PlayCompanyVideo(const FString& CompanyName, class UTexture* VideoTexture);

    UFUNCTION(BlueprintCallable, Category = "Warpala|Screen")
    void ResetToDefault();

private:
    UPROPERTY()
    UMaterialInstanceDynamic* DynamicMaterial;
};
