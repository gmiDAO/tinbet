import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButtonDynamic } from "contexts/SolanaWalletProvider";
import Link from "next/link";

export const Header = () => {
  const wallet = useWallet();
  return (
    <div className="navbar flex justify-evenly">
      <Link href="/">
        <a className="btn btn-ghost normal-case text-xl">🔥 Tinbet</a>
      </Link>
      
      <Link href="/about">
        <a className="btn btn-ghost normal-case text-xl"> About </a>
      </Link>

      {wallet.connected ? (
        <div className="flex-none">
          <Link href="/profile">
            <a className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
            </a>
          </Link>
        </div>
      ) : (
        <WalletMultiButtonDynamic />
      )}
    </div>
  );
};
