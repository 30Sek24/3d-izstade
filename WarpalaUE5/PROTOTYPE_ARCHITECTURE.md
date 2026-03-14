# Warpala Expo City - Prototype Architecture

This document outlines the architectural structure of the first prototype of Warpala Expo City, built in Unreal Engine 5 using C++ and Blueprints, leveraging Nanite, Lumen, and World Partition.

## 1. Core Architecture (C++)

The core structure of the city is generated procedurally using a set of hierarchical manager classes.

### 1.1 `AWarpalaCityPrototypeManager`
- **Role:** Master orchestrator for the city prototype.
- **Responsibility:** Spawns the four main districts around a central point.
- **Properties:**
  - `DistrictClass`: The blueprint class to use for district generation.
  - `DistrictSpacing`: The distance between districts.
- **Districts Spawned:** Tech, Construction, Design, Startup.

### 1.2 `AWarpalaDistrict`
- **Role:** Manager for a specific district.
- **Responsibility:** Generates plots and procedural company buildings within its bounds based on its `EWarpalaDistrictType`.
- **Properties:**
  - `DistrictType`: Enum defining the visual and logical type (Tech, Construction, Design, Startup).
  - `PlotSpacing`: The grid spacing defining the plots.
  - `BuildingClass`: The blueprint class representing a company building.

### 1.3 `AWarpalaCompanyBuilding`
- **Role:** The procedural building generator.
- **Responsibility:** Represents a plot containing a company building.
- **Components:**
  - `UStaticMeshComponent`: The building structure (utilizing Nanite).
  - `UWidgetComponent` (CompanyLogoWidget): Displays the company logo in world space.
  - `UWidgetComponent` (CompanyNameWidget): Displays the company name in world space.
  - `UBoxComponent` (BoothEntranceTrigger): A trigger box representing the booth entrance.
- **Features:** 
  - `SetupCompany()` dynamically assigns the name and logo.
  - Overlapping the `BoothEntranceTrigger` transitions the player to the booth level using `UGameplayStatics::OpenLevel`.

---

## 2. Blueprint Implementation Steps

To fully implement this prototype in UE5 Editor:

### Step 1: Create Blueprint Classes
1. **BP_CompanyBuilding**: Inherit from `AWarpalaCompanyBuilding`.
   - Set a default static mesh for `BuildingMesh` (ensure Nanite is enabled).
   - Create a UserWidget (`WBP_CompanyLogo` and `WBP_CompanyName`) and assign them to the `CompanyLogoWidget` and `CompanyNameWidget` component classes.
   - Set the `BoothEntranceTrigger` extent to cover the front door.
2. **BP_District**: Inherit from `AWarpalaDistrict`.
   - Set the `BuildingClass` to `BP_CompanyBuilding`.
3. **BP_CityPrototypeManager**: Inherit from `AWarpalaCityPrototypeManager`.
   - Set the `DistrictClass` to `BP_District`.

### Step 2: Set up World Partition and Lumen
1. Create a new Level (`WarpalaCityPrototype`).
2. In World Settings, ensure **Enable World Partition** is checked.
3. Drop `BP_CityPrototypeManager` into the center of the world at (0, 0, 0).
4. Ensure Project Settings -> Rendering -> Global Illumination is set to **Lumen**.
5. Add a Directional Light, Sky Light, Exponential Height Fog, and Sky Atmosphere for standard lighting.

### Step 3: Player Integration
1. Ensure the default `GameMode` specifies a Player Character class that has movement input set up (e.g., ThirdPersonCharacter or FirstPersonCharacter).
2. The Player Character will spawn at PlayerStart.
3. When the Player Character walks into the `BoothEntranceTrigger` of a building, `OnEntranceOverlap` is triggered, loading the specific booth level.

### Step 4: Roads and Public Spaces
*In this prototype, roads and public spaces are represented by the spacing between generated elements.*
- The gap between `AWarpalaDistrict` actors serves as main highways and public spaces.
- The `PlotSpacing` variable within `AWarpalaDistrict` defines the local roads and pedestrian walkways.
- To expand this visually: A separate `AWarpalaRoadNetwork` system can be added to spawn spline meshes along these gaps.

---

## 3. Tech Stack Usage
- **Unreal Engine 5:** Core engine.
- **C++:** Core generation logic (`SpawnActor`, spatial math, overlap events).
- **Blueprints:** Visual configuration (Assigning meshes, widget classes).
- **Nanite:** Enabled on `UStaticMeshComponent` inside `BP_CompanyBuilding` to allow thousands of buildings efficiently.
- **Lumen:** Provides dynamic global illumination for the procedural city.
- **World Partition:** Automatically handles streaming of the generated city grid.