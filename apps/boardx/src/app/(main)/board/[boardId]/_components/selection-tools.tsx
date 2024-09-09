"use client";

// import { useMutation, useSelf } from "@/liveblocks.config";
import { memo, useCallback, useEffect, useState } from "react";
import {
  BringToFrontIcon,
  CopyIcon,
  SendToBackIcon,
  Trash2Icon,
} from "lucide-react";
import Hint from "@repo/ui/components/common/hint";
import { Button } from "@repo/ui/components/ui/button";
import {
  Camera,
  Color,
  Layer,
  LayerType,
  MyPresenceType,
} from "@repo/ui/lib/types/canvas.type";
import { useSelectionBounds } from "@/components/custom-hooks/use-selection-bounds";
import { ColorPicker } from "./color-picker";
import { RectangleSharpCornerIcon } from "@/components/icons/rectangle-sharp-corner";
import { RectangleRoundCornerIcon } from "@/components/icons/rectangle-round-corner";
import { cn } from "@repo/ui/lib/utils";

interface SelectionToolsProps {
  camera: Camera;
  myPresence: MyPresenceType;
  layerIds: string[];
  setLayerIds: (value: string[]) => void;
  layers: { [key: string]: Layer };
  updateLayers: (key: string, value: Layer) => void;
  setLastUsedValues: (value: any) => void;
  setMyPresence: (presence: MyPresenceType) => void;
  deleteLayers: () => void;
  duplicateLayer: () => void;
}

export const SelectionTools = memo(
  ({
    camera,
    myPresence,
    layerIds,
    setLayerIds,
    layers,
    setLastUsedValues,
    updateLayers,
    deleteLayers,
    duplicateLayer,
  }: SelectionToolsProps) => {
    const selection = myPresence.selectedLayers;
    const [isRound, setIsRound] = useState(false);

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

    const setStokeWidth = useCallback(
      (strokeWidth: number) => {
        const liveLayers = layers;
        setLastUsedValues((prev: any) => ({
          ...prev,
          strokeWidth,
        }));
        selection.forEach((layerId) => {
          if (
            liveLayers[layerId].type !== LayerType.Text &&
            liveLayers[layerId].type !== LayerType.Note
          )
            updateLayers(layerId, {
              ...liveLayers[layerId],
              strokeWidth,
            });
        });
      },
      [selection, layers, setLastUsedValues]
    );
    const setStokeColor = useCallback(
      (strokeColor: Color | string) => {
        const liveLayers = layers;
        setLastUsedValues((prev: any) => ({
          ...prev,
          strokeColor: strokeColor,
        }));
        selection.forEach((layerId) => {
          if (
            liveLayers[layerId].type !== LayerType.Text &&
            liveLayers[layerId].type !== LayerType.Note
          )
            updateLayers(layerId, {
              ...liveLayers[layerId],
              stroke: strokeColor,
            });
        });
      },
      [selection, layers, setLastUsedValues]
    );
    const setFill = useCallback(
      (fill: Color | string) => {
        const liveLayers = layers;
        setLastUsedValues((prev: any) => ({ ...prev, fillColor: fill }) as any);
        selection.forEach((layerId) => {
          updateLayers(layerId, { ...liveLayers[layerId], fill });
        });
      },
      [selection, layers, setLastUsedValues]
    );
    const setEdgeRadius = useCallback(
      (isRound: boolean) => {
        setIsRound(isRound);
        setLastUsedValues((prev: any) => ({ ...prev, rx: isRound ? 5 : 0 }));
        const liveLayers = layers;
        selection.forEach((layerId) => {
          updateLayers(layerId, {
            ...liveLayers[layerId],
            rx: isRound ? 5 : 0,
          });
        });
      },
      [selection, layers, setLastUsedValues]
    );

    const selectionBounds = useSelectionBounds({
      layers,
      selectedLayers: selection,
    });

    useEffect(() => {
      if (
        myPresence.selectedLayers.length === 1 &&
        layers[myPresence.selectedLayers[0]].type === LayerType.Rectangle
      ) {
        setIsRound(layers[myPresence.selectedLayers[0]].rx !== 0);
      }
    }, [myPresence, myPresence.selectedLayers]);
    if (!selectionBounds) return null;

    // const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    // const y = selectionBounds.y + camera.y;
    return (
      <div
        className="absolute p-3 rounded-xl bg-muted h-[75%] shadow-sm border flex flex-col gap-4 select-none top-[50%] -translate-y-[50%] left-2"
        // style={{
        //   transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
        // }}
      >
        <Wrapper title="Background">
          <ColorPicker onChange={setFill} />
        </Wrapper>
        <Wrapper title="stroke">
          <ColorPicker onChange={setStokeColor} />
        </Wrapper>
        {myPresence.selectedLayers.filter(
          (layerId) =>
            layers[layerId].type !== LayerType.Ellipse &&
            layers[layerId].type !== LayerType.Rectangle
        ).length === 0 && (
          <Wrapper title="stroke width">
            <div className="flex gap-2">
              <ActionButton tooltip="1" onClick={() => setStokeWidth(1)}>
                1
              </ActionButton>
              <ActionButton tooltip="5" onClick={() => setStokeWidth(5)}>
                5
              </ActionButton>
              <ActionButton tooltip="10" onClick={() => setStokeWidth(10)}>
                10
              </ActionButton>
            </div>
          </Wrapper>
        )}

        {myPresence.selectedLayers.length === 1 &&
          layers[myPresence.selectedLayers[0]].type === LayerType.Rectangle && (
            <Wrapper title="Edges">
              <div className="flex items-center gap-2">
                <ActionButton
                  tooltip="Round"
                  onClick={() => setEdgeRadius(true)}
                  isActive={isRound}
                >
                  <RectangleRoundCornerIcon size={14} />
                </ActionButton>
                <ActionButton
                  tooltip="sharp"
                  onClick={() => setEdgeRadius(false)}
                  isActive={!isRound}
                >
                  <RectangleSharpCornerIcon size={14} />
                </ActionButton>
              </div>
            </Wrapper>
          )}
        <Wrapper title="Layer">
          <div className="flex gap-2">
            <ActionButton tooltip="Bring to front" onClick={moveToFront}>
              <BringToFrontIcon size={14} />
            </ActionButton>
            <ActionButton tooltip="Send to back" onClick={moveToBack}>
              <SendToBackIcon size={14} />
            </ActionButton>
          </div>
        </Wrapper>
        <Wrapper title="action">
          <div className="flex items-center gap-2">
            <ActionButton tooltip="Duplicate" onClick={duplicateLayer}>
              <CopyIcon size={14} />
            </ActionButton>
            <ActionButton tooltip="Delete" onClick={deleteLayers}>
              <Trash2Icon size={14} />
            </ActionButton>
          </div>
        </Wrapper>
      </div>
    );
  }
);

const Wrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-sm text-muted-foreground capitalize">{title}</p>
      {children}
    </div>
  );
};

const ActionButton = ({
  tooltip,
  onClick,
  children,
  isActive,
}: {
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
}) => {
  return (
    <Hint label={tooltip} side="bottom" align="start">
      <Button
        variant={"board"}
        size={"icon"}
        onClick={onClick}
        className={cn(
          "bg-muted-foreground/50 h-7 w-7 text-foreground hover:text-foreground",
          {
            "bg-primary/50": isActive,
          }
        )}
      >
        {children}
      </Button>
    </Hint>
  );
};

SelectionTools.displayName = "SelectionTools";
