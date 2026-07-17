import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Sidebar from "./components/Sidebar";
import UploadBox from "./components/UploadBox";
import StatsCards from "./components/StatsCards";
import DocumentInfo from "./components/DocumentInfo";
import ChatBox from "./components/ChatBox";
import SummaryCard from "./components/SummaryCard";
import FeatureCards from "./components/FeatureCards";
import RecentQuestions from "./components/RecentQuestions";

function App() {
  const [document, setDocument] = useState(null);
  const [summary, setSummary] = useState("");
  const [recentQuestions, setRecentQuestions] = useState([]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar document={document} />

        <div className="flex-1 p-8">
          <Hero />

          <UploadBox setDocument={setDocument} />

          <StatsCards document={document} />

          <DocumentInfo document={document} />

          <ChatBox
            recentQuestions={recentQuestions}
            setRecentQuestions={setRecentQuestions}
          />

          <RecentQuestions
            recentQuestions={recentQuestions}
          />

          <SummaryCard
            summary={summary}
            setSummary={setSummary}
          />

          <FeatureCards />
        </div>
      </div>
    </div>
  );
}

export default App;