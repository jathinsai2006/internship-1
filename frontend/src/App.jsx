import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadBox from "./components/UploadBox";
import FeatureCards from "./components/FeatureCards";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <UploadBox />
      <FeatureCards />
    </div>
  );
}

export default App;