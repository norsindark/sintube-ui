import { useRef, useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { Upload, FileVideo, X, CheckCircle2 } from "lucide-react";
import { videoService } from "@/services/videoService";
import {
  formatBytes,
  SIMPLE_UPLOAD_THRESHOLD,
  uploadInMultipart,
} from "@/utils/upload";
import type { VideoUploadResponse } from "@/types/media/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVideoProgress } from "@/hooks/useVideoProgress";

export function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [progress, setProgress] = useState(0);
  const [uiStatus, setUiStatus] =
    useState<"idle" | "uploading" | "success" | "error">("idle");

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoUploadResponse | null>(null);

  const [mode, setMode] = useState<"simple" | "multipart" | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const { progress: wsProgress, status: wsStatus } =
    useVideoProgress(videoId ?? "");

  useEffect(() => {
    if (wsProgress !== undefined && wsProgress !== null) {
      setProgress(wsProgress);
    }

    if (wsStatus === "PROCESSING") setUiStatus("uploading");
    if (wsStatus === "DONE") setUiStatus("success");
    if (wsStatus === "FAILED") setUiStatus("error");
  }, [wsProgress, wsStatus]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setProgress(0);
    setUiStatus("idle");
    setError(null);
    setResult(null);
    setVideoId(null);

    if (selected && !title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setProgress(0);
    setUiStatus("idle");
    setError(null);
    setResult(null);
    setMode(null);
    setVideoId(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please choose a file first");
      return;
    }

    setUiStatus("uploading");
    setProgress(0);
    setError(null);
    setResult(null);

    const useMultipart = file.size > SIMPLE_UPLOAD_THRESHOLD;
    setMode(useMultipart ? "multipart" : "simple");

    try {
      const response = useMultipart
        ? await uploadInMultipart({
            file,
            title: title || undefined,
            description: description || undefined,
            onProgress: setProgress,
          })
        : await videoService.uploadVideo(
            file,
            title || undefined,
            description || undefined
          );

      setResult(response);
      setVideoId(response.videoId);
    } catch (err) {
      setUiStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const isUploading = uiStatus === "uploading";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload video</h1>
        <p className="text-muted-foreground mt-1">
          Files larger than {formatBytes(SIMPLE_UPLOAD_THRESHOLD)} are uploaded
          in chunks automatically.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-lg p-6 space-y-5"
      >
        {!file ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg py-12 px-6 flex flex-col items-center justify-center gap-3 hover:bg-accent transition-colors"
          >
            <Upload className="w-10 h-10 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">Click to choose a video file</p>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3 p-3 border border-border rounded-md bg-muted/40">
            <FileVideo className="w-8 h-8 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatBytes(file.size)}
              </p>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={resetForm}
                className="p-1 rounded hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {uiStatus === "success"
                ? "Done"
                : `Processing (${mode})`}
            </span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 bg-muted rounded">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {uiStatus === "success" && result && (
          <div className="text-sm flex gap-2 items-center">
            <CheckCircle2 className="text-green-500" />
            Video ID: {result.videoId}
          </div>
        )}

        <Button type="submit" disabled={!file || isUploading}>
          {isUploading ? "Processing..." : "Upload"}
        </Button>
      </form>
    </div>
  );
}