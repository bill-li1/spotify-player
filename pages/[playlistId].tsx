import { useEffect, useState } from "react";

import Cards from "../components/cards";
import { SongData } from "../types/spotify";
import Player from "../components/player";
import Navbar from "../components/navbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";

const Playlist = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const router = useRouter();
  const { playlistId } = router.query;
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState<SongData[]>([]);
  const [currentSong, setCurrentSong] = useState<SongData>({} as SongData);

  useEffect(() => {
    if (playlistId && spotifyApi.getAccessToken()) {
      try {
        (async () => {
          const data = await spotifyApi.getPlaylist(playlistId as string);
          const playlist = data.body?.tracks?.items
            ?.filter((track) => track?.track?.album?.images?.[0]?.url)
            .map((track) => ({
              id: track?.track?.id || "",
              uri: track?.track?.uri || "",
              title: track?.track?.name || "",
              artist: track?.track?.artists.map((artist) => artist.name) || [],
              album: track?.track?.album.name || "",
              image: track?.track?.album.images?.[0]?.url || "",
            }));
          setPlaylist(playlist || []);
          setCurrentSong(playlist[playlist.length - 1]);
          setLoading(false);
        })();
      } catch (error) {
        console.error(error);
      }
    }
  }, [playlistId, session, spotifyApi]);

  return (
    <>
      {loading ? (
        <div className="flex min-h-screen flex-col items-center justify-center pb-2 text-white text-xl">
          Loading...
        </div>
      ) : (
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar />
          <Cards
            playlistData={playlist}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
          />
          <Player currentSong={currentSong} />
        </div>
      )}
    </>
  );
};

export default Playlist;
