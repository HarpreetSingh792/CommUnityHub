"use client";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";

import { useSyncDemo } from "@tldraw/sync";
import { DefaultColorThemePalette, Tldraw, getSnapshot, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect } from "react";

const Canvas = ({ canAudit }: { canAudit: boolean }) => {
  const { theme } = useTheme();
  const params = useParams();
  const store = useSyncDemo({ roomId: params?.channelId as string });


  return (
    <div
      className={`w-full h-full ${
        theme === "dark" ? "tldraw-dark" : "tldraw-light"
      }`}
    >
      <Tldraw
        store={store}
        onMount={(editor) => {
          editor.updateInstanceState({ isReadonly: !canAudit });
          const { document, session } = getSnapshot(editor.store)
          console.log(document)
          console.log(session)
        }}

    
        inferDarkMode
        
      />
    </div>
  );
};
export default Canvas;
