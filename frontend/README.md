# Tinbet Web dApp with Next.JS

## Add environment variables

Change the values of the following environment variables to your own depending on the network you want to use and the RPC node you want to connect to.

Run the following commands in your terminal:

```bash
export NEXT_PUBLIC_PROGRAM_ID=monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih
export NEXT_PUBLIC_NODE=https://api.mainnet-beta.solana.com
```

or create a `.env.local` file with the following content:

```
NEXT_PUBLIC_PROGRAM_ID=monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih
NEXT_PUBLIC_NODE=https://api.mainnet-beta.solana.com
```

## Install dependencies

```bash
yarn
```

## Run the app locally

```bash
yarn dev
```
