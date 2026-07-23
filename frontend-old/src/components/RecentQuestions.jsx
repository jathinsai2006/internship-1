function RecentQuestions({ recentQuestions }) {

  if (recentQuestions.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto mt-8">

      <div className="bg-slate-900 border border-cyan-500 rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-cyan-400">
          🕒 Recent Questions
        </h2>

        <div className="mt-5 space-y-3">

          {recentQuestions.map((question, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition"
            >
              {question}
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default RecentQuestions;