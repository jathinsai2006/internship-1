function DocumentCard({ document }) {

    if (!document) return null;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-slate-900 rounded-2xl p-6 border border-cyan-500">

            <h2 className="text-3xl font-bold text-cyan-400">
                📄 Uploaded Document
            </h2>

            <div className="mt-6 space-y-3 text-lg">

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
                        Processed Successfully
                    </span>
                </p>

            </div>

        </div>
    );
}

export default DocumentCard;