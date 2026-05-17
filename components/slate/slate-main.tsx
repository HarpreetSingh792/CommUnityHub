"use client";
import { useTheme } from "next-themes";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useMemo } from "react";

const Canvas = ({ canAudit }: { canAudit: boolean }) => {
  const { theme } = useTheme();
  const currentTheme: "dark" | "light" = theme === "dark" ? "dark" : "light";

  const initialData = useMemo(
    () => ({
      elements: [],
      appState: {
        theme: currentTheme,
        viewBackgroundColor: currentTheme === "dark" ? "#111827" : "#ffffff",
      },
    }),
    [currentTheme]
  );

  return (
    <div className="w-full h-full">
      <Excalidraw
        initialData={initialData}
        viewModeEnabled={!canAudit}
        theme={theme === "dark" ? "dark" : "light"}
        UIOptions={{
          canvasActions: {
            loadScene: true,
            saveToActiveFile: false,
            saveAsImage: true,
            export: false,
            changeViewBackgroundColor: true,
            clearCanvas: true,
            toggleTheme: true,
          },
          tools: {
            image: true,
          },
        }}
      />
    </div>
  );
};
export default Canvas;
