import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Tinbet | About</title>
      </Head>
      <div className="flex flex-col items-center justify-center text-center m-4 mb-20">
        <h1 className="m-2 text-4xl font-bold ">
          Betting has never been so fun!
        </h1>
        <p className="m-3 text-2xl">
          Tinbet is a tinder-like decentralized betting platform built on
          Solana.
        </p>
        <p className="m-3 text-xl">
          It is not meant to be used for professional or high stakes betting,
          but rather for having fun and learning about Decentralized Sports
          Betting.
        </p>
        <p className="m-4 text-xl">
          This is a project by &nbsp;
          <a href="gonnamakeit.io" className="underline">
            Gonna Make It
          </a>
          &nbsp; for the Sandstorm Hackathon 2023.
        </p>
      </div>
    </>
  );
}
