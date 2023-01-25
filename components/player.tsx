import React, { useState, useEffect } from "react";
import { SongData } from "../types/spotify";
import useSpotify from "../hooks/useSpotify";

interface PlayerProps {
  currentSong: SongData;
}

const Player = ({ currentSong }: PlayerProps) => {
  const spotifyApi = useSpotify();
  const [is_paused, setPaused] = useState<boolean>(false);
  const [is_active, setActive] = useState<boolean>(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [current_track, setTrack] = useState<Spotify.Track | null>(null);
  const token = spotifyApi.getAccessToken() as string;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        try {
          if (state) {
            setPaused(state.paused);
            player.getCurrentState().then((state) => {
              console.log(state);
              if (!state) {
                setActive(false);
              } else {
                setActive(true);
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      });

      player.connect();
    };
  }, [token]);

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1 className="text-5xl font-bold pb-2 text-black">
        {currentSong?.title}
      </h1>
      <h1 className="text-3xl font-bold pb-2 pt-2 text-black">
        {currentSong?.artist.join(", ")}
      </h1>
    </div>
  );
};

export default Player;
