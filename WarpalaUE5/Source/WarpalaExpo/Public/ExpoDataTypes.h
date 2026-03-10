#pragma once

#include "CoreMinimal.h"
#include "ExpoDataTypes.generated.h"

USTRUCT(BlueprintType)
struct FWarpalaSector
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Id;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Name;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString ColorTheme;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FVector MapPosition;
};

USTRUCT(BlueprintType)
struct FWarpalaCompany
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Id;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString SectorId;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Name;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString LogoUrl;
};

USTRUCT(BlueprintType)
struct FWarpalaBooth
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Id;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString CompanyId;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString ModelUrl;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString VideoUrl;
};

USTRUCT(BlueprintType)
struct FWarpalaSceneData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FWarpalaSector> Sectors;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FWarpalaCompany> Companies;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FWarpalaBooth> Booths;
};
