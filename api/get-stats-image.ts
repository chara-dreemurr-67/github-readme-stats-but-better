import type { VercelRequest, VercelResponse } from "@vercel/node";
import GetImg from "../GetImg.js";
import Stats from "../Stats.js";

const Handler = async (_Req: VercelRequest, Res: VercelResponse): Promise<void> => {
    const Buffer: Buffer = await GetImg(0, 0, 24, (await Stats()).ToString("L"));
    Res.setHeader("Content-Type", "image/png")
        .setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=86400")
        .status(200)
        .send(Buffer)
    ;
};

export default Handler;