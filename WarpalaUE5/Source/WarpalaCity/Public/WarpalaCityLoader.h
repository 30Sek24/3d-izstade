#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "WarpalaExpo/Public/ExpoDataTypes.h"
#include "WarpalaNetworking/Public/WarpalaAPIClient.h"
#include "CityGenerator.h"
#include "WarpalaGlobalMapWidget.h"
#include "WarpalaCityLoader.generated.h"

UCLASS()
class WARPALACITY_API AWarpalaCityLoader : public AActor
{
    GENERATED_BODY()

public:
    AWarpalaCityLoader();

protected:
    virtual void BeginPlay() override;

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Network")
    FString BackendCitiesUrl = "http://127.0.0.1:3000/api/expo/cities";

    UPROPERTY(EditInstanceOnly, Category = "Warpala|Loader")
    ACityGenerator* ActiveCityGenerator;

    // The Global Map UI Class
    UPROPERTY(EditDefaultsOnly, Category = "Warpala|UI")
    TSubclassOf<UWarpalaGlobalMapWidget> GlobalMapWidgetClass;

    UFUNCTION(BlueprintCallable, Category = "Warpala|Travel")
    void OpenGlobalMap();

    UFUNCTION(BlueprintCallable, Category = "Warpala|Travel")
    void TravelToCity(const FString& CityId);

    UFUNCTION(BlueprintCallable, Category = "Warpala|Travel")
    void FetchAvailableCities();

    // Travel Animation Hooks
    UFUNCTION(BlueprintImplementableEvent, Category = "Warpala|Travel")
    void PlayTravelAnimation(bool bStart);

    UPROPERTY(BlueprintAssignable, Category = "Warpala|Travel")
    FOnCitiesListReceived OnCitiesListReceived;

protected:
    UPROPERTY()
    UWarpalaAPIClient* ApiClient;

    UPROPERTY()
    UWarpalaGlobalMapWidget* GlobalMapInstance;

    UFUNCTION()
    void OnCityListFetched(const TArray<FWarpalaCityMetadata>& Cities);

    UFUNCTION()
    void OnCitySelectedFromMap(const FString& CityId);

private:
    FString TargetCityId;
    void CompleteTravel();
};
