import { Kalam } from "next/font/google";
import { ContentEditableEvent } from "react-contenteditable";

import { colorToCss, getContrastingTextColor } from "@/lib/utils";
import { Layer, NoteLayer } from "@repo/ui/lib/types/canvas.type";
import { cn } from "@repo/ui/lib/utils";
import { useCallback } from "react";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  updateLayer: (key: string, layer: Layer) => void;
}

export const Note = ({
  layer,
  onPointerDown,
  id,
  selectionColor,
  updateLayer,
}: NoteProps) => {
  // const { x, y, width, height, fill, value } = layer.;

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
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: layer.fill
          ? typeof layer.fill === "string"
            ? layer.fill
            : colorToCss(layer.fill)
          : "#000",
      }}
      className="shadow-md drop-shadow-xl"
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
              : getContrastingTextColor(layer.textColor)
            : "#000",
          overflow: "hidden",
          border: "none",
          background: "transparent",
        }}
      />
    </foreignObject>
  );
};
