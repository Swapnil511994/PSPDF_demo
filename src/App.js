import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import PdfViewerComponent from './components/PdfViewerComponent';
import './App.css';

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileUpload = (file) => {
    // console.log(file);
    setPdfFile(file);
  };

  return (
    <div className="App">
      {/* <h1>PDF Form Editor</h1> */}
      {!pdfFile && <FileUploader onFileUpload={handleFileUpload} /> }
      {
        pdfFile && 
        <div className="App">
          <div className="PDF-viewer">
            <PdfViewerComponent
              document={`test_pdfs/${pdfFile.name}`}
            />
          </div>
        </div>
      }
    </div>
  );
};

export default App;
