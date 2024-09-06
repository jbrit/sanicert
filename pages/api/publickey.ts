import { getEddsa } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const eddsa = await getEddsa();
  const pubkey = eddsa.prv2pub(process.env.PRIVATE_KEY)
  res.status(200).json({ Ax: ""+eddsa.F.toObject(pubkey[0]), Ay: ""+eddsa.F.toObject(pubkey[1])});
}
