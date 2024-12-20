import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { colorToCss } from "@/lib/utils";
import { Layer, TextLayer } from "@repo/ui/lib/types/canvas.type";
import { cn } from "@repo/ui/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.4;

  // Avoid zero or negative sizes
  const fontSizeBasedOnHeight = Math.max(1, height * scaleFactor);
  const fontSizeBasedOnWidth = Math.max(1, width * scaleFactor);

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  updateLayer: (key: string, layer: Layer) => void;
}

export const Text = ({
  layer,
  onPointerDown,
  id,
  selectionColor,
  updateLayer,
}: TextProps) => {
  // const { x, y, width, height, fill, value } = layer;

  const updateValue = useCallback(
    (newValue: string) => {
      updateLayer(id, { ...layer, value: newValue });
    },
    [layer]
  );

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline:
          selectionColor && !layer.value && layer.value?.trim() === ""
            ? `1px solid ${selectionColor}`
            : "none",
      }}
    >
      <textarea
        value={layer.value || ""}
        onChange={handleContentChange}
        className={cn(
          "resize-none h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none whitespace-pre-wrap",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(layer.width, layer.height),
          color: layer.textColor
            ? typeof layer.textColor === "string"
              ? layer.textColor
              : colorToCss(layer.textColor)
            : "var(--muted-foreground)",
          overflow: "hidden",
          border: "none",
          background: "transparent",
        }}
      />
    </foreignObject>
  );
};
