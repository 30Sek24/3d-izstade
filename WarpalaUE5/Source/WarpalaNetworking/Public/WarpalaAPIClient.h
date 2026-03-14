#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
#include "ExpoDataTypes.h"
#include "WarpalaAPIClient.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnSceneDataReceived, const FWarpalaSceneData&, SceneData);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnCitiesListReceived, const TArray<FWarpalaCityMetadata>&, Cities);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnSceneDataError, const FString&, ErrorMessage);

/**
 * Handles all communication with the Node.js Warpala backend.
 * Now supports Hardened API Key authentication.
 */
UCLASS(BlueprintType, Blueprintable)
class WARPALANETWORKING_API UWarpalaAPIClient : public UObject
{
    GENERATED_BODY()

public:
    UWarpalaAPIClient();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|API")
    FString ApiKey = "warpala-ue5-bridge-2026";

    UPROPERTY(BlueprintAssignable, Category = "Warpala|API")
    FOnSceneDataReceived OnSceneDataReceived;

    UPROPERTY(BlueprintAssignable, Category = "Warpala|API")
    FOnCitiesListReceived OnCitiesListReceived;

    UPROPERTY(BlueprintAssignable, Category = "Warpala|API")
    FOnSceneDataError OnSceneDataError;

    UFUNCTION(BlueprintCallable, Category = "Warpala|API")
    void FetchExpoScene(FString BaseUrl);

    UFUNCTION(BlueprintCallable, Category = "Warpala|API")
    void FetchCities(FString BaseUrl);

private:
    void OnFetchCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
    void OnFetchCitiesCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
    
    FWarpalaSceneData ParseSceneData(const FString& JsonString);
    TArray<FWarpalaCityMetadata> ParseCitiesData(const FString& JsonString);
};
