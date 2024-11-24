"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import * as Tesseract from "tesseract.js";

export const MathImage: React.FC = () => {
  const [isPreview, setIsPreview] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const utils = api.useUtils();
  const extractTextMutation = api.post.solveMath.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Generate a preview URL for the image
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleExtractText = async () => {
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    try {
      const extractedText = (await Tesseract.recognize(selectedImage)).data.text;
      if(!extractedText) {
        throw new Error("No text was found in the image");
      }

      console.log("extractedText", extractedText)
      const solveSteps = await extractTextMutation.mutateAsync({text: extractedText});
      console.log("steps",solveSteps);

    } catch (error) {
      console.error("Error extracting text:", error);
      alert("Failed to extract text from the image.");
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-1/2  w-full">
      <div className=" min-h-28 content-center justify-center  bg-indigo-950">
        {!previewUrl ? (
          <>
            <div className="flex-col flex h-full w-full justify-center m-auto text-center">
            <label>Upload an image to preview it here</label>
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
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 m-auto"
          />
      <div className="mt-10"/>
      <button onClick={handleExtractText} className="m-auto w-1/2 rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20">
        <span>Submit Chosen Image</span>
      </button>
    </div>
  );
};
