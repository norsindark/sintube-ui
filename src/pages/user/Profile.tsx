import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileHeader from "@/features/user/ProfileHeader";
import VideoGrid from "@/features/video/VideoGrid";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import type { Video } from "@/types/media/video";
import { UploadPage } from "@/pages/video/UploadPage";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const [videos, setVideos] = useState<Video[]>([]);
  const [openUpload, setOpenUpload] = useState(false);

  useEffect(() => {
    if (!user) return;

    userService.getMyVideos().then((data) => {
      setVideos(data);
    });
  }, [user]);

  if (!user) return null;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      <ProfileHeader user={user} onUploadClick={() => setOpenUpload(true)} />
      <UploadPage open={openUpload} onOpenChange={setOpenUpload} />
      <div className="mt-8">
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="rounded-md">
            <TabsTrigger value="home" className="rounded-md">Home</TabsTrigger>
            <TabsTrigger value="videos" className="rounded-md">Videos</TabsTrigger>
            <TabsTrigger value="playlists" className="rounded-md">Playlists</TabsTrigger>
            <TabsTrigger value="about" className="rounded-md">About</TabsTrigger>
          </TabsList>
          <TabsContent value="home" className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Featured</h2>
            <VideoGrid videos={videos.slice(0, 4)} />
          </TabsContent>
          <TabsContent value="videos" className="mt-6">
            <VideoGrid videos={videos} />
          </TabsContent>
          <TabsContent value="playlists" className="mt-6">
            <p className="text-muted-foreground">No playlists yet.</p>
          </TabsContent>
          <TabsContent value="about" className="mt-6 max-w-2xl">
            <p className="text-sm leading-relaxed">
              {user.displayName} ({user.handle}) joined YouTube Mini on{" "}
              {new Date(user.joinedAt).toLocaleDateString()}. This is a UI-only demo profile.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Subscribers</div>
                <div className="font-medium">{user.subscribers.toLocaleString()}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
