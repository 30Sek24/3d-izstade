#include "WarpalaGlobalMapWidget.h"

void UWarpalaGlobalMapWidget::SelectCity(const FString& CityId)
{
    if (!CityId.IsEmpty())
    {
        OnCitySelected.Broadcast(CityId);
        UE_LOG(LogTemp, Log, TEXT("GlobalMap: City selected for travel: %s"), *CityId);
    }
}
