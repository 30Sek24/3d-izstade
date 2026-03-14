import unreal

def build_warpala_level():
    # 1. Create a new empty level
    level_path = "/Game/Warpala/Maps/WarpalaCity_Main"
    unreal.EditorAssetLibrary.make_directory("/Game/Warpala/Maps")
    
    if unreal.EditorAssetLibrary.does_asset_exist(level_path):
        world = unreal.EditorAssetLibrary.load_asset(level_path)
    else:
        world = unreal.EditorLevelLibrary.new_level(level_path)

    # 2. Open the level
    unreal.EditorLevelLibrary.load_level(level_path)

    # 3. Spawn the core managers at 0,0,0
    unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.load_class(None, "/Game/Warpala/Blueprints/BP_CityGenerator.BP_CityGenerator_C"),
        unreal.Vector(0, 0, 0)
    )
    
    unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.load_class(None, "/Game/Warpala/Blueprints/BP_DroneTrafficManager.BP_DroneTrafficManager_C"),
        unreal.Vector(0, 0, 5000) # Spawning high up
    )

    unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.load_class(None, "/Script/WarpalaCity.CityLightingManager"),
        unreal.Vector(0, 0, 0)
    )

    unreal.EditorLevelLibrary.save_current_level()
    unreal.log("LEVEL BUILT: WarpalaCity_Main")

if __name__ == "__main__":
    build_warpala_level()
