// Frontend exposure for backend expo service
import { expoService } from '../backend/expo/expoService';
import { boothService } from '../backend/expo/booths/boothService';
import { cityMapService } from '../backend/expo/city/cityMapService';
import { expoSceneService } from '../backend/expo/scenes/expoSceneService';
import { boothAnalytics } from '../backend/expo/analytics/boothAnalytics';

// Combine Phase 3 and Phase 10 APIs for Booth Data
export const ExpoDataAPI = {
  createBooth: boothService.createBooth, // Upgraded to Phase 10
  updateBooth: boothService.updateBooth, // Upgraded to Phase 10
  getBooth: boothService.getBooth,
  getBooths: boothService.listBooths, // List all
  getBoothStats: boothAnalytics.getBoothStats,
  
  // Backwards compatibility with Phase 3
  getBoothById: expoService.getBoothById,
};

// Phase 10 City Map API
export const CityMapAPI = {
  getExpoCity: cityMapService.getCityMap,
  getDistricts: cityMapService.getDistricts,
  assignBoothToDistrict: cityMapService.assignBoothToDistrict,
};

export const UnrealEngineAPI = {
  // Phase 10 specialized scene JSON outputs
  getSceneData: expoSceneService.getSceneData,
  getBoothScene: expoSceneService.getBoothScene,
  getCityMap: expoSceneService.getCityScene,
};
