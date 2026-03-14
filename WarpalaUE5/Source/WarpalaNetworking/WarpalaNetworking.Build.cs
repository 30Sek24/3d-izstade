using UnrealBuildTool;

public class WarpalaNetworking : ModuleRules
{
    public WarpalaNetworking(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

        PublicDependencyModuleNames.AddRange(new string[] { 
            "Core", 
            "CoreUObject", 
            "Engine", 
            "HTTP", 
            "Json", 
            "JsonUtilities", 
            "WarpalaExpo" 
        });
    }
}
