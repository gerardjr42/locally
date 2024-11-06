'use client';

import { useState } from 'react';
import { handleFileUpload } from './uploadEvents';

export default function AdminUploadPage() {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {  
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      await handleFileUpload({ target: { files: [file] } });
      console.log('File uploaded successfully');
    }
  };

  return (
    <div>
      <h1>Admin Upload Page</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} accept=".json" />
        <button type="submit">Upload Events</button>
      </form>
    </div>
  );
}
