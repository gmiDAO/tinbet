import Head from "next/head";

export default function AboutPage() {

  return (
    <>
      <Head>
        <title>Tinbet | About</title>
      </Head>

      <div className="w-screen min-h-full py-12 bg-white">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-fit max-w-screen lg:text-center">
            <p className="w-fit mt-2 text-blue-800 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              <a href="https://tinbet-gonnamakeit.vercel.app/"> TinBET </a>
              aims to have more fans having fun aping on Props and BetDEX!
            </p>
            <div>
              <br></br>
              <h2 className="text-base text-red-500 font-semibold"> 
              Made with love by the
              <a href="https://gonnamakeit.io/"> Gonna Make It Team </a>
              for the Sandstorm Hackaton
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
