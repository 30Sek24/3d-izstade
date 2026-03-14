#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "WarpalaPlayerCharacter.generated.h"

UCLASS()
class WARPALACITY_API AWarpalaPlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AWarpalaPlayerCharacter();

protected:
    virtual void BeginPlay() override;

public:    
    virtual void Tick(float DeltaTime) override;
    virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    class USpringArmComponent* CameraBoom;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    class UCameraComponent* FollowCamera;

    // --- MULTIPLAYER ---
    
    // The player's display name, replicated to others
    UPROPERTY(Replicated, EditAnywhere, BlueprintReadWrite, Category = "Warpala|Multiplayer")
    FString PlayerDisplayName;

    // Called on server to set name
    UFUNCTION(Server, Reliable, BlueprintCallable, Category = "Warpala|Multiplayer")
    void Server_SetDisplayName(const FString& NewName);

    // --- INTERACTION ---

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Warpala|Interaction")
    float InteractionDistance = 500.f;

    UFUNCTION(BlueprintCallable, Category = "Warpala|Interaction")
    void Interact();

    UFUNCTION(BlueprintImplementableEvent, Category = "Warpala|Interaction")
    void OnFocusedInteractableChanged(AActor* NewFocus);

protected:
    void MoveForward(float Value);
    void MoveRight(float Value);

    // Networking Setup
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

private:
    AActor* CurrentFocusedActor;
    void PerformInteractionTrace();
};
