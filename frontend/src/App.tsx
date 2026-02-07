import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import GenerationForm from "./components/generation/GenerationForm";
import HistoryGallery from "./components/history/HistoryGallery";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<GenerationForm />} />
        <Route path="/history" element={<HistoryGallery />} />
      </Routes>
    </Layout>
  );
}

export default App;
