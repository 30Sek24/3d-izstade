#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
#include "WarpalaImageDownloader.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnImageDownloaded, UTexture2D*, DownloadedTexture);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnImageDownloadFailed, const FString&, ErrorMessage);

/**
 * Handles async downloading of company logos and UI assets at runtime.
 */
UCLASS(BlueprintType, Blueprintable)
class WARPALANETWORKING_API UWarpalaImageDownloader : public UObject
{
    GENERATED_BODY()

public:
    UWarpalaImageDownloader();

    UPROPERTY(BlueprintAssignable, Category = "Warpala|Network")
    FOnImageDownloaded OnSuccess;

    UPROPERTY(BlueprintAssignable, Category = "Warpala|Network")
    FOnImageDownloadFailed OnFailure;

    UFUNCTION(BlueprintCallable, Category = "Warpala|Network")
    void DownloadImage(const FString& Url);

private:
    void OnImageRequestCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
};
