import { signIn, useSession } from "next-auth/react";

import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useState } from "react";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSpotify() {
  const [webPlayer, setWebPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  useEffect(() => {
    if (!(session && session.user && status === "authenticated")) return;
    spotifyApi.setAccessToken(session.user.accessToken as string);
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Best Spotify Player",
        getOAuthToken: (cb) => {
          cb(session.user.accessToken);
        },
        volume: 0.5,
      });

      setWebPlayer(player);

      player.addListener("ready", async ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        await spotifyApi.transferMyPlayback([device_id]);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };

    return () => {
      script.remove();
    };
  }, [session]);

  return { spotifyApi, deviceId };
}

export default useSpotify;
