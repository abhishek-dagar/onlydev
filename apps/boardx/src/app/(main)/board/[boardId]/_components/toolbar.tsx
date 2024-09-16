import React, { useEffect } from "react";
import {
  CircleIcon,
  HandIcon,
  MousePointer2Icon,
  PencilIcon,
  Redo2Icon,
  SquareIcon,
  StickyNoteIcon,
  TypeIcon,
  Undo2Icon,
} from "lucide-react";
import {
  CanvasMode,
  CanvasState,
  LayerType,
} from "@repo/ui/lib/types/canvas.type";
import { ToolButton } from "./tool-button";
import useKeyPress from "@repo/ui/hooks/use-key-pressed/index";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  const {keysPressed, setKeys} = useKeyPress();

  useEffect(() => {
    const isNumber = (str: string): boolean =>
      !isNaN(parseFloat(str)) && isFinite(Number(str));
    const keyArray = keysPressed as string[];
    if (!isNumber(keyArray[0])) return;
    switch (parseInt(keyArray[0])) {
      case 0:
        setCanvasState({ mode: CanvasMode.Grabbing });
        break;
      case 1:
        setCanvasState({ mode: CanvasMode.None });
        break;
      case 2:
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Text,
        });
        break;
      case 3:
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Note,
        });
        break;
      case 4:
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Rectangle,
        });
        break;
      case 5:
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Ellipse,
        });
        break;
      case 6:
        setCanvasState({
          mode: CanvasMode.Pencil,
        });
        break;
      default:
        setCanvasState({ mode: CanvasMode.None });
        break;
    }
    setKeys(new Set());
  }, [keysPressed]);

  return (
    <div className="absolute left-[50%] -translate-x-[50%] bottom-16 md:bottom-2 flex gap-x-4 z-10">
      <div className="bg-muted rounded-md p-1.5 flex gap-x-4 items-center shadow-md">
        <ToolButton
          label="select"
          icon={HandIcon}
          onClick={() => setCanvasState({ mode: CanvasMode.Grabbing })}
          count={0}
          isActive={canvasState.mode === CanvasMode.Grabbing}
        />
        <ToolButton
          label="select"
          icon={MousePointer2Icon}
          count={1}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label="Text"
          icon={TypeIcon}
          count={2}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        />
        <ToolButton
          label="Sticky note"
          icon={StickyNoteIcon}
          count={3}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Note
          }
        />
        <ToolButton
          label="Rectangle"
          icon={SquareIcon}
          count={4}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />
        <ToolButton
          label="Ellipse"
          icon={CircleIcon}
          count={5}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            })
          }
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          label="Pen"
          icon={PencilIcon}
          count={6}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Pencil,
            })
          }
          isActive={canvasState.mode === CanvasMode.Pencil}
        />
      </div>
      <div className="bg-muted rounded-md p-1.5 flex items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2Icon}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2Icon}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div className="absolute left-[50%] -translate-x-[50%] bottom-2 flex flex-col gap-y-4 bg-muted rounded-md shadow-md h-[52px] w-[360px]" />
  );
};
