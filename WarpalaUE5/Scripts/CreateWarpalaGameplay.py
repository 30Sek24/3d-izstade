import unreal

def create_blueprint(class_path, blueprint_name, package_path="/Game/Warpala/Blueprints"):
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    
    # Check if already exists
    full_path = f"{package_path}/{blueprint_name}"
    if unreal.EditorAssetLibrary.does_asset_exist(full_path):
        unreal.log(f"Asset already exists: {full_path}")
        return unreal.EditorAssetLibrary.load_asset(full_path)

    # In newer UE versions, we use unreal.load_class instead of EditorAssetLibrary.load_class
    base_class = unreal.load_class(None, class_path)
    if not base_class:
        unreal.log_error(f"Could not load class {class_path}. Ensure the C++ modules are compiled and loaded.")
        return None
        
    factory = unreal.BlueprintFactory()
    factory.set_editor_property("parent_class", base_class)
    
    blueprint = asset_tools.create_asset(blueprint_name, package_path, unreal.Blueprint, factory)
    
    if blueprint:
        unreal.EditorAssetLibrary.save_loaded_asset(blueprint)
        unreal.log(f"Created Blueprint: {blueprint_name} at {package_path}")
    return blueprint

def create_widget(widget_name, package_path="/Game/Warpala/UI"):
    full_path = f"{package_path}/{widget_name}"
    if unreal.EditorAssetLibrary.does_asset_exist(full_path):
        return unreal.EditorAssetLibrary.load_asset(full_path)

    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    factory = unreal.WidgetBlueprintFactory()
    
    widget_blueprint = asset_tools.create_asset(widget_name, package_path, unreal.WidgetBlueprint, factory)
    if widget_blueprint:
        unreal.EditorAssetLibrary.save_loaded_asset(widget_blueprint)
        unreal.log(f"Created Widget: {widget_name} at {package_path}")
    return widget_blueprint

def setup_warpala_assets():
    # Ensure directories exist
    unreal.EditorAssetLibrary.make_directory("/Game/Warpala/Blueprints")
    unreal.EditorAssetLibrary.make_directory("/Game/Warpala/UI")

    # 1. Blueprints
    # Note: Using the short script names usually registered in UHT
    create_blueprint("/Script/WarpalaCity.ProceduralBuildingManager", "BP_ProceduralBuildingManager")
    create_blueprint("/Script/WarpalaCity.WarpalaCompanyBuilding", "BP_WarpalaCompanyBuilding")
    create_blueprint("/Script/WarpalaCity.WarpalaDistrict", "BP_WarpalaDistrict")
    create_blueprint("/Script/WarpalaCity.WarpalaPlayerCharacter", "BP_WarpalaPlayerCharacter")
    create_blueprint("/Script/WarpalaAI.NPCManager", "BP_NPCManager")
    create_blueprint("/Script/WarpalaTraffic.DroneTrafficManager", "BP_DroneTrafficManager")
    
    # 2. UI Widgets
    create_widget("WBP_CompanyProfile")
    create_widget("WBP_EventScreen")
    create_widget("WBP_BuildingEntry")

    # 3. GameMode Setup
    create_blueprint("/Script/Engine.GameModeBase", "BP_WarpalaGameMode")

if __name__ == "__main__":
    setup_warpala_assets()
