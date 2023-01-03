import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
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

  return (
    <>
      {loading ? (
        <div className="flex min-h-screen flex-col items-center justify-center pb-2 text-white text-xl">
          Loading...
        </div>
      ) : (
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar />
          <div className="flex flex-grow flex-col justify-center items-center">
            <div className="h-80 w-80 box-content relative">
              <Image
                src={playlistData?.images?.[0]?.url || ""}
                alt="Playlist Cover"
                sizes="100%"
                fill={true}
                priority={true}
                style={{ objectFit: "cover" }}
                onLoadingComplete={() => {
                  console.log("Image loaded");
                  setLoading(false);
                }}
              />
            </div>
            <div className="text-2xl text-white mt-4">{playlistData?.name}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Playlist;
