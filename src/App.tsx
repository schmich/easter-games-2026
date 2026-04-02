import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Loading from "./components/Loading";
import Intro from "./components/Intro";
import Eggdle from "./components/eggdle/Eggdle";
import Conneggtions from "./components/conneggtions/Conneggtions";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Loading />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/eggdle" element={<Eggdle targetWord="PEEPS" />} />
        <Route path="/conneggtions" element={<Conneggtions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
