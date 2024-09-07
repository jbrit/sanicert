import Layout from "@/components/layout";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import {readFile} from "fs/promises";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {EvmChains, SignProtocolClient, SpMode} from "@ethsign/sp-sdk";
import { useWalletClient } from "wagmi";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function UserInfo({verifiers}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {data: walletClient} = useWalletClient();
    const [makeAttestation, setMakeAttestation] = useState<(schemaId: string, data: string) => Promise<any>>(null!);

    useEffect(() => {
        const client = new SignProtocolClient(SpMode.OnChain, {
            chain: EvmChains.baseSepolia,
            walletClient
        });
        const attestationFunction = async (schemaId: string, initialData: string) => {
            const data = initialData.slice(2,642);
            const dataObject = {
              user_id: BigInt(`0x${data.slice(512, 576)}`),
              timestamp: BigInt(`0x${data.slice(576, 640)}`)
            };
            await client.createAttestation({schemaId, data: dataObject, indexingValue: "user_id"}, {extraData: initialData as `0x${string}`});
        }
        
        setMakeAttestation(() => attestationFunction);
    }, [walletClient]);

    return <Layout>
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Known Verifiers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {verifiers.map((verifier, index) => (
          <Card key={index} className="bg-zinc text-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle>{verifier.name}</CardTitle>
              <CardDescription>{verifier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="outline" asChild>
                  <a
                    href={verifier.zkey}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download zkey
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={verifier.wasm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download wasm
                  </a>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Schema: {verifier.schema}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
      <h1 className="text-3xl font-bold mb-6">Make Attestation</h1>
      <form onSubmit={ (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const schemaId = formData.get('schemaId') as string;
        const data = formData.get('data') as string;
        makeAttestation(schemaId, data);
      }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schemaId">Schema ID</Label>
          <Input
            type="text"
            id="schemaId"
            name="schemaId"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Textarea
            id="data"
            name="data"
            rows={4}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Make Attestation
        </Button>
      </form>
    </main>
    </Layout>
  }
type Verifier = {
    name: string;
    description: string;
    zkey: string;
    wasm: string;
    schema: string;
};
type Info = { verifiers: Verifier[]  };
export const getServerSideProps = (async (context) => {
  return { props: {verifiers: JSON.parse(await readFile("./verifiers.json", "utf-8")) as Verifier[]} };
}) satisfies GetServerSideProps<Info>;
