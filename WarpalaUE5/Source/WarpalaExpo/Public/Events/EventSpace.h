#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/BoxComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/WidgetComponent.h"
#include "EventSpace.generated.h"

/**
 * A dynamic event space for keynotes or large presentations within the city.
 * Features a large screen (Widget/Media) and lighting control.
 */
UCLASS()
class WARPALAEXPO_API AEventSpace : public AActor
{
    GENERATED_BODY()
    
public:    
    AEventSpace();

protected:
    virtual void BeginPlay() override;

public:    
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|EventSpace")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|EventSpace")
    UStaticMeshComponent* StageMesh;

    // Trigger area where attendees gather
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|EventSpace")
    UBoxComponent* AudienceArea;

    // Screen for presentations or video
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|EventSpace")
    UStaticMeshComponent* BigScreenMesh;

    // Optional UI Widget for 2D presentations
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|EventSpace")
    UWidgetComponent* PresentationWidget;

    // Dynamic light for the stage
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|EventSpace")
    class USpotLightComponent* StageLight;

    UFUNCTION(BlueprintCallable, Category = "Warpala|EventSpace")
    void StartEvent(const FString& EventName, const FString& VideoUrl);

    UFUNCTION(BlueprintCallable, Category = "Warpala|EventSpace")
    void EndEvent();

private:
    UFUNCTION()
    void OnAudienceEnter(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
};
