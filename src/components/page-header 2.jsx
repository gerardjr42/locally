import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

export function PageHeader({ onBackClick, progressValue, progressText }) {
  return (
    <>
      <Button variant="ghost" className="mb-4" onClick={onBackClick}>
        <ArrowLeft className="mr-2 h-10 w-4" />
      </Button>
      <div className="mb-6 ">
        <Progress value={progressValue} className="h-2" />
        <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
          <span>Profile Creation</span>
          <span>{progressText}</span>
        </div>
      </div>
    </>
  );
}
