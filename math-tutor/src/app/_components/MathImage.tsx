"use client";

import React, { useState } from "react";

export const MathImage: React.FC = () => {
  const [isPreview, setIsPreview] = useState(true);
  const [selectedImage, setSelectedFile] = useState<File | undefined>(
    undefined,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Generate a preview URL for the image
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-1/2  w-full">
      <div className=" min-h-28 content-center justify-center  bg-indigo-950">
        {!previewUrl ? (
          <>
            <div className="flex-col flex h-full w-full justify-center m-auto">
            <label htmlFor=" fileUpload">Upload Image</label>
            </div>
          </>
        ) : (
          <img
            src={previewUrl}
            alt="Selected"
            className="h-full w-full max-w-96 m-auto object-contain"
          />
        )}
      </div>
      <div className="mt-10"/>

      <input
          id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 m-auto"
          />
      <div className="mt-10"/>
      <button className="m-auto w-1/2 rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20">
        <span>Submit Chosen Image</span>
      </button>
    </div>
  );
};
