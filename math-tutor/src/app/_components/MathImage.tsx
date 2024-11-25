"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import * as Tesseract from "tesseract.js";

interface MathSolve {
  firstNumber: number;
  secondNumber: number;
  steps: Array<string>;
}

export const MathImage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [solveSteps, setSolveSteps] = useState<string[] | null>(null);
  const solveMathMutation = api.post.solveMath.useMutation();

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
      const extractedText = (await Tesseract.recognize(selectedImage)).data
        .text;
      if (!extractedText) {
        throw new Error("No text was found in the image");
      }

      const solveObjString = await solveMathMutation.mutateAsync({
        text: extractedText,
      });
      let solvedObj: MathSolve = JSON.parse(solveObjString.solution);
      console.log({ solvedObj });
      let tempSteps = solvedObj.steps.slice(0, solvedObj.steps.length - 1);
      tempSteps.push(
        `The result should be ${solvedObj.firstNumber * solvedObj.secondNumber}`,
      );
      setSolveSteps(tempSteps);
    } catch (error) {
      alert("Failed to extract text from the image.");
    }
  };

  return (
    <div className="flex h-1/2 w-full flex-col space-y-4">
      <h1 className="text-2xl">This only works for 2 value multiplication problems!</h1>
      <div className="min-h-28 content-center justify-center bg-indigo-950">
        {!previewUrl ? (
          <>
            <div className="m-auto flex h-full w-full flex-col justify-center text-center">
              <label>Upload an image to preview it here</label>
            </div>
          </>
        ) : (
          <img
            src={previewUrl}
            alt="Selected"
            className="m-auto h-full w-full max-w-96 object-contain"
          />
        )}
      </div>
      <div className="mt-10" />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="m-auto mt-2"
      />
      <div className="mt-10" />
      <button
        disabled={solveMathMutation.isPending}
        onClick={handleExtractText}
        className="m-auto w-1/2 rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
      >
        <span>Submit Chosen Image</span>
      </button>
      <div className="mt-10" />
      {solveSteps ? (
        <div>
          <h2 className="text-lg" >Steps to solve the problem</h2>
          <div className="mt-5" />
          {solveSteps.map((val, i) => (
            <>
              <p key={i}>{val}</p>
              <div className="mt-5" />
            </>
          ))}
        </div>
      ) : null}
    </div>
  );
};
