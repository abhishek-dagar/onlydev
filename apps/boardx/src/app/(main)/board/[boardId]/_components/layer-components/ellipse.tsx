import { colorToCss } from "@/lib/utils";
import { EllipseLayer } from "@repo/ui/lib/types/canvas.type";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const Ellipse = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => {
  const { x, y, width, height, fill } = layer;
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        stroke:
          typeof layer.stroke === "string"
            ? layer.stroke
            : colorToCss(layer.stroke),
      }}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
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
