#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "WarpalaExpo/Public/ExpoDataTypes.h"
#include "WarpalaGlobalMapWidget.generated.h"

/**
 * Base class for the Global World Map UI.
 * Populates city list and handles selection for travel.
 */
UCLASS()
class WARPALACITY_API UWarpalaGlobalMapWidget : public UUserWidget
{
    GENERATED_BODY()

public:
    // Called when the city list is received from the API
    UFUNCTION(BlueprintImplementableEvent, Category = "Warpala|GlobalMap")
    void UpdateCityList(const TArray<FWarpalaCityMetadata>& Cities);

    // Triggered when a player selects a city on the map
    UFUNCTION(BlueprintCallable, Category = "Warpala|GlobalMap")
    void SelectCity(const FString& CityId);

    // Delegate to notify the Loader to start travel
    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnCitySelected, const FString&, CityId);
    UPROPERTY(BlueprintAssignable, Category = "Warpala|GlobalMap")
    FOnCitySelected OnCitySelected;
};
