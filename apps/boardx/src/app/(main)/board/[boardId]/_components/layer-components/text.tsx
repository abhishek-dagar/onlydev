import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { colorToCss } from "@/lib/utils";
import { Layer, TextLayer } from "@repo/ui/lib/types/canvas.type";
import { cn } from "@repo/ui/lib/utils";
import { useCallback, useEffect, useState } from "react";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;

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

  const [fontSize, setFontSize] = useState<number>();

  const updateValue = useCallback(
    (newValue: string) => {
      updateLayer(id, { ...layer, value: newValue });
    },
    [layer]
  );

  useEffect(() => {
    setFontSize(calculateFontSize(layer.width, layer.height));
  }, [layer.width, layer.height, layer.value]);

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
      <ContentEditable
        html={layer.value || ""}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          fontSize: fontSize,
          color: layer.fill ? (typeof layer.fill === "string" ? layer.fill : colorToCss(layer.fill)) : "var(--muted-foreground)",
        }}
      />
    </foreignObject>
  );
};
