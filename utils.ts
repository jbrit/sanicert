import { z } from "zod";
import { faker } from "@faker-js/faker";
import { groth16 } from "snarkjs";
import { buildEddsa, buildPoseidon, Eddsa, Signature } from "circomlibjs";

export const patientSchema = z.object({
  user_id: z.string().length(32),
  username: z.string(),
  password: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  gender: z.string(),
  age: z.number(),
  has_tb_vaccine: z.boolean(),
  has_yellow_fever_vaccine: z.boolean(),
});

export type PatientData = z.infer<typeof patientSchema>;

export const getOrFakePatientData = (username: string): PatientData => {
  try {
    return patientSchema.parse(JSON.parse(localStorage.getItem(username)!));
  } catch (error) {}
  // @dev: changes username and password on create account
  return {
    user_id: faker.string.numeric({length: 32}),
    username: faker.internet.displayName(),
    password: faker.internet.password(),
    fullName: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    gender: faker.person.gender(),
    age: faker.number.int({ min: 14, max: 21 }),
    has_tb_vaccine: faker.datatype.boolean(),
    has_yellow_fever_vaccine: faker.datatype.boolean(),
  };
};

const wasmFile = "./circuit/medic.wasm"; // uploaded
const zkeyFile = "./circuit/medic.zkey"; // uploaded

export const generateProof = async (
  { user_id, age, has_tb_vaccine, has_yellow_fever_vaccine, wasm, zkey }: PatientData & {
    zkey: string;
    wasm: string;
  },
  signer: (msg: Uint8Array) => Signature
) => {
  const poseidon = await buildPoseidon();
  const timestamp = Date.now();
  const M = poseidon([
    timestamp,
    user_id,
    age,
    +has_tb_vaccine,
    +has_yellow_fever_vaccine,
  ]);
  const signature = signer(M);

  return {
    timestamp: timestamp.toString(),
    proof: await groth16.fullProve(
      {
        timestamp,
        user_id,
        age,
        has_tb_vaccine: +has_tb_vaccine,
        has_yellow_fever_vaccine: +has_yellow_fever_vaccine,
        S: signature.S,
        R8x: poseidon.F.toObject(signature.R8[0]),
        R8y: poseidon.F.toObject(signature.R8[1]),
      },
      wasm,
      zkey
    ),
  };
};

let singletonEddsa: Eddsa | null = null;
export const getEddsa = async () => {
  if (!singletonEddsa) singletonEddsa = await buildEddsa();
  return singletonEddsa;
};
