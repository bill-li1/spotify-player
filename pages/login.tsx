import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import type { NextPage } from "next";
import { useRouter } from "next/router";

const Login: NextPage = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { from } = router.query;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {Object.values(providers).map((provider) => (
        <div key={(provider as ClientSafeProvider).name}>
          <button
            type="button"
            onClick={() =>
              signIn((provider as ClientSafeProvider).id, {
                callbackUrl: from ? `/${from}` : "/",
              })
            }
            className="text-white bg-[#1DB954] hover:bg-[#1BA84C]/90 focus:ring-4 focus:outline-none focus:ring-[#189544]/50 font-medium rounded-lg text-xl px-4 py-2 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-brand-spotify mr-1"
              width="28"
              height="38"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />{" "}
              <circle cx="12" cy="12" r="9" />{" "}
              <path d="M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527" />{" "}
              <path d="M9 15c1.5 -1 4 -1 5 .5" />{" "}
              <path d="M7 9c2 -1 6 -2 10 .5" />{" "}
            </svg>
            {(provider as ClientSafeProvider).name}
          </button>
        </div>
      ))}
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
