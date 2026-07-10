import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadBox from "./components/UploadBox";
import FeatureCards from "./components/FeatureCards";
import DocumentCard from "./components/DocumentCard";

function App() {

  const [document, setDocument] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <Hero />

      <UploadBox setDocument={setDocument} />

      <DocumentCard document={document} />

      <FeatureCards />

    </div>
  );
}

export default App;