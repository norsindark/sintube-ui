export const apiRoutes = {
  user: {
    getProfile: "/users/profile",
  },

  auth: {
    register: "/public/register",
    identify: "/public/users/identify",
    verifyPassword: "/users/verify-password",
  },

  video: {
    getFeed: "/public/videos/feed",
    getById: (id: string) => `/public/videos/${id}`,
    getRelated: (id: string) => `/public/videos/${id}/related`,
    search: "/public/videos/search",
    myVideos: "/videos/me",
    upload: "/videos/upload",
    byUser: (userId: string) => `/public/videos/user/${userId}`,

    multipart: {
      init: "/videos/multipart/init",
      url: "/videos/multipart/url",
      complete: "/videos/multipart/complete",
      abort: "/videos/multipart/abort"
    },
  },

  
};