using UnrealBuildTool;

public class WarpalaAI : ModuleRules
{
    public WarpalaAI(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

        PublicDependencyModuleNames.AddRange(new string[] { 
            "Core", 
            "CoreUObject", 
            "Engine", 
            "AIModule",
            "NavigationSystem",
            "MassEntity",
            "MassCommon",
            "MassMovement",
            "MassActors",
            "MassSpawner",
            "MassCrowd",
            "MassRepresentation",
            "WarpalaExpo",
            "WarpalaCity"
        });
    }
}
