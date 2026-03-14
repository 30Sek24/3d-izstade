using UnrealBuildTool;

public class WarpalaCity : ModuleRules
{
    public WarpalaCity(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

        PublicDependencyModuleNames.AddRange(new string[] { 
            "Core", 
            "CoreUObject", 
            "Engine", 
            "InputCore", 
            "UMG", 
            "NavigationSystem", 
            "AIModule",
            "Niagara",
            "PCG",
            "WarpalaExpo",
            "WarpalaNetworking",
            "WarpalaSimulation"
        });
    }
}
