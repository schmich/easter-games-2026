import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Intro from "./components/Intro";
import Wordle from "./components/Wordle";
import Connections from "./components/connections/Connections";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Intro />} />
        <Route path="/wordle" element={<Wordle targetWord="PEEPS" />} />
        <Route path="/connections" element={<Connections />} />
      </Route>
    </Routes>
  );
}
