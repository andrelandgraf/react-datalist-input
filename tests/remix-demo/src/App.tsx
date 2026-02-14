import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { DemoPage } from "./pages/DemoPage";
import { MultiSelectPage } from "./pages/MultiSelectPage";
import { CustomOptionsPage } from "./pages/CustomOptionsPage";
import { LargePage } from "./pages/LargePage";
import { SelectPage } from "./pages/SelectPage";
import { NamedInputPage } from "./pages/NamedInputPage";
import { StylingPage } from "./pages/StylingPage";
import { HomePage } from "./pages/HomePage";

const links = [
  { to: "/home", label: "Home" },
  { to: "/demo", label: "Demo" },
  { to: "/multi-select", label: "Multi select" },
  { to: "/custom-options", label: "Custom options" },
  { to: "/large", label: "Large list" },
  { to: "/select", label: "Select mode" },
  { to: "/named-input", label: "Named input" },
  { to: "/styling", label: "Styling" },
];

export default function App() {
  return (
    <div>
      <header className="top-nav">
        <h1>react-datalist-input demos</h1>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/multi-select" element={<MultiSelectPage />} />
          <Route path="/custom-options" element={<CustomOptionsPage />} />
          <Route path="/large" element={<LargePage />} />
          <Route path="/select" element={<SelectPage />} />
          <Route path="/named-input" element={<NamedInputPage />} />
          <Route path="/styling" element={<StylingPage />} />
        </Routes>
      </main>
    </div>
  );
}
