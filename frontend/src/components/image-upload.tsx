import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { uploadToMinio } from "../services/minio.service";
import { useState } from "react";

export function ImageUpload() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadKey, setUploadKey] = useState(0);

  const handleFileUpload = async (files: FileList) => {
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const url = await uploadToMinio(file);
        newUrls.push(url);
      } catch (error) {
        console.error("Failed to upload file:", file.name);
      }
    }

    setUploadedUrls((prev) => [...prev, ...newUrls]);
    setUploadKey((prev) => prev + 1); // Reset the input after upload
  };

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">Anexos</Label>
        <Input
          key={uploadKey}
          id="file"
          type="file"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (!files?.length) return;
            handleFileUpload(files);
          }}
        />
        <div
          id="preview-container"
          className="flex gap-2 flex-wrap mt-2 max-h-[200px] max-w-[200px] overflow-y-auto p-1"
        >
          {uploadedUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-20 h-20 object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
