import { animated, to, useSprings } from "react-spring";
import { useEffect, useState } from "react";

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
  const [gone] = useState(() => new Set());
  const [animationFinished, setAnimationFinished] = useState<number[]>([]);
  const [canStartPlaying, setCanStartPlaying] = useState(false);
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
    if (animationFinished.length >= playlistData.length - 6) {
      setCanStartPlaying(true);
    }
  }, [animationFinished]);

  useEffect(() => {
    if (canStartPlaying) {
      spotifyApi.play({
        uris: [currentSong.uri],
      });
    }
  }, [currentSong, canStartPlaying]);

  if (!spotifyApi) {
    return (
      <div
        role="status"
        className="flex min-h-screen flex-col items-center justify-center"
      >
        <svg
          aria-hidden="true"
          className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-[#1DB954]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
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
