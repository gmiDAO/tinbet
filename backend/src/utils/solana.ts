import { PublicKey, Connection } from "@solana/web3.js";
import { AnchorProvider, setProvider, Program } from "@project-serum/anchor";
import { ProtocolAddresses } from "@monaco-protocol/client";

export async function getProgram(env) {
  const connection = new Connection(env.ANCHOR_PROVIDER_URL as string);
  const wallet = undefined;
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  setProvider(provider);
  const protocol = env.PROTOCOL_TYPE;

  let protocolAddress: PublicKey;
  switch (protocol) {
    case "stable":
      protocolAddress = new PublicKey(ProtocolAddresses.DEVNET_STABLE);
      break;
    case "release":
      protocolAddress = new PublicKey(ProtocolAddresses.RELEASE);
      break;
    default:
      return null;
  }

  const program = await Program.at(protocolAddress, provider);

  return program;
}
