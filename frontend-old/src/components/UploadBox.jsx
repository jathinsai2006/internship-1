import { useRef, useState } from "react";
import api from "../api/api";

function UploadBox({ setDocument }) {

  const fileInput = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const chooseFile = () => {
    fileInput.current.click();
  };

  const handleFileChange = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

      setUploading(true);
      setProgress(0);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const response = await api.post("/upload", formData);

      clearInterval(timer);

      setProgress(100);

      setDocument(response.data);

      setTimeout(() => {
        setUploading(false);
      }, 800);

    } catch (error) {

      console.log(error);

      setUploading(false);

      alert("Upload Failed");

    }

  };

  return (

    <div className="flex justify-center mt-10">

      <div className="w-[700px] border-2 border-dashed border-cyan-500 rounded-3xl p-10 text-center">

        <div className="text-7xl">
          📄
        </div>

        <h2 className="text-3xl font-bold mt-5">
          Upload your PDF
        </h2>

        <p className="text-gray-400 mt-3">
          Drag & Drop or Click Below
        </p>

        <input
          hidden
          type="file"
          accept=".pdf"
          ref={fileInput}
          onChange={handleFileChange}
        />

        <button
          onClick={chooseFile}
          className="mt-8 bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl"
        >
          Upload PDF
        </button>

        {uploading && (

          <div className="mt-8">

            <p className="mb-3">
              Uploading PDF...
            </p>

            <div className="w-full bg-slate-700 rounded-full h-4">

              <div
                className="bg-cyan-500 h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-3">
              {progress}%
            </p>

          </div>

        )}

        {!uploading && progress === 100 && (

          <div className="mt-8 text-green-400 text-xl font-bold">

            ✅ PDF Processed Successfully

          </div>

        )}

      </div>

    </div>

  );

}

export default UploadBox;