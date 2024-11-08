"use client";

import { useState } from "react";
import { handleFileUpload } from "./uploadEvents";

export default function AdminUploadPage() {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      await handleFileUpload({ target: { files: [file] } });
      console.log("File uploaded successfully");
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Upload NYC Events</h1>
            <p className="py-6">
              Upload a JSON file from NYC Department of Parks & Recreation OpenData containing event data to update the Locally Events database.
            </p>
            <form onSubmit={onSubmit}>
              <input className="file-input file-input-bordered w-full max-w-xs" type="file" onChange={onFileChange} accept=".json" />
              <button type="submit" className="btn">
                Upload Events
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
