function FeatureCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-20">

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <div className="text-5xl">📄</div>
        <h2 className="text-2xl font-bold mt-5">Upload PDFs</h2>
        <p className="text-gray-400 mt-4">
          Upload multiple PDF documents securely.
        </p>
      </div>

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <div className="text-5xl">🤖</div>
        <h2 className="text-2xl font-bold mt-5">AI Chat</h2>
        <p className="text-gray-400 mt-4">
          Ask questions about your documents.
        </p>
      </div>

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <div className="text-5xl">⚡</div>
        <h2 className="text-2xl font-bold mt-5">Fast Search</h2>
        <p className="text-gray-400 mt-4">
          Semantic search powered by AI.
        </p>
      </div>

    </section>
  );
}

export default FeatureCards;