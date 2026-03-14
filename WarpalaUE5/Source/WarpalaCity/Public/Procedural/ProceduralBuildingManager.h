#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "PCGComponent.h"
#include "WarpalaExpo/Public/ExpoDataTypes.h"
#include "ProceduralBuildingManager.generated.h"

/**
 * AAA Scalable Building Manager using Unreal Engine 5's native PCG framework.
 * This replaces the manual HISM instantiation loop, pushing logic to the PCG Graph.
 */
UCLASS()
class WARPALACITY_API AProceduralBuildingManager : public AActor
{
    GENERATED_BODY()
    
public:    
    AProceduralBuildingManager();

    UFUNCTION(BlueprintCallable, Category = "Warpala|Performance")
    void ClearCity();

    UFUNCTION(BlueprintCallable, Category = "Warpala|Spawning")
    void GenerateBuildings(const TArray<FWarpalaCompany>& Companies, const TArray<FWarpalaBooth>& AllBooths);

    // The PCG component that will run our generation graph
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Warpala|Spawning")
    UPCGComponent* PCGComponent;

    // We can expose the graph parameters so artists can tweak it
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Spawning")
    float PlotSize = 3000.f;

protected:
    virtual void BeginPlay() override;
};
