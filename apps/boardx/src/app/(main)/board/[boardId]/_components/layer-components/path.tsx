import { getSvgPathFromStroke } from "@/lib/utils";
import getStroke from "perfect-freehand";

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
}

export const Path = (props: PathProps) => {
  const { x, y, points, fill, onPointerDown, stroke } = props;

  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      fill={fill}
      strokeWidth={1}
      // stroke={stroke}
    />
  );
};
