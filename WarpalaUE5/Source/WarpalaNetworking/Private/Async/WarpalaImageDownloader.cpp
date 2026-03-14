#include "Async/WarpalaImageDownloader.h"
#include "IImageWrapper.h"
#include "IImageWrapperModule.h"
#include "Modules/ModuleManager.h"
#include "Engine/Texture2D.h"

UWarpalaImageDownloader::UWarpalaImageDownloader()
{
}

void UWarpalaImageDownloader::DownloadImage(const FString& Url)
{
    if (Url.IsEmpty())
    {
        OnFailure.Broadcast(TEXT("Empty URL provided"));
        return;
    }

    FHttpModule* Http = &FHttpModule::Get();
    if (!Http) return;

    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = Http->CreateRequest();
    Request->OnProcessRequestComplete().BindUObject(this, &UWarpalaImageDownloader::OnImageRequestCompleted);
    Request->SetURL(Url);
    Request->SetVerb("GET");
    Request->ProcessRequest();
}

void UWarpalaImageDownloader::OnImageRequestCompleted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
    if (bWasSuccessful && Response.IsValid() && Response->GetResponseCode() == 200)
    {
        IImageWrapperModule& ImageWrapperModule = FModuleManager::LoadModuleChecked<IImageWrapperModule>(FName("ImageWrapper"));
        
        // Let the module auto-detect format based on header data

        const TArray<uint8>& ImageData = Response->GetContent();
        TSharedPtr<IImageWrapper> ImageWrapper = ImageWrapperModule.CreateImageWrapper(ImageWrapperModule.DetectImageFormat(ImageData.GetData(), ImageData.Num()));

        if (ImageWrapper.IsValid() && ImageWrapper->SetCompressed(ImageData.GetData(), ImageData.Num()))
        {
            TArray<uint8> UncompressedBGRA;
            if (ImageWrapper->GetRaw(ERGBFormat::BGRA, 8, UncompressedBGRA))
            {
                // Create Texture
                UTexture2D* NewTexture = UTexture2D::CreateTransient(ImageWrapper->GetWidth(), ImageWrapper->GetHeight(), PF_B8G8R8A8);
                if (NewTexture)
                {
                    void* TextureData = NewTexture->GetPlatformData()->Mips[0].BulkData.Lock(LOCK_READ_WRITE);
                    FMemory::Memcpy(TextureData, UncompressedBGRA.GetData(), UncompressedBGRA.Num());
                    NewTexture->GetPlatformData()->Mips[0].BulkData.Unlock();
                    
                    NewTexture->UpdateResource();

                    OnSuccess.Broadcast(NewTexture);
                    return;
                }
            }
        }
    }

    OnFailure.Broadcast(TEXT("Failed to download or decode image"));
}
