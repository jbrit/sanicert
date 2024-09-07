import Layout from "@/components/layout";
import { getOrFakePatientData, PatientData } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ProofBox } from "@/components/proofbox";

type ReturnType = {
  user_id: string;
  timestamp: string;
  proof: string;
  packedProof: string;
}

export default function UserInfo({
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      axios.create().post<ReturnType>("/api/prove", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  });
  const toast = useToast();
  const router = useRouter();
  const [packedProof, setPackedProof] = useState('');
  const wasmRef = useRef<HTMLInputElement>(null!);
  const zkeyRef = useRef<HTMLInputElement>(null!);
  const resetForm = () => {
    wasmRef.current.value = "";
    zkeyRef.current.value = "";
    setPackedProof('');
  };
  const patientData = getOrFakePatientData(username);
  useEffect(() => {
    if (patientData.username !== username) {
      toast.toast({
        title: `Patient with username ${username} not found.`,
        variant: "destructive",
      });
      router.replace("/");
    }
  }, [patientData.username, router, toast, username]);
  return (
    <Layout>
      <main>
        <div className="space-y-4 mb-6">
          <h1 className="text-2xl font-bold">Patient Information</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold">UID:</p>
              <p>{patientData.user_id}</p>
            </div>
            <div>
              <p className="font-semibold">Username:</p>
              <p>{patientData.username}</p>
            </div>
            <div>
              <p className="font-semibold">Full Name:</p>
              <p>{patientData.fullName}</p>
            </div>
            <div>
              <p className="font-semibold">Phone Number:</p>
              <p>{patientData.phoneNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Gender:</p>
              <p>{patientData.gender}</p>
            </div>
            <div>
              <p className="font-semibold">Age:</p>
              <p>{patientData.age}</p>
            </div>
            <div>
              <p className="font-semibold">TB Vaccine:</p>
              <p>{patientData.has_tb_vaccine ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="font-semibold">Yellow Fever Vaccine:</p>
              <p>{patientData.has_yellow_fever_vaccine ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
        <Card className="bg-zinc">
          <CardHeader>
            <CardTitle className="text-white">Proof Generator</CardTitle>
            <CardDescription>
              Generate your proof by uploading the zkey and wasm files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                for (const key of Object.keys(
                  patientData
                ) as (keyof PatientData)[])
                  formData.set(key, "" + patientData[key]);
                const zkey = formData.get("zkey");
                const wasm = formData.get("wasm");
                if (!zkey || !(zkey as File).name) {
                  toast.toast({
                    title: "Error",
                    description: "Please upload a zkey file.",
                    variant: "destructive",
                  });
                  return;
                }
                if (!wasm || !(wasm as File).name) {
                  toast.toast({
                    title: "Error",
                    description: "Please upload a wasm file.",
                    variant: "destructive",
                  });
                  return;
                }
                try {
                  const mut = await mutation.mutateAsync(formData);
                  resetForm();
                  setPackedProof(mut.data.packedProof);
                } catch (error) {
                  toast.toast({
                    title: "Could not generate proof",
                    variant: "destructive"
                  })
                  console.error(error);
                }
              }}
              className="text-white"
            >
              <div className="grid gap-2 grid-cols-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="zkey">Zkey</Label>
                  <Input ref={zkeyRef} id="zkey" type="file" name="zkey" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="wasm">Wasm</Label>
                  <Input ref={wasmRef} id="wasm" type="file" name="wasm" />
                </div>
              </div>
              <div className="pt-6">
                <Button
                  className="mr-4"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  Generate
                </Button>
                <Button
                  type="reset"
                  onClick={resetForm}
                  variant="destructive"
                  disabled={mutation.isPending}
                >
                  Clear Files
                </Button>
              </div>
            </form>
            {packedProof && <ProofBox proof={packedProof} />}
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
}

type Info = { username: string };

export const getServerSideProps = (async (context) => {
  return { props: { username: context.params!.username as string } };
}) satisfies GetServerSideProps<Info>;
