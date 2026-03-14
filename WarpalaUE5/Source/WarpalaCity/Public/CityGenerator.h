#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CityGenerator.generated.h"

class UStaticMesh;

UCLASS()
class WARPALACITY_API ACityGenerator : public AActor
{
    GENERATED_BODY()

public:
    ACityGenerator();

protected:
    virtual void BeginPlay() override;

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala")
    int GridSize = 20;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala")
    float Spacing = 600;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala")
    TArray<UStaticMesh*> BuildingMeshes;

    UFUNCTION(BlueprintCallable, Category = "Warpala")
    void GenerateCity();
};
