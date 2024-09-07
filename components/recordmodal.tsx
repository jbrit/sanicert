import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { getOrFakePatientData } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";


export function DialogCloseButton() {
  const { toast } = useToast()
  const [username, setUsername] = useState("");
  const patientData = getOrFakePatientData(username);
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Get Started</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950">
        <DialogHeader>
          <DialogTitle>Load Medical Records</DialogTitle>
          <DialogDescription>
            Load or generate already stored medical records for the username.
            [DEV NOTE]: This is currently in beta and stored in localstorage.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="username" className="sr-only">
              Username
            </Label>
            <Input value={username} onChange={(e) => {setUsername(e.target.value.trim())}} type="text" id="username" placeholder="Username" />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button onClick={() => {
            if (username === "") {
                return toast({
                    title: "Empty Username Provided",
                    variant: "destructive"
                });
            } else if (patientData.username === username){
                // redirect correctly
                router.push(`/patient/${username}`);
            } else {
                return toast({
                    title: "Username Not Found",
                    variant: "destructive"
                });
            }
          }} type="button" variant="default">
            Load Record
          </Button>
          <Button onClick={() => {
            if (username === "") {
                return toast({
                    title: "Empty Username Provided",
                    variant: "destructive"
                });
            } else if (patientData.username !== username){
                // create & redirect correctly
                patientData.username = username;
                localStorage.setItem(username, JSON.stringify(patientData));
                router.push(`/patient/${username}`);
            } else {
                return toast({
                    title: "Username Already Exists",
                    variant: "destructive"
                });
            }
          }} className="mb-2 sm:mb-0" type="button" variant="secondary">
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
