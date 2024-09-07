import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

export const ProofBox = ({proof}: {proof: string}) => {
    const {toast} = useToast();
    return(
  <div className="flex items-center space-x-2 pt-4">
    <div className="grid flex-1 gap-2">
      <Label htmlFor="link" className="sr-only">
        Link
      </Label>
      <Input
        id="link"
        className="text-white"
        defaultValue={proof}
        readOnly
      />
    </div>
    <Button onClick={async () => {
        await navigator.clipboard.writeText(proof);
        toast({
            title: "Proof Copied successfully"
        })
    }} type="button" size="sm" className="px-3">
      <span className="sr-only">Copy</span>
      <CopyIcon className="h-4 w-4" />
    </Button>
  </div>
)}
