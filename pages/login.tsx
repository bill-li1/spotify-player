import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import styles from "../components/button.module.css";

import type { NextPage } from "next";
import { useRouter } from "next/router";

const Login: NextPage = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { from } = router.query;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="mb-24 flex flex-col items-center justify-center">
        <h1 className="text-8xl text-center font-bold">
          The Prettiest <br />
          <span className="text-[#1DB954]">Spotify</span> Web Player
        </h1>
        <div className="mt-8">
          {Object.values(providers).map((provider) => (
            <div key={(provider as ClientSafeProvider).name}>
              <button
                type="button"
                onClick={() =>
                  signIn((provider as ClientSafeProvider).id, {
                    callbackUrl: from ? `/${from}` : "/",
                  })
                }
                className={styles.btn}
              >
                <div className={styles.btnContent}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-brand-spotify mr-2"
                    width="28"
                    height="38"
                    viewBox="0 0 24 24"
                    strokeWidth="2.4"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />{" "}
                    <circle cx="12" cy="12" r="10" />{" "}
                    <path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527" />{" "}
                    <path d="M9 15c1.5 -1 4 -1 5 .5" />{" "}
                    <path d="M7 9c2 -1 6 -2 10 .5" />{" "}
                  </svg>
                  Log In
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
