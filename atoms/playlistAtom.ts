import { atom } from "recoil";
import { parseCookies } from "nookies";

const cookies = parseCookies();

export const playlistIdAtom = atom({
  key: "playlistIdAtom",
  default: cookies.playlistId || "4oaz6BBLrb3zqK7H8zF9t2",
});
