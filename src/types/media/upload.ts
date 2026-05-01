export type UploadProcess = "CREATED" | "PROCESSING" | "DONE" | "FAILED";

export interface MultipartInitResponse {
  key: string;
  uploadId: string;
}

export interface MultipartUploadUrlResponse {
  url: string;
}

export interface CompleteMultipartRequest {
  key: string;
  uploadId: string;
  fileName: string;
  title?: string;
  description?: string;
  size: number;
  contentType: string;
  parts: {
    partNumber: number;
    etag: string;
  }[];
}

export interface VideoUploadResponse {
  videoId: string;
  status: UploadProcess;
}

export interface AbortUploadVideoRequest {
  key: string;
  uploadId: string;
}
