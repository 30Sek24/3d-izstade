#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/BoxComponent.h"
#include "Components/WidgetComponent.h"
#include "Components/StaticMeshComponent.h"
#include "ExpoDataTypes.h"
#include "WarpalaCompanyBuilding.generated.h"

UCLASS()
class WARPALACITY_API AWarpalaCompanyBuilding : public AActor
{
    GENERATED_BODY()
    
public:    
    AWarpalaCompanyBuilding();

protected:
    virtual void BeginPlay() override;

public:    
    // Core structural components
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Building")
    USceneComponent* Root;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Building")
    UStaticMeshComponent* BuildingMesh;

    // Company specific features
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Company")
    UWidgetComponent* CompanyLogoWidget;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Company")
    UWidgetComponent* CompanyNameWidget;

    // --- ECONOMIC VISUALS ---
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Economy")
    UWidgetComponent* RevenueDisplayWidget;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Economy")
    UWidgetComponent* ActivityStatusWidget;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Economy")
    class UNiagaraComponent* SuccessParticles; // Glow or fireworks based on success

    // Interaction Events
    UFUNCTION(BlueprintImplementableEvent, Category = "Warpala|Interaction")
    void OnPlayerInteracted();

    UFUNCTION(BlueprintImplementableEvent, Category = "Warpala|Interaction")
    void OnBoothEntered();

    // Booth entrance
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Interaction")
    UBoxComponent* BoothEntranceTrigger;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Company")
    FString CompanyName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Company")
    FString BoothLevelName;

    UPROPERTY(BlueprintReadWrite, Category = "Warpala|Company")
    FWarpalaCompany CompanyData;

    // Initialize building with company data
    UFUNCTION(BlueprintCallable, Category = "Warpala|Building")
    void SetupCompanyData(const FWarpalaCompany& InCompanyData, const FString& InBoothLevelName);

    UFUNCTION()
    void OnEntranceOverlap(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

private:
    void UpdateEconomicVisuals();
};
