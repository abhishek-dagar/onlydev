import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@repo/ui/lib/types/canvas.type";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;
  return (
    <rect
      className={cn("drop-shadow-md stroke-slate-50")}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        stroke:
          typeof layer.stroke === "string"
            ? layer.stroke
            : colorToCss(layer.stroke),
      }}
      x={0}
      y={0}
      rx={layer.rx || 0}
      width={width}
      height={height}
      strokeWidth={layer.strokeWidth || 1}
      strokeDasharray={
        layer.strokeStyle === "solid"
          ? undefined
          : `${layer.strokeStyle === "dashed" ? "7" : "2"} ${layer.strokeWidth === 3 ? "10" : layer.strokeWidth === 5 ? "15" : "20"}`
      }
      strokeLinecap="round"
      fill={
        fill ? (typeof fill === "string" ? fill : colorToCss(fill)) : "#000"
      }
      stroke={selectionColor || "transparent"}
    />
  );
};
