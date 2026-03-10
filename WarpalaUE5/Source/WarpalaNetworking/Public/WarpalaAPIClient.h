#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
#include "ExpoDataTypes.h"
#include "WarpalaAPIClient.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnSceneDataReceived, const FWarpalaSceneData&, SceneData);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnSceneDataError, const FString&, ErrorMessage);

/**
 * Handles all communication with the Node.js Warpala backend.
 */
UCLASS(BlueprintType, Blueprintable)
class WARPALANETWORKING_API UWarpalaAPIClient : public UObject
{
    GENERATED_BODY()

public:
    UWarpalaAPIClient();

    UPROPERTY(BlueprintAssignable, Category = "Warpala|API")
    FOnSceneDataReceived OnSceneDataReceived;

    UPROPERTY(BlueprintAssignable, Category = "Warpala|API")
    FOnSceneDataError OnSceneDataError;

    UFUNCTION(BlueprintCallable, Category = "Warpala|API")
    void FetchExpoScene(FString BaseUrl);

private:
    void OnFetchCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
    FWarpalaSceneData ParseSceneData(const FString& JsonString);
};
