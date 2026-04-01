import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Wordle from "./components/Wordle";
import Connections from "./components/connections/Connections";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/wordle" replace />} />
        <Route path="/wordle" element={<Wordle targetWord="PEEPS" />} />
        <Route path="/connections" element={<Connections />} />
      </Route>
    </Routes>
  );
}
