import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL;

type UploadProcess = "CREATED" | "PROCESSING" | "DONE" | "FAILED";

export function useVideoProgress(videoId: string) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadProcess>("CREATED");

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
    });

    client.onConnect = () => {
      console.log("WS CONNECTED");
      
      client.subscribe(`/topic/video-progress/${videoId}`, (msg) => {
        const data = JSON.parse(msg.body);

        setProgress(data.percent);
        setStatus(data.status);
      });
    };

    client.onWebSocketError = (e) => {
      console.error("WS ERROR:", e);
    };

    client.onStompError = (frame) => {
      console.error("STOMP ERROR:", frame);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [videoId]);

  return { progress, status };
}