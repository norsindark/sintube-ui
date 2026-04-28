import axios from "axios";
import { videoService } from "@/services/videoService";
import type { VideoUploadResponse } from "@/types/media/upload";

export const SIMPLE_UPLOAD_THRESHOLD = 1000 * 1024 * 1024; // 10MB
export const MULTIPART_CHUNK_SIZE = 5000 * 1024 * 1024; // 5MB

export interface MultipartUploadOptions {
  file: File;
  title?: string;
  description?: string;
  chunkSize?: number;
  onProgress?: (percent: number) => void;
}

export async function uploadInMultipart({
  file,
  title,
  description,
  chunkSize = MULTIPART_CHUNK_SIZE,
  onProgress,
}: MultipartUploadOptions): Promise<VideoUploadResponse> {
  const totalParts = Math.ceil(file.size / chunkSize);

  const { key, uploadId } = await videoService.initMultipartUpload(
    file.name,
    file.type || "application/octet-stream",
  );

  const completedParts: {
    partNumber: number;
    etag: string;
  }[] = [];

  const partProgress = new Array<number>(totalParts).fill(0);

  const reportProgress = () => {
    if (!onProgress) return;
    const totalLoaded = partProgress.reduce((a, b) => a + b, 0);
    const percent = Math.min(100, Math.round((totalLoaded / file.size) * 100));
    onProgress(percent);
  };

  for (let i = 0; i < totalParts; i++) {
    const partNumber = i + 1;
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const blob = file.slice(start, end);

    const { url } = await videoService.getUploadPartUrl(
      key,
      uploadId,
      partNumber,
    );

    const putRes = await axios.put(url, blob, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      onUploadProgress: (e) => {
        partProgress[i] = e.loaded;
        reportProgress();
      },
    });

    const eTag =
      putRes.headers["etag"] ||
      putRes.headers["ETag"] ||
      putRes.headers["Etag"] ||
      "";

    completedParts.push({
      partNumber,
      etag: eTag.replace(/"/g, ""),
    });

    partProgress[i] = blob.size;
    reportProgress();
  }

  return videoService.completeMultipartUpload({
    key,
    uploadId,
    fileName: file.name,
    title,
    description,
    size: file.size,
    contentType: file.type || "application/octet-stream",
    parts: completedParts,
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k)),
  );
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
