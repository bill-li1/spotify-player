import { animated, to, useSprings } from "react-spring";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Navbar from "./navbar";
import styles from "./cards.module.css";
import { useDrag } from "react-use-gesture";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";

const after = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 30,
  delay: i * 100,
});

const before = () => ({
  x: 0,
  rot: 0,
  scale: 1.5,
  y: -1000,
});

const trans = (r: number, s: number) =>
  `perspective(1500px)
  rotateX(30deg)
  rotateY(${r / 10}deg)
  rotateZ(${r}deg) scale(${s})`;

interface SongData {
  id: string;
  uri: string;
  title: string;
  artist: string[];
  album: string;
  image: string;
}

interface CardProps {
  playlistData: SongData[];
}

const Player = ({ playlistData }: CardProps) => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [gone] = useState(() => new Set());
  const [animationFinished, setAnimationFinished] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(
    playlistData[playlistData.length - 1],
  );
  const [cards, set] = useSprings(playlistData.length, (i) => ({
    ...after(i),
    from: before(),
    onStart: () => {
      setAnimationFinished((prev) => [...prev, i]);
    },
  }));

  const [is_paused, setPaused] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  let player = useRef(null);

  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;
      if (!down && trigger) {
        gone.add(index);
        setCurrentSong(playlistData[index - 1]);
      }
      set((i) => {
        if (index !== i) return;
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
        const rot = mx / 100 + (!isGone ? dir * 10 * velocity : 0);
        const scale = down ? 1.1 : 1;
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: {
            friction: 50,
            tension: down ? 800 : isGone ? 200 : 500,
          },
        };
      });
      if (!down && gone.size === playlistData.length) {
        setTimeout(() => set((i) => after(i)), 600);
        setCurrentSong(playlistData[playlistData.length - 1]);
        gone.clear();
      }
    },
  );

  useEffect(() => {
    if (isPlaying && isActive) {
      spotifyApi.play({
        uris: [currentSong.uri],
      });
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (animationFinished.length >= playlistData.length - 6) {
      setIsPlaying(true);
    }
  }, [animationFinished]);

  useEffect(() => {
    (async () => {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = async () => {
        const player = new window.Spotify.Player({
          name: "GOAT",
          getOAuthToken: (cb) => {
            cb(session?.user?.accessToken as string);
          },
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", async (state) => {
          if (!state || !player) {
            console.log("no state");
            return;
          }

          setPaused(state.paused);
          console.log("state", state);

          console.log("player", player);
          const newState = await player.getCurrentState();
          console.log("newState", newState);
        });

        player.connect();
      };
    })();
  }, [session?.user?.accessToken]);

  if (!player) {
    return <div>Loading...</div>;
  }

  if (!isActive) {
    return <div>Not Active</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={styles.container}>
        {cards.map(({ x, y, rot, scale }, i: number) => {
          return (
            <animated.div
              key={i}
              className={styles.background}
              style={{
                transform: to(
                  [x, y],
                  (x: number, y: number) => `translate3d(${x}px,${y}px,0)`,
                ),
              }}
            >
              <animated.div
                className={styles.card}
                style={{
                  padding: "16px",
                  transform: to([rot, scale], trans),
                  boxShadow:
                    animationFinished.includes(i) && i < 25
                      ? "0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)"
                      : "none",
                }}
              >
                <div {...bind(i)} className="h-full box-content relative">
                  <Image
                    src={playlistData[i].image}
                    alt="Song Playlist Cover"
                    unselectable="on"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    fill
                    style={{ objectFit: "cover", borderRadius: "12px" }}
                  />
                </div>
              </animated.div>
            </animated.div>
          );
        })}
      </div>
      <div className="flex flex-1 flex-col justify-center items-center">
        <h1 className="text-5xl font-bold pb-2 text-black">
          {currentSong.title}
        </h1>
        <h1 className="text-3xl font-bold pb-2 pt-2 text-black">
          {currentSong.artist.join(", ")}
        </h1>
      </div>
    </div>
  );
};

export default Player;
