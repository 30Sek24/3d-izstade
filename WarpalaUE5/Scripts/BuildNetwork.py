import unreal

def create_bp(class_path, bp_name, package_path="/Game/Warpala/Blueprints"):
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

def create_map_widget():
    package_path = "/Game/Warpala/UI"
    widget_name = "WBP_GlobalMap"
    full_path = f"{package_path}/{widget_name}"
    
    if unreal.EditorAssetLibrary.does_asset_exist(full_path):
        return unreal.load_class(None, f"{full_path}.{widget_name}_C")

    # Load the new C++ base class
    base_class = unreal.load_class(None, "/Script/WarpalaCity.WarpalaGlobalMapWidget")
    
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    factory = unreal.WidgetBlueprintFactory()
    factory.set_editor_property("parent_class", base_class)
    
    widget = asset_tools.create_asset(widget_name, package_path, unreal.WidgetBlueprint, factory)
    unreal.EditorAssetLibrary.save_loaded_asset(widget)
    unreal.log(f"SUCCESS: Created {widget_name} based on WarpalaGlobalMapWidget")
    return unreal.load_class(None, f"{full_path}.{widget_name}_C")

def build_network():
    unreal.EditorAssetLibrary.make_directory("/Game/Warpala/Blueprints")
    unreal.EditorAssetLibrary.make_directory("/Game/Warpala/UI")

    # 1. Create City Loader
    loader_class = create_bp("/Script/WarpalaCity.WarpalaCityLoader", "BP_CityLoader")
    
    # 2. Create Global Map UI
    map_widget_class = create_map_widget()

    # 3. Setup dependencies via CDO
    if loader_class and map_widget_class:
        cdo = unreal.get_default_object(loader_class)
        cdo.set_editor_property("GlobalMapWidgetClass", map_widget_class)
        # Note: In a production script we'd save the asset again
        unreal.log("Linked BP_CityLoader -> WBP_GlobalMap")

    unreal.log("--- WARPALA GLOBAL NETWORK INITIALIZED ---")

if __name__ == "__main__":
    build_network()
