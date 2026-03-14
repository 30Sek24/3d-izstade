#include "WarpalaMultiplayerManager.h"
#include "Net/UnrealNetwork.h"

AWarpalaMultiplayerManager::AWarpalaMultiplayerManager()
{
    TotalActiveVisitors = 0;
}

void AWarpalaMultiplayerManager::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AWarpalaMultiplayerManager, TotalActiveVisitors);
}
