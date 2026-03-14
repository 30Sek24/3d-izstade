#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WarpalaDistrict.h"
#include "WarpalaCityPrototypeManager.generated.h"

UCLASS()
class WARPALACITY_API AWarpalaCityPrototypeManager : public AActor
{
    GENERATED_BODY()
    
public:    
    AWarpalaCityPrototypeManager();

protected:
    virtual void BeginPlay() override;

public:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|City")
    USceneComponent* Root;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|City Generation")
    TSubclassOf<AWarpalaDistrict> DistrictClass;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|City Generation")
    float DistrictSpacing;

    UFUNCTION(BlueprintCallable, Category = "Warpala|City Generation")
    void GenerateCityPrototype();

private:
    void SpawnDistrict(EWarpalaDistrictType Type, FVector Location, int32 PlotCount);
};
