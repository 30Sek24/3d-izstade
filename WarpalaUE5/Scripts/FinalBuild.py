import unreal

def create_bp(class_path, bp_name):
    package_path = "/Game/Warpala/Blueprints"
    full_path = f"{package_path}/{bp_name}"
    if unreal.EditorAssetLibrary.does_asset_exist(full_path):
        return unreal.load_class(None, f"{full_path}.{bp_name}_C")
    
    base_class = unreal.load_class(None, class_path)
    if not base_class:
        unreal.log_error(f"FAIL: Could not load C++ class {class_path}")
        return None
        
    factory = unreal.BlueprintFactory()
    factory.set_editor_property("parent_class", base_class)
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    bp = asset_tools.create_asset(bp_name, package_path, unreal.Blueprint, factory)
    unreal.EditorAssetLibrary.save_loaded_asset(bp)
    unreal.log(f"SUCCESS: Created {bp_name}")
    return unreal.load_class(None, f"{full_path}.{bp_name}_C")

def build_everything():
    unreal.EditorAssetLibrary.make_directory("/Game/Warpala/Blueprints")
    unreal.EditorAssetLibrary.make_directory("/Game/Warpala/Maps")

    # 1. Create/Load Blueprints
    city_gen_class = create_bp("/Script/WarpalaCity.CityGenerator", "BP_CityGenerator")
    drone_class = create_bp("/Script/WarpalaTraffic.DroneTrafficManager", "BP_DroneTrafficManager")
    event_mgr_class = create_bp("/Script/WarpalaExpo.ExpoEventManager", "BP_ExpoEventManager")
    npc_mgr_class = create_bp("/Script/WarpalaAI.NPCManager", "BP_NPCManager")
    
    # ADDED: Create Event Space Blueprint
    event_space_class = create_bp("/Script/WarpalaExpo.EventSpace", "BP_EventSpace")
    # ADDED: Create Interactive Screen Blueprint
    screen_class = create_bp("/Script/WarpalaExpo.InteractiveScreen", "BP_InteractiveScreen")
    
    # 2. Setup Level
    level_path = "/Game/Warpala/Maps/WarpalaCity_Main"
    level_sub = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
    if not unreal.EditorAssetLibrary.does_asset_exist(level_path):
        level_sub.new_level(level_path)
    
    level_sub.load_level(level_path)

    # 3. Spawn Core Actors
    unreal.EditorLevelLibrary.spawn_actor_from_class(city_gen_class, unreal.Vector(0, 0, 0))
    unreal.EditorLevelLibrary.spawn_actor_from_class(drone_class, unreal.Vector(0, 0, 5000))
    unreal.EditorLevelLibrary.spawn_actor_from_class(event_mgr_class, unreal.Vector(0, 0, 0))
    unreal.EditorLevelLibrary.spawn_actor_from_class(npc_mgr_class, unreal.Vector(0, 0, 0))

    unreal.EditorLevelLibrary.save_current_level()
    unreal.log("--- WARPALA CITY V2.1 (EVENTS ADDED) BUILT SUCCESSFULLY ---")

if __name__ == "__main__":
    build_everything()
