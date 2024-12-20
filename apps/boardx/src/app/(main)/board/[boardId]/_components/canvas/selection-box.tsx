"use client";

import { boundingBox } from "@/components/custom-hooks/use-selection-bounds";
// import { useSelectionBounds } from "@/hooks/use-selection-bounds";
// import { useSelf, useStorage } from "@/liveblocks.config";
import { Layer, LayerType, Side, XYWH } from "@repo/ui/lib/types/canvas.type";
import { memo } from "react";

interface SelectionBoxProps {
  selectedLayers: string[];
  layers: { [key: string]: Layer };
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(
  ({
    selectedLayers,
    layers,
    onResizeHandlePointerDown,
  }: SelectionBoxProps) => {
    const soleLayerId = selectedLayers.length === 1 ? selectedLayers[0] : null;
    const isShowingHandles =
      soleLayerId && layers[soleLayerId]?.type !== LayerType.Path;

    const bounds = boundingBox(selectedLayers.map((id) => layers[id]));

    if (!bounds) return null;

    return (
      <>
        <rect
          className="fill-transparent stroke-primary stroke-[1px] pointer-events-none"
          style={{
            transform: `translate(${bounds.x - 5}px, ${bounds.y - 5}px)`,
          }}
          x={0}
          y={0}
          width={bounds.width + 10}
          height={bounds.height + 10}
        />
        {isShowingHandles && (
          <>
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${bounds.x - 5 - HANDLE_WIDTH / 2}px, ${
                  bounds.y - 5 - HANDLE_WIDTH / 2
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
                }px, ${bounds.y - 5 - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top, bounds);
              }}
            />
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + 5 - HANDLE_WIDTH / 2 + bounds.width
                }px, ${bounds.y - 5 - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + 5 - HANDLE_WIDTH / 2 + bounds.width
                }px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Right, bounds);
              }}
            />
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + 5 - HANDLE_WIDTH / 2 + bounds.width
                }px, ${bounds.y + 5 - HANDLE_WIDTH / 2 + bounds.height}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
                }px, ${bounds.y + 5 - HANDLE_WIDTH / 2 + bounds.height}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom, bounds);
              }}
            />
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${bounds.x - 5 - HANDLE_WIDTH / 2}px, ${
                  bounds.y + 5 - HANDLE_WIDTH / 2 + bounds.height
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-background stroke-[1px] stroke-primary"
              x={0}
              y={0}
              rx={2}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${bounds.x - 5 - HANDLE_WIDTH / 2}px, ${
                  bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Left, bounds);
              }}
            />
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
