#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WarpalaCompanyBuilding.h"
#include "WarpalaDistrict.generated.h"

UENUM(BlueprintType)
enum class EWarpalaDistrictType : uint8
{
    Tech UMETA(DisplayName = "Tech District"),
    Construction UMETA(DisplayName = "Construction District"),
    Design UMETA(DisplayName = "Design District"),
    Startup UMETA(DisplayName = "Startup District")
};

UCLASS()
class WARPALACITY_API AWarpalaDistrict : public AActor
{
    GENERATED_BODY()
    
public:    
    AWarpalaDistrict();

protected:
    virtual void BeginPlay() override;

public:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|District")
    USceneComponent* Root;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|District")
    EWarpalaDistrictType DistrictType;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|District")
    FVector DistrictSize;

    // The grid spacing for roads and plots
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Generation")
    float PlotSpacing;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Generation")
    TSubclassOf<AWarpalaCompanyBuilding> BuildingClass;

    UFUNCTION(BlueprintCallable, Category = "Warpala|District")
    void GenerateDistrict(int32 NumberOfPlots);

    UFUNCTION(BlueprintImplementableEvent, Category = "Warpala|District")
    void OnDistrictGenerated();

private:
    void SpawnPlots(int32 Count);
};
