import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Core un pamata lapas
import Home from './pages/Home';
import Login from './pages/Login';

// Moduļu ielāde
const Dashboard = lazy(() => import('./modules/dashboard/Dashboard'));
const ProjectBuilder = lazy(() => import('./modules/projects/ProjectBuilder'));
const CityMap = lazy(() => import('./modules/expo/CityMap'));
const AiGenerator = lazy(() => import('./modules/ai-tools/AiGenerator'));
const BusinessAccelerator = lazy(() => import('./modules/ai-tools/BusinessAccelerator'));
const AiAgentDashboard = lazy(() => import('./modules/ai-tools/AiAgentDashboard'));
const AdminFinance = lazy(() => import('./modules/finance/AdminFinance'));
const StudioMaster = lazy(() => import('./modules/finance/StudioMaster'));
const YoutubeManager = lazy(() => import('./modules/finance/YoutubeManager'));

// Kalkulatori
const RoofCalculator = lazy(() => import('./modules/calculators/RoofCalc'));
const HeatingCalculator = lazy(() => import('./modules/calculators/HeatingCalc'));
const FoundationCalculator = lazy(() => import('./modules/calculators/FoundationCalc'));
const RenovationCalculator = lazy(() => import('./modules/calculators/InteriorCalc')); 

// Expo
const Expo3D = lazy(() => import('./modules/expo/Expo3D'));
const DigitalGallery = lazy(() => import('./modules/expo/DigitalGallery'));
const ProjectorRoom = lazy(() => import('./modules/expo/ProjectorRoom'));
const BoothRoom = lazy(() => import('./pages/expo/BoothRoom'));
const CompanyAdmin = lazy(() => import('./pages/expo/CompanyAdmin'));
const Marketplace = lazy(() => import('./modules/expo/Marketplace'));
const UrgentServices = lazy(() => import('./modules/expo/UrgentServices'));
const EventsHub = lazy(() => import('./modules/expo/EventsHub'));
const AdsNetwork = lazy(() => import('./modules/expo/AdsNetwork'));
const FurnitureShowroom = lazy(() => import('./modules/expo/FurnitureShowroom'));

// Placeholders
const ClientsPlaceholder = () => <div style={{ color: 'white', padding: '100px' }}><h1>Clients Module</h1></div>;
const DocumentsPlaceholder = () => <div style={{ color: 'white', padding: '100px' }}><h1>Documents Module</h1></div>;
const SettingsPlaceholder = () => <div style={{ color: 'white', padding: '100px' }}><h1>Settings Module</h1></div>;
const CalculatorsHub = () => <div style={{ color: 'white', padding: '100px' }}><h1>Calculators Hub</h1></div>;

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ color: 'white', padding: '100px' }}>Initializing Warpala OS...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Suspense fallback={null}><Dashboard /></Suspense>} />
            <Route path="city-map" element={<Suspense fallback={null}><CityMap /></Suspense>} />
            <Route path="projects" element={<Suspense fallback={null}><ProjectBuilder /></Suspense>} />
            <Route path="clients" element={<ClientsPlaceholder />} />
            <Route path="calculators" element={<CalculatorsHub />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="urgent-services" element={<UrgentServices />} />
            <Route path="events" element={<EventsHub />} />
            <Route path="ads-network" element={<AdsNetwork />} />
            <Route path="generator" element={<Suspense fallback={null}><AiGenerator /></Suspense>} />
            <Route path="akcelerators" element={<Suspense fallback={null}><BusinessAccelerator /></Suspense>} />
            <Route path="ai-agent" element={<Suspense fallback={null}><AiAgentDashboard /></Suspense>} />
            <Route path="finances" element={<Suspense fallback={null}><AdminFinance /></Suspense>} />
            <Route path="studija" element={<Suspense fallback={null}><StudioMaster /></Suspense>} />
            <Route path="youtube" element={<Suspense fallback={null}><YoutubeManager /></Suspense>} />
            <Route path="documents" element={<DocumentsPlaceholder />} />
            <Route path="settings" element={<SettingsPlaceholder />} />
            <Route path="roof-cost-calculator" element={<Suspense fallback={null}><RoofCalculator /></Suspense>} />
            <Route path="heating-cost-calculator" element={<Suspense fallback={null}><HeatingCalculator /></Suspense>} />
            <Route path="foundation-cost-calculator" element={<Suspense fallback={null}><FoundationCalculator /></Suspense>} />
            <Route path="renovation-cost-calculator" element={<Suspense fallback={null}><RenovationCalculator /></Suspense>} />
            <Route path="izveidot-projektu" element={<Suspense fallback={null}><ProjectBuilder /></Suspense>} />
            <Route path="expo" element={<Navigate to="/expo-3d" />} />
            <Route path="expo/admin" element={<Suspense fallback={null}><CompanyAdmin /></Suspense>} />
          </Route>
          
          <Route path="/expo-3d" element={<Suspense fallback={null}><Expo3D /></Suspense>} />
          <Route path="/expo/booth/:id" element={<Suspense fallback={null}><BoothRoom /></Suspense>} />
          <Route path="/expo/showroom/:id" element={<Suspense fallback={null}><FurnitureShowroom /></Suspense>} />
          <Route path="/galerija" element={<Suspense fallback={null}><DigitalGallery /></Suspense>} />
          <Route path="/projekcija" element={<Suspense fallback={null}><ProjectorRoom /></Suspense>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
