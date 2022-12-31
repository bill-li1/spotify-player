import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSpotify from "../hooks/useSpotify";

const Playlist = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const router = useRouter();
  const { playlistId } = router.query;
  const [playlistData, setPlaylistData] =
    useState<SpotifyApi.SinglePlaylistResponse | null>(null);

  useEffect(() => {
    if (playlistId && spotifyApi.getAccessToken()) {
      try {
        (async () => {
          const playlist = await spotifyApi.getPlaylist(playlistId as string);
          setPlaylistData(playlist.body);
        })();
      } catch (error) {
        console.error(error);
      }
    }
  }, [playlistId, session, spotifyApi]);

  console.log(playlistData);

  // <Image
  //   src="https://i.scdn.co/image/ab67706c0000bebbb359526347e43f24770cb736"
  //   alt="My image"
  //   width={300}
  //   height={300}
  // />

  return (
    <div>
      <Image
        src={playlistData?.images?.[0]?.url || ""}
        alt="My image"
        width={300}
        height={300}
      />
      <div>Playlist</div>
      <div>{playlistId}</div>
    </div>
  );
};

export default Playlist;
