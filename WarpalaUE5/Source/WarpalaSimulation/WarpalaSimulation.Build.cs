using UnrealBuildTool;

public class WarpalaSimulation : ModuleRules
{
    public WarpalaSimulation(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

        PublicDependencyModuleNames.AddRange(new string[] { 
            "Core", 
            "CoreUObject", 
            "Engine", 
            "Niagara",
            "WarpalaExpo",
            "WarpalaNetworking"
        });
    }
}
