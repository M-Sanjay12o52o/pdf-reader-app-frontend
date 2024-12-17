import React, { useState } from "react";
import axios from "axios";

function App() {
  // State for selected file and extracted PDF data
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<{ text: string; info: any } | null>(null);
  const [extractedValues, setExtractedValues] = useState<{ DBD?: string; DOWNPAYMENT?: string } | null>(null);

  console.log("selectedFile: ", selectedFile);
  console.log("pdfData: ", pdfData);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload and PDF data extraction
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    console.log("formData: ", formData);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Set extracted PDF data
      setPdfData(response.data);

      setExtractedValues(response.data.extractedValues)
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">PDF Reader App</h1>

      {/* File Upload Section */}
      <div className="w-full max-w-md">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleUpload}
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Upload and Extract
        </button>
      </div>

      {/* Extracted PDF Data */}
      {pdfData && (
        <div className="w-full max-w-2xl mt-10 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Extracted Data:</h2>
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">DBD:</h3>
            {/* <pre className="bg-gray-100 p-3 rounded text-sm text-gray-600 overflow-x-auto"> */}
            {/* {pdfData.text} */}
            {/* </pre> */}
            <p className="bg-gray-100 p-3 rounded text-sm text-gray-600 overflow-x-auto">
              {/* {pdfData.text} */}
              {extractedValues?.DBD || "Not found"}
            </p>
          </div>
          {/* <div>
            <h3 className="font-medium text-gray-700">Metadata:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm text-gray-600 overflow-x-auto">
              {JSON.stringify(pdfData.info, null, 2)}
            </pre>
          </div> */}
          <div>
            <h3 className="font-medium text-gray-700">Down Payment:</h3>
            <p className="bg-gray-100 p-3 rounded text-sm text-gray-600">
              {extractedValues?.DOWNPAYMENT || "Not found"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
