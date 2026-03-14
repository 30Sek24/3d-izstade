import unreal

def glue_multiplayer():
    package_path = "/Game/Warpala/Blueprints"
    bp_name = "BP_MultiplayerManager"
    full_path = f"{package_path}/{bp_name}"
    
    # Check if C++ class is available
    cpp_class_path = "/Script/WarpalaCity.WarpalaMultiplayerManager"
    base_class = unreal.load_class(None, cpp_class_path)
    
    if not base_class:
        unreal.log_error(f"FATAL: C++ class '{cpp_class_path}' not found! Please press Ctrl+Alt+F11 in Unreal or Rebuild in Visual Studio.")
        return

    if not unreal.EditorAssetLibrary.does_asset_exist(full_path):
        factory = unreal.BlueprintFactory()
        factory.set_editor_property("parent_class", base_class)
        asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
        bp = asset_tools.create_asset(bp_name, package_path, unreal.Blueprint, factory)
        unreal.EditorAssetLibrary.save_loaded_asset(bp)
        unreal.log(f"✅ Created {bp_name}")

    # Link to GameMode
    gamemode_bp = unreal.EditorAssetLibrary.load_asset("/Game/Warpala/Blueprints/BP_WarpalaGameMode")
    if gamemode_bp:
        gen_class = unreal.load_class(None, "/Game/Warpala/Blueprints/BP_WarpalaGameMode.BP_WarpalaGameMode_C")
        target_class = unreal.load_class(None, f"{full_path}.{bp_name}_C")
        
        if gen_class and target_class:
            cdo = unreal.get_default_object(gen_class)
            cdo.set_editor_property("game_state_class", target_class)
            unreal.EditorAssetLibrary.save_loaded_asset(gamemode_bp)
            unreal.log("✅ Linked BP_WarpalaGameMode -> BP_MultiplayerManager")

    unreal.log("--- MULTIPLAYER SETUP COMPLETE ---")

if __name__ == "__main__":
    glue_multiplayer()
