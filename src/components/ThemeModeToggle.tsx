"use client";

import { Switch } from "@headlessui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

function ThemeModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before rendering (avoids SSR mismatch)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Switch
      checked={resolvedTheme === "dark"}
      onChange={(checked) => setTheme(checked ? "dark" : "light")}
      className="group cursor-pointer inline-flex h-16 w-8 flex-col items-center rounded-full bg-accent transition-all duration-200"
    >
      <span className="size-8 rounded-full shadow-lg border border-border bg-background transition-all duration-200 group-data-[checked]:translate-y-8 flex items-center justify-center">
        {resolvedTheme === "dark" ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )}
      </span>
    </Switch>
  );
}

export default ThemeModeToggle;
