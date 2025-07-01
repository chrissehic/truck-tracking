import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import React from "react";

const buttonClass = "rounded-full cursor-pointer flex flex-col items-center justify-center p-4 shadow-md border pointer-events-auto";

function MapHeader() {
  return (
    <div className="absolute pointer-events-none top-0 right-0 h-fit bg-transparent w-full p-10 flex flex-row justify-end items-center gap-8 z-30">
      <div className="flex flex-1"></div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex pointer-events-auto relative flex-2 bg-background px-4 py-2 rounded-full border-2 shadow-md"
      >
        <input
          className="bg-transparent w-full outline-0 text-md"
          placeholder="Search"
          onClick={(e) => e.stopPropagation()}
        />
        <Search className="size-5 text-muted-foreground absolute right-4 top-0 bottom-0 m-auto" />
      </div>
      <div className="flex flex-1 justify-end items-center gap-3">
        <button className={cn(buttonClass, "bg-background text-foreground")}>
          <div className="relative">
            <div className="rounded-full h-1.5 w-1.5 absolute top-0 right-0 bg-lime-400"></div>
            <Bell className="size-4" />
          </div>
        </button>
        <button className={cn(buttonClass, "bg-background text-foreground")}>
          <div className="size-4 flex flex-col justify-center items-center font-bold">
            CS
          </div>
        </button>
      </div>
    </div>
  );
}

export default MapHeader;
