import React, { useState, useRef } from 'react';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { SecurityService } from '../../security/SecurityService';

interface MediaUploaderProps {
  mediaType: 'image' | 'audio';
  folder: string;
  onComplete: (url: string, metadata?: any) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  mediaType, 
  folder, 
  onComplete,
  allowedTypes = mediaType === 'image' 
    ? ['image/jpeg', 'image/png', 'image/webp'] 
    : ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  maxSizeMB = mediaType === 'image' ? 10 : 50
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Security validations
      if (!SecurityService.validateFileType(selectedFile, allowedTypes)) {
        setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
        return;
      }
      
      if (!SecurityService.validateFileSize(selectedFile, maxSizeMB)) {
        setError(`File too large. Maximum size: ${maxSizeMB}MB`);
        return;
      }
      
      // Additional security check for file name
      const sanitizedFileName = SecurityService.sanitizeInput(selectedFile.name);
      if (sanitizedFileName !== selectedFile.name) {
        setError('Invalid characters in filename');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (mediaType === 'image') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
      
      // Extract audio metadata if it's an audio file
      if (mediaType === 'audio') {
        // Basic metadata from file
        setMetadata({
          name: selectedFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
          type: selectedFile.type,
          size: selectedFile.size,
          lastModified: selectedFile.lastModified
        });
      }
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = SecurityService.sanitizeInput(value);
    setMetadata((prev: Record<string, string | number>) => ({ ...prev, [name]: sanitizedValue }));
  };

  const uploadFile = async () => {
    if (!file) return;
    
    // Final security check before upload
    if (!SecurityService.validateFileType(file, allowedTypes) || 
        !SecurityService.validateFileSize(file, maxSizeMB)) {
      setError('File validation failed');
      return;
    }
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const sanitizedFileName = SecurityService.sanitizeInput(file.name);
    const storageRef = ref(storage, `${folder}/${timestamp}-${randomId}-${sanitizedFileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file, {
      customMetadata: {
        ...metadata,
        uploadedAt: timestamp.toString(),
        originalName: sanitizedFileName
      }
    });
    
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        setError('Error uploading file: ' + error.message);
        setProgress(0);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onComplete(downloadURL, metadata);
          setProgress(0);
          setFile(null);
          setPreview(null);
          setMetadata({});
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
          console.error('Error getting download URL:', error);
          setError('Failed to complete upload');
        }
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">
        Upload {mediaType === 'image' ? 'Image' : 'Audio'}
      </h3>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="w-full mb-4"
      />
      
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      
      {file && mediaType === 'image' && preview && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-full h-auto rounded max-h-64" 
          />
        </div>
      )}
      
      {file && mediaType === 'audio' && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">File details:</p>
          <p className="text-sm">{file.name} ({Math.round(file.size / 1024)} KB)</p>
          
          {/* Audio metadata fields */}
          <div className="mt-4 space-y-2">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={metadata.title || metadata.name || ''}
                onChange={handleMetadataChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Artist</label>
              <input
                type="text"
                name="artist"
                value={metadata.artist || ''}
                onChange={handleMetadataChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Release Year</label>
              <input
                type="text"
                name="year"
                value={metadata.year || ''}
                onChange={handleMetadataChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      )}
      
      {progress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}% uploaded</p>
        </div>
      )}
      
      <button
        onClick={uploadFile}
        disabled={!file || progress > 0}
        className={`w-full py-2 px-4 rounded-md ${
          !file || progress > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Upload {mediaType === 'image' ? 'Image' : 'Audio'}
      </button>
    </div>
  );
};

export default MediaUploader;
