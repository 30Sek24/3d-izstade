#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "WarpalaMultiplayerManager.generated.h"

/**
 * Manages the global state of the shared Expo City across all players.
 */
UCLASS()
class WARPALACITY_API AWarpalaMultiplayerManager : public AGameStateBase
{
    GENERATED_BODY()

public:
    AWarpalaMultiplayerManager();

    // Replicated visitor count across the whole city
    UPROPERTY(Replicated, BlueprintReadOnly, Category = "Warpala|Stats")
    int32 TotalActiveVisitors;

    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
};
