import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Core un mazās lapas
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Smagās lapas un kalkulatori lādējas caur Lazy (Code Splitting)
const Expo3D = lazy(() => import('./pages/Expo3D'));
const BoothRoom = lazy(() => import('./pages/expo/BoothRoom'));
const Calculator = lazy(() => import('./pages/Calculator'));
const AutoserviceCalc = lazy(() => import('./pages/AutoserviceCalc'));
const InteriorCalc = lazy(() => import('./pages/InteriorCalc'));
const HeatingCalc = lazy(() => import('./pages/HeatingCalc'));
const HousingCalc = lazy(() => import('./pages/HousingCalc'));
const RoofCalc = lazy(() => import('./pages/RoofCalc'));
const TimberHouseCalc = lazy(() => import('./pages/TimberHouseCalc'));
const FoundationCalc = lazy(() => import('./pages/FoundationCalc'));
const PlumbingCalc = lazy(() => import('./pages/PlumbingCalc'));
const DesignerCalc = lazy(() => import('./pages/DesignerCalc'));
const CleaningCalc = lazy(() => import('./pages/CleaningCalc'));
const LogisticsCalc = lazy(() => import('./pages/LogisticsCalc'));
const WindowsCalc = lazy(() => import('./pages/WindowsCalc'));
const QuickFixCalc = lazy(() => import('./pages/QuickFixCalc'));
const BusinessGame = lazy(() => import('./pages/BusinessGame'));
const FutureOracle = lazy(() => import('./pages/FutureOracle'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const MarketingAutopilot = lazy(() => import('./pages/MarketingAutopilot'));
const DocumentHub = lazy(() => import('./pages/DocumentHub'));
const SosEmergency = lazy(() => import('./pages/SosEmergency'));
const AdminFinance = lazy(() => import('./pages/AdminFinance'));

// Loading komponente pārejas laikam
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#64748b' }}>
    Ielādē sistēmas moduļus...
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Lazy Routes */}
            <Route path="pricing" element={<Pricing />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="finances" element={<AdminFinance />} />
            <Route path="autopilots" element={<MarketingAutopilot />} />
            <Route path="dokumenti" element={<DocumentHub />} />
            <Route path="kalkulators" element={<Calculator />} />
            <Route path="apdare" element={<InteriorCalc />} />
            <Route path="apkure" element={<HeatingCalc />} />
            <Route path="autoserviss" element={<AutoserviceCalc />} />
            <Route path="majoklis" element={<HousingCalc />} />
            <Route path="jumti" element={<RoofCalc />} />
            <Route path="kokamajas" element={<TimberHouseCalc />} />
            <Route path="pamati" element={<FoundationCalc />} />
            <Route path="santehnika" element={<PlumbingCalc />} />
            <Route path="dizains" element={<DesignerCalc />} />
            <Route path="uzkopsana" element={<CleaningCalc />} />
            <Route path="sagade" element={<LogisticsCalc />} />
            <Route path="logi" element={<WindowsCalc />} />
            <Route path="uzfrisinasana" element={<QuickFixCalc />} />
            <Route path="bizness30" element={<BusinessGame />} />
            <Route path="orakuls" element={<FutureOracle />} />
            <Route path="avarija" element={<SosEmergency />} />
            
            {/* Smagākais 3D ielādes bloks */}
            <Route path="expo" element={<Expo3D />} />
            <Route path="expo/stends/:id" element={<BoothRoom />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}