import { useEffect, useState } from "react";

import Player from "../components/player";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "../components/loading";
import useSpotify from "../hooks/useSpotify";

const Playlist = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const router = useRouter();
  const { playlistId } = router.query;
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] =
    useState<SpotifyApi.SinglePlaylistResponse | null>(null);

  useEffect(() => {
    if (playlistId && spotifyApi.getAccessToken()) {
      try {
        (async () => {
          const playlist = await spotifyApi.getPlaylist(playlistId as string);
          setPlaylist(playlist.body);
          setLoading(false);
        })();
      } catch (error) {
        console.error(error);
      }
    }
  }, [playlistId, session, spotifyApi]);

  const playlistData =
    playlist?.tracks.items
      .filter((track) => track?.track?.album?.images?.[0]?.url)
      .map((track) => ({
        id: track?.track?.id || "",
        uri: track?.track?.uri || "",
        title: track?.track?.name || "",
        artist: track?.track?.artists.map((artist) => artist.name) || [],
        album: track?.track?.album.name || "",
        image: track?.track?.album.images?.[0]?.url || "",
      })) || [];

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col h-screen overflow-hidden">
          <Player playlistData={playlistData} />
        </div>
      )}
    </>
  );
};

export default Playlist;
