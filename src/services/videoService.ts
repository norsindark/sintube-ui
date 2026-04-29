import { apiClient, delay } from "./api/apiClient";
import { videos as mockVideos } from "./mockData";
import { apiRoutes } from "./api/apiRoute";
import type { PageResponse } from "@/types/api/pageResponse";
import type { Video } from "@/types/media/video";
import type {
  MultipartInitResponse,
  MultipartUploadUrlResponse,
  CompleteMultipartRequest,
  VideoUploadResponse
} from "@/types/media/upload";
import { mapVideo } from "@/types/media/video";

// =========================
// TYPES UPLOAD (FRONTEND)
// =========================


export const videoService = {
  // =========================
  // LIST VIDEOS (REAL + fallback)
  // =========================
  async getVideos(category?: string): Promise<Video[]> {
    if (!category || category === "All") return mockVideos as any;
    return mockVideos.filter((v) => v.category === category) as any;

    try {
      const res = await apiClient.get(apiRoutes.video.getVideos, {
        params: { category },
      });

      return (res.data ?? []).map(mapVideo);
    } catch (e) {
      await delay(100);
      if (!category || category === "All") return mockVideos as any;
      return mockVideos.filter((v) => v.category === category) as any;
    }
  },

  // =========================
  // VIDEO DETAIL
  // =========================
  async getVideoById(id: string): Promise<Video> {
    try {
      const res = await apiClient.get(apiRoutes.video.getById(id));
      return mapVideo(res.data);
    } catch (e) {
      await delay(100);
      const mock = mockVideos.find((v) => v.id === id);
      return mock as any;
    }
  },

  // =========================
  // RELATED
  // =========================
  async getRelated(id: string): Promise<Video[]> {
    return mockVideos.slice(0, 6) as any;

    try {
      const res = await apiClient.get(apiRoutes.video.getRelated(id));
      return (res.data ?? []).map(mapVideo);
    } catch (e) {
      await delay(100);
      return mockVideos.slice(0, 6) as any;
    }
  },

  // =========================
  // SEARCH
  // =========================
  async search(query: string): Promise<Video[]> {
    try {
      const res = await apiClient.get(apiRoutes.video.search, {
        params: { q: query },
      });

      return (res.data ?? []).map(mapVideo);
    } catch (e) {
      await delay(100);
      return mockVideos.filter((v) =>
        v.title.toLowerCase().includes(query.toLowerCase())
      ) as any;
    }
  },

  // =========================
  // MY VIDEOS
  // =========================
  async getMyVideos(page = 0, size = 10): Promise<PageResponse<Video>> {
    try {
      const res = await apiClient.get(apiRoutes.video.myVideos, {
        params: { page, size },
      });

      return {
        ...res.data,
        content: (res.data.content ?? []).map(mapVideo),
      };
    } catch (e) {
      await delay(100);
      return {
        totalElements: 0,
        totalPages: 0,
        page,
        size,
        content: [],
      };
    }
  },

  // =========================
  // BY USER
  // =========================
  async getVideosByUser(userId: string, page = 0, size = 10): Promise<Video[]> {
    try {
      const res = await apiClient.get(apiRoutes.video.byUser(userId), {
        params: { page, size },
      });

      return (res.data.content ?? []).map(mapVideo);
    } catch (e) {
      await delay(100);
      return mockVideos as any;
    }
  },

  // =========================
  // UPLOAD SINGLE FILE (simple upload)
  // =========================
  async uploadVideo(file: File, title?: string, description?: string): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    if (title) formData.append("title", title);
    if (description) formData.append("description", description);

    const res = await apiClient.post(apiRoutes.video.upload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  // =========================
  // INIT MULTIPART UPLOAD
  // =========================
  async initMultipartUpload(fileName: string, contentType: string): Promise<MultipartInitResponse> {
    const res = await apiClient.post(apiRoutes.video.multipart.init, null, {
      params: { fileName, contentType },
    });

    return res.data;
  },

  // =========================
  // GET PRESIGNED URL FOR PART
  // =========================
  async getUploadPartUrl(
    key: string,
    uploadId: string,
    partNumber: number
  ): Promise<MultipartUploadUrlResponse> {
    const res = await apiClient.get(apiRoutes.video.multipart.url, {
      params: { key, uploadId, partNumber },
    });

    return res.data;
  },

  // =========================
  // COMPLETE MULTIPART UPLOAD
  // =========================
  async completeMultipartUpload(payload: CompleteMultipartRequest): Promise<VideoUploadResponse> {
    const res = await apiClient.post(
      apiRoutes.video.multipart.complete,
      payload
    );

    return res.data;
  },

  // =========================
  // ABORT MULTIPART UPLOAD
  // =========================
  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    await apiClient.delete(apiRoutes.video.multipart.abort, {
      params: { key, uploadId },
    });
  },
};