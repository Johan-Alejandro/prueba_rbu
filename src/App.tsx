import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Developers from "./pages/Developers";
import Projects from "./pages/Projects";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Developers />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Layout>
  );
}

export default App;
