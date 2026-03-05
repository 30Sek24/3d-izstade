import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Expo3D from './pages/Expo3D';
import BoothRoom from './pages/expo/BoothRoom';
import Calculator from './pages/Calculator';
import Login from './pages/Login';
import AutoserviceCalc from './pages/AutoserviceCalc';
import InteriorCalc from './pages/InteriorCalc';
import HeatingCalc from './pages/HeatingCalc';
import HousingCalc from './pages/HousingCalc';
import RoofCalc from './pages/RoofCalc';
import TimberHouseCalc from './pages/TimberHouseCalc';
import FoundationCalc from './pages/FoundationCalc';
import PlumbingCalc from './pages/PlumbingCalc';
import DesignerCalc from './pages/DesignerCalc';
import CleaningCalc from './pages/CleaningCalc';
import LogisticsCalc from './pages/LogisticsCalc';
import WindowsCalc from './pages/WindowsCalc';
import QuickFixCalc from './pages/QuickFixCalc';
import BusinessGame from './pages/BusinessGame';
import FutureOracle from './pages/FutureOracle';
import Pricing from './pages/Pricing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import MarketingAutopilot from './pages/MarketingAutopilot';
import Dashboard from './pages/Dashboard';
import DocumentHub from './pages/DocumentHub';
import SosEmergency from './pages/SosEmergency';
import AdminFinance from './pages/AdminFinance';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="dashboard" element={<Dashboard />} />
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
          <Route path="expo" element={<Expo3D />} />
          <Route path="expo/stends/:id" element={<BoothRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}