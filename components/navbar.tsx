import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="relative w-full flex flex-wrap items-center justify-between text-white">
      <Link href="/">
        <button
          type="button"
          className="font-bold m-[6px] inline-block px-6 py-2.5 bg-blue-600 text-white text-lg leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Home
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
