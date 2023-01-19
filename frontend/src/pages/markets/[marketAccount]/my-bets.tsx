import { Orders, OrderAccounts } from "@monaco-protocol/client";

import { BN } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProgram } from "../../../contexts/ProgramProvider";

const MyBets = () => {
  const { publicKey } = useWallet();
  const { query } = useRouter();
  const program = useProgram();
  const [myBets, setMyBets] = useState<OrderAccounts["orderAccounts"]>();

  const getMyBets = async () => {
    if (!publicKey) {
      return;
    }
    const betOrdersResponse = await new Orders(program)
      .filterByMarket(new PublicKey(query.marketAccount as string))
      .fetch();
    console.log(betOrdersResponse);
    setMyBets(betOrdersResponse.data.orderAccounts);
  };

  useEffect(() => {
    getMyBets();
  }, []);

  const parseProtocolNumber = (protocolNumber: BN) =>
    new BN(protocolNumber).toNumber() / 10 ** 6;

  return (
    <div>
      {myBets !== undefined ? (
        <div>
          <h1>Bets</h1>
          <table>
            <thead>
              <tr className="bg-base-300" key="header">
                <th>Price</th>
                <th>Outcome</th>
                <th>Stake</th>
                <th>Unmatched</th>
                <th>Payout</th>
                <th>Purchaser</th>
              </tr>
            </thead>
            <tbody>
              {myBets.map((bet) => (
                <tr
                  className={
                    bet.account.forOutcome ? "bg-green-300" : "bg-red-300"
                  }
                  key={new BN(bet.account.creationTimestamp).toNumber()}
                >
                  <td>{bet.account.expectedPrice}</td>
                  <td>{bet.account.forOutcome ? "FOR" : "AGAINST"}</td>
                  <td>{parseProtocolNumber(bet.account.stake)}</td>
                  <td>{parseProtocolNumber(bet.account.stakeUnmatched)}</td>
                  <td>{parseProtocolNumber(bet.account.payout)}</td>
                  <td
                    className={
                      publicKey && bet.account.purchaser.equals(publicKey)
                        ? "bg-blue-500"
                        : ""
                    }
                  >
                    {bet.account.purchaser.toBase58()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default MyBets;
