"use client";

// import { useMutation, useSelf } from "@/liveblocks.config";
import { memo, useCallback } from "react";
import { BringToFrontIcon, SendToBackIcon, Trash2Icon } from "lucide-react";
import Hint from "@repo/ui/components/common/hint";
import { Button } from "@repo/ui/components/ui/button";
import {
  Camera,
  Color,
  Layer,
  MyPresenceType,
} from "@repo/ui/lib/types/canvas.type";
import { useSelectionBounds } from "@/components/custom-hooks/use-selection-bounds";
import { ColorPicker } from "./color-picker";

interface SelectionToolsProps {
  camera: Camera;
  myPresence: MyPresenceType;
  layerIds: string[];
  setLayerIds: (value: string[]) => void;
  layers: { [key: string]: Layer };
  updateLayers: (key: string, value: Layer) => void;
  setLastUsedColor: (color: Color) => void;
  setMyPresence: (presence: MyPresenceType) => void;
  deleteLayers: () => void;
}

export const SelectionTools = memo(
  ({
    camera,
    myPresence,
    layerIds,
    setLayerIds,
    layers,
    setLastUsedColor,
    updateLayers,
    deleteLayers,
  }: SelectionToolsProps) => {
    const selection = myPresence.selectedLayers;

    const moveToBack = useCallback(() => {
      const indices = [];
      const arr = layerIds;
      for (let i = 0; i < arr.length; i++) {
        if (selection.includes(arr[i])) {
          indices.push(i);
        }
      }
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];

        const copy: string[] = [...layerIds];
        copy.splice(index, 1);
        copy.splice(index - 1, 0, arr[index]);
        setLayerIds(copy);
        // liveLayersIds.move(index, i);
      }
    }, [selection, layerIds]);
    const moveToFront = useCallback(() => {
      const indices = [];
      const arr = layerIds;
      for (let i = 0; i < arr.length; i++) {
        if (selection.includes(arr[i])) {
          indices.push(i);
        }
      }
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];

        const copy: string[] = [...layerIds];
        copy.splice(index, 1);
        copy.splice(index + 1, 0, arr[index]);
        setLayerIds(copy);
        // liveLayersIds.move(index, i);
      }
    }, [selection, layerIds]);

    // const deleteLayers = useDeleteLayers();

    const setFill = useCallback(
      (fill: Color) => {
        const liveLayers = layers;
        setLastUsedColor(fill);
        selection.forEach((layerId) => {
          updateLayers(layerId, { ...liveLayers[layerId], fill });
          // liveLayers.get(layerId)?.set("fill", fill);
        });
      },
      [selection, layers, setLastUsedColor]
    );

    const selectionBounds = useSelectionBounds({
      layers,
      selectedLayers: selection,
    });

    if (!selectionBounds) return null;

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;
    return (
      <div
        className="absolute p-3 rounded-xl bg-muted shadow-sm border flex select-none"
        style={{
          transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <div className="flex flex-col gap-y-0.5">
          <Hint label="Bring to front">
            <Button variant={"board"} size={"icon"} onClick={moveToFront}>
              <BringToFrontIcon />
            </Button>
          </Hint>
          <Hint label="Send to back" side="bottom">
            <Button variant={"board"} size={"icon"} onClick={moveToBack}>
              <SendToBackIcon />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center ml-2 pl-2 border-l \ border-neutral-200">
          <Hint label="Delete">
            <Button variant={"board"} size={"icon"} onClick={deleteLayers}>
              <Trash2Icon />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
