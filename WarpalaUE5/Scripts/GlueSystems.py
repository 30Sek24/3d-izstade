import unreal

def glue_warpala_systems():
    def set_bp_default(bp_path, prop_name, value_class_path):
        # Load the BP asset
        bp_asset = unreal.EditorAssetLibrary.load_asset(bp_path)
        if not bp_asset:
            return False
            
        # Get the Generated Class
        gen_class = unreal.load_class(None, f"{bp_path}.{bp_asset.get_name()}_C")
        if not gen_class:
            return False
            
        # Get the value class (the one we want to assign)
        value_class = unreal.load_class(None, f"{value_class_path}_C")
        if not value_class:
            # Try without _C just in case it's a native class
            value_class = unreal.load_class(None, value_class_path)
            
        if gen_class and value_class:
            # Set the property on the Class Default Object (CDO)
            cdo = unreal.get_default_object(gen_class)
            try:
                cdo.set_editor_property(prop_name, value_class)
                unreal.EditorAssetLibrary.save_loaded_asset(bp_asset)
                return True
            except Exception as e:
                unreal.log_warning(f"Could not set {prop_name}: {e}")
        return False

    # 1. Link CityGenerator -> DistrictManager
    if set_bp_default("/Game/Warpala/Blueprints/BP_CityGenerator", "DistrictManagerClass", "/Game/Warpala/Blueprints/BP_WarpalaDistrict"):
        unreal.log("✅ Linked BP_CityGenerator -> BP_WarpalaDistrict")

    # 2. Link WarpalaDistrict -> CompanyBuilding
    if set_bp_default("/Game/Warpala/Blueprints/BP_WarpalaDistrict", "BuildingClass", "/Game/Warpala/Blueprints/BP_WarpalaCompanyBuilding"):
        unreal.log("✅ Linked BP_WarpalaDistrict -> BP_WarpalaCompanyBuilding")

    # 3. Link GameMode -> PlayerCharacter
    if set_bp_default("/Game/Warpala/Blueprints/BP_WarpalaGameMode", "DefaultPawnClass", "/Game/Warpala/Blueprints/BP_WarpalaPlayerCharacter"):
        unreal.log("✅ Linked BP_WarpalaGameMode -> BP_WarpalaPlayerCharacter")

    unreal.log("--- ALL SYSTEMS GLUED VIA CDO ---")

if __name__ == "__main__":
    glue_warpala_systems()
