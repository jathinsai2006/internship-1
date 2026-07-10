function DocumentCard({ document }) {

    if (!document) return null;

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-slate-900 rounded-2xl p-8 border border-cyan-500 shadow-lg">

            <h2 className="text-3xl font-bold text-cyan-400">
                📄 Uploaded Document
            </h2>

            <div className="mt-6 space-y-4 text-lg">

                <p>
                    <strong>Filename:</strong> {document.original_filename}
                </p>

                <p>
                    <strong>Pages:</strong> {document.pages}
                </p>

                <p>
                    <strong>Characters:</strong> {document.characters}
                </p>

                <p>
                    <strong>Status:</strong>
                    <span className="text-green-400 ml-2">
                        ✅ Processed Successfully
                    </span>
                </p>

            </div>

            {/* Text Preview */}

            <div className="mt-10">

                <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                    📖 Text Preview
                </h2>

                <div className="bg-slate-950 border border-slate-700 rounded-xl p-5 h-80 overflow-y-auto">

                    <pre className="whitespace-pre-wrap text-gray-300 text-sm">
                        {document.text}
                    </pre>

                </div>

            </div>

        </div>
    );
}

export default DocumentCard;