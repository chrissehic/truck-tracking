import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full bg-background">{children}</div>;
}

export default layout;
