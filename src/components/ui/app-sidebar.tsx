"use client"
import { cn } from "@/lib/utils"
import { Atom, LineChartIcon as ChartLine, History, Navigation, PanelsLeftBottom, UserCog, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ThemeModeToggle from "../ThemeModeToggle"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: PanelsLeftBottom,
  },
  {
    title: "Navigation",
    url: "/",
    icon: Navigation,
  },
  {
    title: "History",
    url: "/",
    icon: History,
  },
  {
    title: "Growth",
    url: "/",
    icon: ChartLine,
  },
  {
    title: "Power",
    url: "/",
    icon: Zap,
  },
]
const extras = [
    {
    title: "User Settings",
    icon: UserCog,
  },
]

export function AppSidebar() {
  const [active, setActive] = useState("Navigation")

  return (
    <nav className="bg-background shadow-lg sticky h-full w-fit z-30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12 h-full">
        <div className="flex flex-col h-full items-center justify-between">
          <div className="flex flex-col justify-center items-center gap-10">
            <div className="flex-shrink-0">
              <Atom className="size-12 text-secondary-foreground/40" />
            </div>
            <div className="hidden md:flex flex-col justify-center items-center space-x-4 gap-5">
              {items.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={() => setActive("Navigation")}
                  className={cn(
                    "px-3 py-3 m-0 flex flex-row justify-center items-center rounded-md text-sm font-medium",
                    active === item.title
                      ? "text-primary bg-secondary"
                      : "text-primary/40 hover:text-primary/70 hover:bg-accent",
                  )}
                >
                  <item.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex flex-col space-x-4">
            <div className="flex flex-col justify-center items-center space-x-2 gap-3">

                {extras.map((item) => (
                <button
                  key={item.title}
                  onClick={() => setActive("Navigation")}
                  className={cn(
                    "cursor-pointer px-3 py-3 m-0 flex flex-row justify-center items-center rounded-md text-sm font-medium",
                    active === item.title
                      ? "text-primary bg-secondary"
                      : "text-primary/40 hover:text-primary/70 hover:bg-accent",
                  )}
                >
                  <item.icon className="size-5" />
                </button>
              ))}
              <ThemeModeToggle/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
