using UnrealBuildTool;

public class WarpalaTraffic : ModuleRules
{
    public WarpalaTraffic(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

        PublicDependencyModuleNames.AddRange(new string[] { 
            "Core", 
            "CoreUObject", 
            "Engine", 
            "Niagara",
            "WarpalaExpo",
            "WarpalaCity"
        });
    }
}
