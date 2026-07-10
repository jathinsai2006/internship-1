import { useRef , useState } from "react";
import api from "../api/api";

function UploadBox() {
  const fileInput = useRef(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  

  const chooseFile = () => {
    fileInput.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData);

      alert("✅ " + response.data.message);
      setDocumentInfo(response.data);

      console.log(response.data);
    } catch (error) {
      console.error(error);

      alert("Upload Failed");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-[650px] h-[280px] border-2 border-dashed border-cyan-500 rounded-3xl flex flex-col justify-center items-center hover:bg-slate-900 transition">

        <div className="text-7xl">📄</div>

        <h2 className="text-3xl font-bold mt-5">
          Drag & Drop PDF Here
        </h2>

        <p className="text-gray-400 mt-3">
          or click below to upload
        </p>

        <input
          type="file"
          accept=".pdf"
          ref={fileInput}
          onChange={handleFileChange}
          hidden
        />

        <button
          onClick={chooseFile}
          className="mt-8 bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl"
        >
          Upload PDF
        </button>

      </div>
    </div>
  );
}

export default UploadBox;