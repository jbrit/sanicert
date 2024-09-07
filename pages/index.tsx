import { DialogCloseButton } from "@/components/recordmodal";
import Layout from "@/components/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Layout>
      <main className="font-[family-name:var(--font-geist-sans)] text-lg">
        <p className="mb-2">
          This is a private, permissionless medical data attestation protocol.
          <br />
          Uses{" "}
          <a
            className="underline underline-offset-4 decoration-zinc-600 hover:font-semibold hover:decoration-white"
            href="https://sign.global"
            target="_blank"
            rel="noopener noreferrer"
          >
            sign protocol
          </a>{" "}
          to generate attestations based of private medical data.
          <br />
          Intriguing Right :{")"}.<br />
        </p>
        <div className="flex space-x-4">

        <DialogCloseButton />
        <Link href="/verifier"><Button variant="outline">Make Attestation</Button></Link>
        </div>
      </main>
    </Layout>
  );
}
