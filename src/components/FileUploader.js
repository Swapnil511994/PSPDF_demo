import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    onDrop,
  });

  return (
    <div {...getRootProps()} style={{ padding: '20px', border: '1px dashed #ccc' }}>
      <input {...getInputProps()} />
      <p>Drag & drop a PDF file here, or click to select a file</p>
    </div>
  );
};

export default FileUploader;
