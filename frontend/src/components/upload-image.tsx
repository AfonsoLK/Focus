"use client";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { SingleImageDropzone } from "./single-drop";

interface UploadImageProps {
  onUploadComplete?: (url: string) => void;
}

export default function UploadImage({ onUploadComplete }: UploadImageProps) {
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();

  return (
    <div className="flex flex-col items-center m6 gap-2">
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        onChange={async (file) => {
          setFile(file);
          if (file) {
            const res = await edgestore.publicFiles.upload({ file });
            onUploadComplete?.(res.url);
          }
        }}
      />
    </div>
  );
}
