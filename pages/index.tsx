import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { GetServerSideProps } from "next";
import Link from "next/link";
import type { NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";

const Home: NextPage = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      (async () => {
        const data = await spotifyApi.getUserPlaylists();
        setPlaylists(data.body.items);
        setLoading(false);
      })();
    }
  }, [session, spotifyApi]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pb-2 text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pb-2">
      <title>Spotify Player</title>
      {/* <link rel="icon" href="/favicon.ico" /> */}
      <div className="flex flex-1 items-center flex-col justify-center">
        <main className="max-w-6xl px-24 text-center">
          <h1 className="text-6xl font-bold pb-2 text-black">
            Welcome to Spotify
          </h1>
          <p className="mt-3 text-2xl ">
            {playlists.map((playlist) => (
              <Link href={`/${playlist.id}`} key={playlist.id}>
                <button
                  type="button"
                  className="font-bold m-[6px] inline-block px-6 py-2.5 bg-blue-600 text-white text-lg leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  {playlist.name}
                </button>
              </Link>
            ))}
          </p>
        </main>
      </div>
      <button
        // style the button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => signOut()}
      >
        log out
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const session = await getSession(context);
  return {
    props: { session },
  };
};

export default Home;
