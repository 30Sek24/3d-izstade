using UnrealBuildTool;

public class WarpalaExpo : ModuleRules
{
    public WarpalaExpo(ReadOnlyTargetRules Target) : base(Target)
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
            "Niagara"
        });
    }
}
