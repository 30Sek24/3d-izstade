import unreal

def force_reveal_assets():
    # 1. Notify the user via a popup in Unreal
    unreal.EditorDialog.show_message(
        "Warpala System Update", 
        "Autopilot has created 10 new assets in '/Game/Warpala'. \n\nI will now open the Content Browser at this location.", 
        unreal.AppMsgType.OK
    )

    # 2. Sync the asset registry to ensure Unreal 'sees' the new files
    asset_registry = unreal.AssetRegistryHelpers.get_asset_registry()
    asset_registry.scan_paths_synchronous(["/Game/Warpala"], True)

    # 3. Force the Content Browser to focus on the Warpala folder
    unreal.EditorAssetLibrary.sync_browser_to_objects(["/Game/Warpala/Blueprints/BP_WarpalaPlayerCharacter"])

    unreal.log("Warpala assets should now be visible in the Content Browser!")

if __name__ == "__main__":
    force_reveal_assets()
