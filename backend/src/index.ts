import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { Environment, MessageSendRequest } from "./types";
import { markets } from "./markets/routes";
import { getMarketCard, updateMarketsAndSendBatch } from "./markets/service";
import * as marketModel from "./markets/model";
import { OUTCOME_IMAGES } from "./constants";
const app = new Hono();
app.use("*", prettyJSON());
app.get("/", (c) => c.text("Tinbet API"));
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));
app.route("/markets", markets);

export default {
  fetch: app.fetch,
  scheduled: async (event, env: Environment, ctx: ExecutionContext) => {
    ctx.waitUntil(updateMarketsAndSendBatch(env));
  },
  async queue(batch: MessageBatch, env: Environment, ctx: ExecutionContext) {
    for (const message of batch.messages) {
      try {
        const marketAddress = JSON.parse(message.body as string);
        let marketCard = await getMarketCard(marketAddress, env);
        if (marketCard) {
          marketCard.image =
            OUTCOME_IMAGES[marketCard.data.outcome.marketOutcome] || "";
          await marketModel.updateMarketCard(env.MARKETS, marketCard);
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
};
