import unreal

def create_blueprint(class_name, blueprint_name, package_path="/Game/Blueprints"):
    # Load the base class
    base_class = unreal.EditorAssetLibrary.load_class(class_name)
    if not base_class:
        unreal.log_error(f"Could not load class {class_name}")
        return None
        
    factory = unreal.BlueprintFactory()
    factory.set_editor_property("parent_class", base_class)
    
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    blueprint = asset_tools.create_asset(blueprint_name, package_path, unreal.Blueprint, factory)
    unreal.EditorAssetLibrary.save_loaded_asset(blueprint)
    unreal.log(f"Created Blueprint: {blueprint_name} at {package_path}")
    return blueprint

def setup_blueprints():
    # Ensure Blueprints directory exists (Unreal handles this during asset creation, but good practice)
    
    # 1. Player & GameMode
    bp_player = create_blueprint("/Script/WarpalaCity.WarpalaPlayerCharacter", "BP_PlayerCharacter")
    bp_gamemode = create_blueprint("/Script/Engine.GameModeBase", "BP_WarpalaGameMode")
    
    # 2. City Generation
    bp_building = create_blueprint("/Script/WarpalaCity.ProceduralBuildingManager", "BP_BuildingManager")
    bp_district = create_blueprint("/Script/WarpalaCity.DistrictManager", "BP_DistrictManager")
    bp_city = create_blueprint("/Script/WarpalaCity.CityGenerator", "BP_CityGenerator")
    
    # 3. Environment & Traffic
    bp_lighting = create_blueprint("/Script/WarpalaCity.CityLightingManager", "BP_CityLightingManager")
    bp_traffic = create_blueprint("/Script/WarpalaTraffic.DroneTrafficManager", "BP_DroneTrafficManager")

if __name__ == "__main__":
    setup_blueprints()
