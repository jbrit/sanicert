import Layout from "@/components/layout";
import { getOrFakePatientData } from "@/utils";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

export default function UserInfo({
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const toast = useToast();
  const router = useRouter();

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
        <div className="space-y-4">
          <h1 className="text-2xl font-bold mb-6">Patient Information</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </main>
    </Layout>
  );
}

type Info = { username: string };

export const getServerSideProps = (async (context) => {
  return { props: { username: context.params!.username as string } };
}) satisfies GetServerSideProps<Info>;
