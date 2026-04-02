import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Intro from "./components/Intro";
import Eggdle from "./components/Eggdle";
import Connections from "./components/connections/Connections";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Intro />} />
        <Route path="/eggdle" element={<Eggdle targetWord="PEEPS" />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
