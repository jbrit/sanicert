import {
  generateProof,
  getEddsa,
  patientSchema,
  PatientData,
} from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";

export const config = {
  api: {
    bodyParser: false,
  },
};

type RequestBody = PatientData & {
  zkey: string;
  wasm: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new multiparty.Form();
    const data = await new Promise<RequestBody>((res, rej) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return rej(err);
        }
        for (const key of Object.keys(fields)) {
          fields[key] = fields[key][0];
          if (fields[key] === "true") {
            fields[key] = true;
          }
          if (fields[key] === "false") {
            fields[key] = false;
          }
          if (key === "age") {
            fields["age"] = parseInt(fields["age"]);
          }
        }
        const parsedInfo = patientSchema.safeParse(fields);
        if (!parsedInfo.success) {
          return rej(parsedInfo.error.errors);
        }
        // validate files (wasm & zkey)
        if (!files || !files["zkey"] || !(files["zkey"].length === 1)) {
          // reject proper zkey not provided
          return rej("zkey file not provided");
        }
        if (!files || !files["wasm"] || !(files["wasm"].length === 1)) {
          // reject proper wasm not provided
          return rej("wasm file not provided");
        }
        return res({
          ...parsedInfo.data,
          zkey: files["zkey"][0]["path"],
          wasm: files["wasm"][0]["path"],
        });
      });
    });

    const eddsa = await getEddsa();
    const signMsg = (msg: Uint8Array) =>
      eddsa.signPoseidon(process.env.PRIVATE_KEY!, msg);
    try {
      
      const { proof, timestamp, packedProof, user_id } = await generateProof(data, signMsg);
      if (
        proof.publicSignals.length !== 2 ||
        proof.publicSignals[0] !== data.user_id ||
        proof.publicSignals[1] !== timestamp
      ) {
        return res.status(400).json({message: "Incompatible proof request made"});
      }
      return res.status(200).json({user_id, timestamp, proof, packedProof});
    } catch (error) {
      return res.status(400).json({message: error});
    }
  }
  return res.status(405).json({ error: { message: "Unsupported Request :(" } });
}
