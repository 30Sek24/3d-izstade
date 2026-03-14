#pragma once

#include "CoreMinimal.h"
#include "ExpoDataTypes.generated.h"

UENUM(BlueprintType)
enum class EArchitectureStyle : uint8
{
    Futuristic,
    Industrial,
    Minimalist,
    Cyberpunk
};

USTRUCT(BlueprintType)
struct WARPALAEXPO_API FWarpalaCityMetadata
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Id = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Name = "New City";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    EArchitectureStyle Style = EArchitectureStyle::Futuristic;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FVector GlobalLocation = FVector::ZeroVector;
};

USTRUCT(BlueprintType)
struct WARPALAEXPO_API FWarpalaSector
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Id = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Name = "Unnamed Sector";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString ColorTheme = "White";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FVector MapPosition = FVector::ZeroVector;
};

USTRUCT(BlueprintType)
struct WARPALAEXPO_API FWarpalaCompany
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Id = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString SectorId = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Name = "Unnamed Company";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString LogoUrl = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    float CurrentRevenue = 0.0f;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    float ActivityScore = 0.0f;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    int32 ActiveEmployees = 0;
};

USTRUCT(BlueprintType)
struct WARPALAEXPO_API FWarpalaBooth
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString Id = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString CompanyId = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString ModelUrl = "";

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FString VideoUrl = "";
};

USTRUCT(BlueprintType)
struct WARPALAEXPO_API FBuildingData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FVector RelativeLocation = FVector::ZeroVector;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    float HeightScale = 1.0f;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    int32 MeshTypeIndex = 0;
};

USTRUCT(BlueprintType)
struct WARPALAEXPO_API FCityChunkData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FIntPoint ChunkCoords = FIntPoint::ZeroValue;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FBuildingData> Buildings;
};

USTRUCT(BlueprintType)
struct WARPALAEXPO_API FWarpalaSceneData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FWarpalaCityMetadata CityInfo;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FWarpalaSector> Sectors;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FWarpalaCompany> Companies;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FWarpalaBooth> Booths;
};
