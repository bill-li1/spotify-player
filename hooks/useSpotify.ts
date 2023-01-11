import { signIn, useSession } from "next-auth/react";

import SpotifyWebApi from "spotify-web-api-node";
import { useEffect } from "react";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSpotify() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  useEffect(() => {
    if (session && session.user && status === "authenticated") {
      spotifyApi.setAccessToken(session.user.accessToken as string);
    }
  }, [session]);
  return spotifyApi;
}

export default useSpotify;
