import unreal

def open_warpala_assets():
    # Load the player character asset
    player_bp = unreal.EditorAssetLibrary.load_asset("/Game/Warpala/Blueprints/BP_WarpalaPlayerCharacter")
    
    if player_bp:
        # This will literally force Unreal to open the Blueprint Editor window for this asset
        unreal.AssetToolsHelpers.get_asset_tools().open_editor_for_assets([player_bp])
        unreal.log("FORCING OPEN: BP_WarpalaPlayerCharacter")
    else:
        unreal.log_error("Could not find the asset to open!")

if __name__ == "__main__":
    open_warpala_assets()
