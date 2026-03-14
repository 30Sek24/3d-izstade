#include "Player/WarpalaPlayerCharacter.h"
#include "GameFramework/SpringArmComponent.h"
#include "Camera/CameraComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Net/UnrealNetwork.h"

AWarpalaPlayerCharacter::AWarpalaPlayerCharacter()
{
    PrimaryActorTick.bCanEverTick = true;

    // Enable Replication
    bReplicates = true;
    ACharacter::SetReplicateMovement(true);

    bUseControllerRotationPitch = false;
    bUseControllerRotationYaw = false;
    bUseControllerRotationRoll = false;

    GetCharacterMovement()->bOrientRotationToMovement = true;
    GetCharacterMovement()->RotationRate = FRotator(0.0f, 500.0f, 0.0f);

    CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
    CameraBoom->SetupAttachment(RootComponent);
    CameraBoom->TargetArmLength = 400.0f; 
    CameraBoom->bUsePawnControlRotation = true;

    FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
    FollowCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
    FollowCamera->bUsePawnControlRotation = false; 

    InteractionDistance = 600.f;
    PlayerDisplayName = TEXT("Warpala Explorer");
}

void AWarpalaPlayerCharacter::BeginPlay()
{
    Super::BeginPlay();
}

void AWarpalaPlayerCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    
    // Interaction trace only on local player
    if (IsLocallyControlled())
    {
        PerformInteractionTrace();
    }
}

void AWarpalaPlayerCharacter::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AWarpalaPlayerCharacter, PlayerDisplayName);
}

void AWarpalaPlayerCharacter::Server_SetDisplayName_Implementation(const FString& NewName)
{
    PlayerDisplayName = NewName;
}

void AWarpalaPlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    PlayerInputComponent->BindAxis("MoveForward", this, &AWarpalaPlayerCharacter::MoveForward);
    PlayerInputComponent->BindAxis("MoveRight", this, &AWarpalaPlayerCharacter::MoveRight);
    
    PlayerInputComponent->BindAxis("Turn", this, &APawn::AddControllerYawInput);
    PlayerInputComponent->BindAxis("LookUp", this, &APawn::AddControllerPitchInput);

    PlayerInputComponent->BindAction("Interact", IE_Pressed, this, &AWarpalaPlayerCharacter::Interact);
}

void AWarpalaPlayerCharacter::Interact()
{
    if (CurrentFocusedActor)
    {
        UE_LOG(LogTemp, Log, TEXT("Interacting with: %s"), *CurrentFocusedActor->GetName());
    }
}

void AWarpalaPlayerCharacter::PerformInteractionTrace()
{
    if (!FollowCamera) return;

    FHitResult HitResult;
    FVector Start = FollowCamera->GetComponentLocation();
    FVector End = Start + (FollowCamera->GetForwardVector() * InteractionDistance);

    FCollisionQueryParams TraceParams;
    TraceParams.AddIgnoredActor(this);

    AActor* NewFocus = nullptr;
    if (GetWorld()->LineTraceSingleByChannel(HitResult, Start, End, ECC_Visibility, TraceParams))
    {
        NewFocus = HitResult.GetActor();
    }

    if (NewFocus != CurrentFocusedActor)
    {
        CurrentFocusedActor = NewFocus;
        OnFocusedInteractableChanged(CurrentFocusedActor);
    }
}

void AWarpalaPlayerCharacter::MoveForward(float Value)
{
    if ((Controller != nullptr) && (Value != 0.0f))
    {
        const FRotator Rotation = Controller->GetControlRotation();
        const FRotator YawRotation(0, Rotation.Yaw, 0);
        const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
        AddMovementInput(Direction, Value);
    }
}

void AWarpalaPlayerCharacter::MoveRight(float Value)
{
    if ((Controller != nullptr) && (Value != 0.0f))
    {
        const FRotator Rotation = Controller->GetControlRotation();
        const FRotator YawRotation(0, Rotation.Yaw, 0);
        const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);
        AddMovementInput(Direction, Value);
    }
}
