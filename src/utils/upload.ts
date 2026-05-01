import { videoService } from "@/services/videoService";
import type { AbortUploadVideoRequest, VideoUploadResponse } from "@/types/media/upload";
import axios, { AxiosError } from "axios";

export const SIMPLE_UPLOAD_THRESHOLD = 10 * 1024 * 1024;
export const MULTIPART_CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_PARALLEL = 4;
const MAX_RETRY = 3;

export interface MultipartUploadOptions {
  file: File;
  title?: string;
  description?: string;
  chunkSize?: number;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;

  onInit?: (key: string, uploadId: string) => void;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function uploadInMultipart({
  file,
  title,
  description,
  chunkSize = MULTIPART_CHUNK_SIZE,
  onProgress,
  signal,
  onInit,
}: MultipartUploadOptions): Promise<VideoUploadResponse> {
  const totalParts = Math.ceil(file.size / chunkSize);

  const { key, uploadId } = await videoService.initMultipartUpload(
    file.name,
    file.type || "application/octet-stream"
  );

  onInit?.(key, uploadId);

  const completedParts: { partNumber: number; etag: string }[] = [];
  const partProgress = new Array<number>(totalParts).fill(0);

  const reportProgress = () => {
    if (!onProgress) return;
    const totalLoaded = partProgress.reduce((a, b) => a + b, 0);
    const percent = Math.min(100, Math.round((totalLoaded / file.size) * 100));
    onProgress(percent);
  };

  let aborted = false;

  const uploadPart = async (index: number) => {
    const partNumber = index + 1;
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const blob = file.slice(start, end);

    const { url } = await videoService.getUploadPartUrl(
      key,
      uploadId,
      partNumber
    );

    let attempt = 0;

    while (attempt < MAX_RETRY) {
      try {
        const res = await axios.put(url, blob, {
          signal,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          onUploadProgress: (e) => {
            partProgress[index] = e.loaded;
            reportProgress();
          },
        });

        const eTag =
          res.headers["etag"] ||
          res.headers["ETag"] ||
          res.headers["Etag"] ||
          "";

        completedParts.push({
          partNumber,
          etag: eTag.replace(/"/g, ""),
        });

        partProgress[index] = blob.size;
        reportProgress();
        return;
      } catch (err) {
        if (signal?.aborted) {
          aborted = true;
          throw err;
        }

        attempt++;
        if (attempt >= MAX_RETRY) throw err;

        await sleep(500 * attempt);
      }
    }
  };

  try {
    const queue = [...Array(totalParts).keys()];
    const workers: Promise<void>[] = [];

    for (let i = 0; i < MAX_PARALLEL; i++) {
      workers.push(
        (async () => {
          while (queue.length && !aborted) {
            const index = queue.shift();
            if (index === undefined) return;
            await uploadPart(index);
          }
        })()
      );
    }

    await Promise.all(workers);

    return await videoService.completeMultipartUpload({
      key,
      uploadId,
      fileName: file.name,
      title,
      description,
      size: file.size,
      contentType: file.type || "application/octet-stream",
      parts: completedParts.sort((a, b) => a.partNumber - b.partNumber),
    });
  } catch (err) {
    try {

      const request: AbortUploadVideoRequest = {
        key,
        uploadId,
      };
    
      await videoService.abortMultipartUpload(request);
    } catch { }

    if (signal?.aborted) {
      throw new Error("Upload cancelled");
    }

    if (err instanceof AxiosError) {
      throw new Error(err.message);
    }

    throw err;
  }
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