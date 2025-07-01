import { cn } from "@/lib/utils";
import { Locate, Minus, Plus } from "lucide-react";
import React from "react";

const buttonClass =
  "rounded-full cursor-pointer flex flex-col items-center justify-center p-4 shadow-md border pointer-events-auto";

function PositionControls({
  mapRef,
}: {
  mapRef: React.RefObject<L.Map | null>;
}) {
  return (
    <div className="absolute top-0 pointer-events-none right-0 h-full bg-transparent w-fit p-14 flex flex-col justify-end items-center gap-8 z-30">
      <div>
        <button
          className={cn(buttonClass, "bg-foreground text-background")}
          onClick={() => {}}
          type="button"
        >
          <Locate className="size-5" />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <button
          className={cn(buttonClass, "bg-background text-foreground")}
          onClick={() => {
            mapRef?.current?.zoomIn();
            console.log("clicked");
          }}
          type="button"
        >
          <Plus className="size-5" />
        </button>
        <button
          className={cn(buttonClass, "bg-background text-foreground")}
          onClick={() => mapRef?.current?.zoomOut()}
          type="button"
        >
          <Minus className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default PositionControls;
