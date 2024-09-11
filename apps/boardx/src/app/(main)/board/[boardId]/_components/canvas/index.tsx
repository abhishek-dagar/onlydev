"use client";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  MyPresenceType,
  Point,
  Side,
  XYWH,
} from "@repo/ui/lib/types/canvas.type";
import React, { useCallback, useState } from "react";
import { Toolbar } from "../toolbar";
import { Info } from "../info";
import {
  colorToCss,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import { LayerPreview } from "../layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "../selection-tools";
import { useSocket } from "@/context/SocketProvider";
import { UserType } from "@repo/ui/lib/types/user.types";
import { CursorsPresence } from "../cursor-presence";
import { Participants } from "../participants";
import { updateBoard } from "@/lib/actions/board.action";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import { Path } from "../layer-components/path";
import { useTheme } from "next-themes";
import { boundingBox } from "@/components/custom-hooks/use-selection-bounds";
import { cn } from "@repo/ui/lib/utils";

const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
  user: UserType;
  board: BoardType;
}

const Canvas = ({ boardId, board, user }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const { theme } = useTheme();

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [myPresence, setMyPresence] = useState<MyPresenceType>({
    selectedLayers: [],
  });
  const [layerIds, setLayerIds] = useState<string[]>([]);
  const [layers, setLayers] = useState<{ [key: string]: Layer }>({});
  const [lastUsedValues, setLastUsedValues] = useState<{
    fillColor: Color | string;
    strokeColor: Color | string;
    strokeWidth: number;
    textColor: Color | string;
    rx: number;
  }>({
    fillColor: "#ffffff",
    strokeColor: "#ffffff",
    strokeWidth: 1,
    rx: 5,
    textColor: theme?.includes("dark") ? "#ffffff" : "#000",
  });

  const [tempLayer, setTempLayer] = useState<Layer | null>(null);

  const [cursors, setCursors] = useState<Record<string, Point>>({});
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [pencilDraft, setPencilDraft] = useState<number[][] | null>(null);
  const [history, setHistory] = useState<{ [key: string]: Layer }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const { socket } = useSocket();

  const trackHistory = (previousLayer: { [key: string]: Layer }) => {
    setHistory((prev) => {
      // Check if last history is the same as the current layers state
      if (
        JSON.stringify(prev[historyIndex]) === JSON.stringify(previousLayer)
      ) {
        return prev; // No need to update if nothing has changed
      }

      // Remove all entries after the current index to ensure proper redo functionality
      const newHistory = prev;
      if (
        historyIndex > -1 &&
        historyIndex + 1 < newHistory.length - 1 &&
        JSON.stringify(prev[historyIndex + 1]) !== JSON.stringify(previousLayer)
      ) {
        newHistory.splice(historyIndex + 1);
      }

      // Add the current state of layers to the history
      const updatedHistory = [
        ...newHistory,
        JSON.parse(JSON.stringify(previousLayer)),
      ];

      // Keep only the last 10 entries
      if (updatedHistory.length > 10) {
        updatedHistory.shift(); // Remove the oldest entry
      }

      setHistoryIndex(updatedHistory.length - 1); // Set the history index to the end
      return updatedHistory;
    });
  };

  // Undo and redo boundary checks
  const canUndo = () => historyIndex >= 0;
  const canRedo = () => historyIndex < history.length - 1;
  // Handle undo operation
  const handleUndo = useCallback(() => {
    console.log(historyIndex);

    if (canUndo()) {
      setLayers(history[historyIndex]); // Set the layers to the previous state
      updateDBboardLayers(history[historyIndex], false);
      setLayerIds(
        Object.keys(history[historyIndex]).map((key) => key.toString())
      );
      setHistoryIndex((prev) => prev - 1); // Move the history index back
    }
  }, [history, historyIndex]);

  // Handle redo operation
  const handleRedo = useCallback(() => {
    console.log(historyIndex);

    if (canRedo()) {
      let updatedIndex = historyIndex + 1;
      if (updatedIndex === 0 && history.length > 1) {
        updatedIndex++;
      }
      setLayers(history[updatedIndex]); // Set the layers to the next state
      updateDBboardLayers(history[updatedIndex], false);
      setLayerIds(
        Object.keys(history[updatedIndex]).map((key) => key.toString())
      );
      setHistoryIndex(updatedIndex); // Move the history index forward
    }
  }, [history, historyIndex]);

  // React.useEffect(() => {
  //   console.log(history, historyIndex);
  // }, [history, historyIndex]);
  const updateBoardData = async (data: any) => {
    if (data.userId === user.id) return;
    setLayerIds(data.layerIds);
    setLayers(data.layers);
    setCamera(data.camera);
    setCursors(data.cursors);
    setConnectedUsers(data.connectedUsers);
    setPencilDraft(data.pencilDraft);
    setTempLayer(data.tempLayer);
  };

  const updateLiveBoardData = useCallback(
    async (data: any) => {
      const liveBoardData = {
        layerIds,
        layers,
        myPresence,
        camera,
        cursors,
        pencilDraft,
        tempLayer,
        roomId: boardId,
        userId: user.id,
        ...data,
      };
      socket?.emit("update-board", liveBoardData);
    },
    [layerIds, layers, myPresence, camera, cursors, boardId, user.id, socket]
  );

  React.useEffect(() => {
    if (!board || !board.layers) return;
    const updatedLayers: any = board.layers.reduce(
      (acc: any, layer: any, index: number) => {
        acc[(index + 1).toString()] = layer;
        return acc;
      },
      {}
    );
    setLayers(updatedLayers);
    setLayerIds(
      Array.from({ length: board.layers.length }, (_, i) => (i + 1).toString())
    );
  }, []);

  const updateDBboardLayers = async (
    updatedLayers: {
      [key: string]: Layer;
    },
    isTrackHistory: boolean = true
  ) => {
    const res = await updateBoard({
      id: boardId,
      layers: Object.values(updatedLayers),
    });
    if (res.previousBoard && isTrackHistory) {
      const previousLayers: any = res.previousBoard.layers.reduce(
        (acc: any, layer: any, index: number) => {
          acc[(index + 1).toString()] = layer;
          return acc;
        },
        {}
      );
      trackHistory(previousLayers);
    }
  };

  // React.useEffect(() => {
  //   // console.log(layers);
  //   updateDBboardLayers();
  // }, [layers]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("connect-to-board-room", {
        roomId: boardId,
        userId: user.id,
      });
      socket.on("update-board", updateBoardData);
      socket.on("new-user-connected", (data) => {
        setConnectedUsers(data);
      });
      return () => {
        socket.off("update-board", updateBoardData);
        socket.off("new-user-connected", (data) => {
          setConnectedUsers((prev) => [...prev, data.userId]);
        });
        socket.emit("leave-board-room", { roomId: boardId, userId: user.id });
      };
    }
  }, [socket]);

  const duplicateLayer = useCallback(() => {
    let count: number = layerIds.length;
    const newLayerIds: string[] = [];
    const newLayers: { [key: string]: Layer } = {};
    for (const layerId of myPresence.selectedLayers) {
      count++;
      const layer = layers[layerId];
      newLayers[count.toString()] = {
        ...layer,
        x: layer.x + 10,
        y: layer.y + 10,
      };
      newLayerIds.push(count.toString());
      updateLiveBoardData({
        layers: {
          ...layers,
          [layerId]: layer,
        },
      });
    }

    setLayerIds((prev) => [...prev, ...newLayerIds]);
    setLayers((prev) => ({
      ...prev,
      ...newLayers,
    }));
    updateDBboardLayers({
      ...layers,
      ...newLayers,
    });
    setMyPresence({ selectedLayers: newLayerIds });
  }, [myPresence.selectedLayers, layers, layerIds]);

  const updateLayers = useCallback(
    (key: string, layer: Layer) => {
      updateLiveBoardData({
        layers: { ...layers, [key]: layer },
      });
      setLayers((prev) => ({ ...prev, [key]: layer }));
      updateDBboardLayers({ ...layers, [key]: layer });
    },
    [layers]
  );

  const updateSelectionNet = useCallback(
    (current: Point, origin: Point) => {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers as any,
        origin,
        current
      );

      setMyPresence({ ...myPresence, selectedLayers: ids });
    },
    [layerIds]
  );

  const handleUpdateLayerIds = useCallback(
    (value: string[]) => {
      updateLiveBoardData({ layerIds: value });
      setLayerIds(value);
    },
    [layerIds]
  );

  const translateSelectedLayer = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };
      //   const liveLayer = storage.get("layers");
      for (const id of myPresence.selectedLayers) {
        let layer = layers[id];
        if (layer) {
          layer = {
            ...layer,
            x: layer.x + offset.x,
            y: layer.y + offset.y,
          };
          setLayers((prev) => ({ ...prev, [id]: layer }));
          updateLiveBoardData({ layerIds, layers: { ...layers, [id]: layer } });
        }
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState, layers, myPresence]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const unSelectLayers = useCallback(() => {
    if (myPresence.selectedLayers.length > 0) {
      setMyPresence({ ...myPresence, selectedLayers: [] });
    }
  }, [myPresence.selectedLayers]);

  const onLayerPointerDown = useCallback(
    (e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      )
        return;
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!myPresence.selectedLayers.includes(layerId)) {
        setMyPresence({ ...myPresence, selectedLayers: [layerId] });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, canvasState.mode]
  );

  const insertLayer = useCallback(
    (
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      if (layerIds.length >= MAX_LAYERS) {
        return;
      }
      const layerId = (layerIds.length + 1).toString();
      let layer = {
        type: layerType,
        x: position.x,
        y: position.y,
        rx: lastUsedValues.rx,
        stroke: lastUsedValues.strokeColor,
        strokeWidth: lastUsedValues.strokeWidth,
        height: 100,
        width: 100,
        fill: lastUsedValues.fillColor,
        textColor:
          layerType === LayerType.Note
            ? lastUsedValues.fillColor === "#ffffff"
              ? "#000000"
              : "#ffffff"
            : lastUsedValues.textColor,
      };

      if (tempLayer) {
        layer = tempLayer as any;
      }

      setLayerIds((prev) => [...prev, layerId]);
      // trackHistory();
      setLayers((prev) => ({
        ...prev,
        [layerId]: layer,
      }));

      updateLiveBoardData({
        layerIds: [...layerIds, layerId],
        layers: { ...layers, [layerId]: layer },
      });

      setMyPresence({ ...myPresence, selectedLayers: [layerId] });
      setCanvasState({ mode: CanvasMode.None });
      setTempLayer(null);
      updateDBboardLayers({ ...layers, [layerId]: layer });
    },
    [layerIds, lastUsedValues, layers, myPresence, tempLayer]
  );

  const deleteLayer = useCallback(() => {
    const liveLayers = JSON.parse(JSON.stringify(layers));
    const liveLayerIds = JSON.parse(JSON.stringify(layerIds));
    for (const layerId of myPresence.selectedLayers) {
      delete liveLayers[layerId];
      const index = liveLayerIds.indexOf(layerId);
      if (index !== -1) {
        liveLayerIds.splice(index, 1);
      }
    }
    setLayerIds(liveLayerIds);
    // trackHistory();
    setLayers(liveLayers);
    updateLiveBoardData({ layerIds: liveLayerIds, layers: liveLayers });
    setMyPresence({ ...myPresence, selectedLayers: [] });
    updateDBboardLayers(liveLayers);
  }, [myPresence.selectedLayers, layers, layerIds]);

  const resizeSelectedLayer = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }
      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayer = layers;
      const layer = liveLayer[myPresence.selectedLayers[0]];
      if (layer) {
        setLayers({
          ...layers,
          [myPresence.selectedLayers[0]]: {
            ...layer,
            ...bounds,
          },
        });
        updateLiveBoardData({
          layerIds,
          layers: {
            ...layers,
            [myPresence.selectedLayers[0]]: {
              ...layer,
              ...bounds,
            },
          },
        });
      }
    },
    [canvasState]
  );

  const startDrawing = useCallback(
    (point: Point, pressure: number) => {
      setPencilDraft([[point.x, point.y, pressure]]);
      updateLiveBoardData({
        pencilDraft: [[point.x, point.y, pressure]],
      });
    },
    [pencilDraft]
  );

  const continueDrawing = useCallback(
    (point: Point, e: React.PointerEvent) => {
      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }
      const newPoints =
        pencilDraft.length === 1 &&
        pencilDraft[0][0] === point.x &&
        pencilDraft[0][1] === point.y
          ? pencilDraft
          : [...pencilDraft, [point.x, point.y, e.pressure]];

      setPencilDraft(newPoints);
      updateLiveBoardData({
        pencilDraft: newPoints,
      });
    },
    [canvasState, pencilDraft]
  );

  const startDrawingShape = useCallback(
    (point: Point) => {
      if (canvasState.mode !== CanvasMode.Inserting) {
        return;
      }
      const layer = {
        type: canvasState.layerType,
        x: point.x,
        y: point.y,
        rx: lastUsedValues.rx,
        stroke: lastUsedValues.strokeColor,
        strokeWidth: lastUsedValues.strokeWidth,
        height: 0,
        width: 0,
        fill: lastUsedValues.fillColor,
      };

      setTempLayer(layer);
    },
    [canvasState, tempLayer]
  );

  const continueDrawingShape = useCallback(
    (point: Point, e: React.PointerEvent) => {
      if (
        canvasState.mode !== CanvasMode.Inserting ||
        e.buttons !== 1 ||
        tempLayer == null
      ) {
        return;
      }
      const XYWH = boundingBox([tempLayer]);
      if (!XYWH) return;

      if (!XYWH) return;

      let corner = Side.Bottom + Side.Right; // Default to bottom-right corner

      // Determine the corner based on the direction of movement
      if (point.x < XYWH.x && point.y < XYWH.y) {
        corner = Side.Top + Side.Left; // Top-left corner
      } else if (point.x < XYWH.x && point.y > XYWH.y + XYWH.height) {
        corner = Side.Bottom + Side.Left; // Bottom-left corner
      } else if (point.x > XYWH.x + XYWH.width && point.y < XYWH.y) {
        corner = Side.Top + Side.Right; // Top-right corner
      } else if (
        point.x > XYWH.x + XYWH.width &&
        point.y > XYWH.y + XYWH.height
      ) {
        corner = Side.Bottom + Side.Right; // Bottom-right corner
      }

      const bounds = resizeBounds(XYWH, corner, point);

      setTempLayer((prev) => ({ ...prev, ...bounds }) as any);
    },
    [canvasState, tempLayer]
  );

  const insertPath = useCallback(() => {
    // const liveLayers = layers;
    if (
      pencilDraft === null ||
      pencilDraft.length < 2 ||
      layerIds.length >= MAX_LAYERS
    ) {
      setPencilDraft(null);
      return;
    }
    const layerId = (layerIds.length + 1).toString();
    setLayerIds((prev) => [...prev, layerId]);
    // trackHistory();
    setLayers((prev) => ({
      ...prev,
      [layerId]: penPointsToPathLayer(pencilDraft, lastUsedValues.fillColor),
    }));
    setPencilDraft(null);
    updateLiveBoardData({
      pencilDraft: null,
    });
    setCanvasState({ mode: CanvasMode.Pencil });
    updateDBboardLayers({
      ...layers,
      [layerId]: penPointsToPathLayer(pencilDraft, lastUsedValues.fillColor),
    });
  }, [pencilDraft, layers, layerIds, lastUsedValues.fillColor]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      updateLiveBoardData({
        camera: {
          x: camera.x - e.deltaX,
          y: camera.y - e.deltaY,
        },
      });
      setCamera((camera) => ({
        x: camera.x - e.deltaX,
        y: camera.y - e.deltaY,
      }));
    },
    [camera]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Grabbing) {
        return;
      }
      if (canvasState.mode === CanvasMode.Inserting) {
        if (
          canvasState.layerType === LayerType.Rectangle ||
          canvasState.layerType === LayerType.Ellipse
        ) {
          startDrawingShape(point);
        }
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setCanvasState({
        mode: CanvasMode.Pressing,
        origin: point,
      });
    },
    [camera, canvasState.mode, setCanvasState]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      } else if (canvasState.mode === CanvasMode.Inserting) {
        continueDrawingShape(current, e);
      }

      setCursors((prev) => {
        updateLiveBoardData({ cursors: { ...prev, [user.id]: current } });
        return {
          ...prev,
          [user.id]: current,
        };
      });
    },
    [camera, canvasState, cursors]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      setCanvasState({ mode: CanvasMode.Resizing, corner, initialBounds });
    },
    []
  );

  const onPointerUp = useCallback(
    async (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Grabbing) {
        return;
      } else if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unSelectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
        return;
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else if (canvasState.mode === CanvasMode.Translating) {
        updateDBboardLayers(layers);
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Resizing) {
        updateDBboardLayers(layers);
        setCanvasState({ mode: CanvasMode.None });
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
    },
    [camera, canvasState, setCanvasState, pencilDraft, layers, tempLayer]
  );

  const onPointerLeave = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const updatedCursors = JSON.parse(JSON.stringify(cursors));
      delete updatedCursors[user.id];
      setCursors(updatedCursors);
      updateLiveBoardData({ cursors: updatedCursors });
    },
    [cursors]
  );

  return (
    <main
      className={cn(
        "h-full w-full relative touch-none",
        {
          "cursor-crosshair":
            canvasState.mode === CanvasMode.Inserting &&
            (canvasState.layerType === LayerType.Rectangle ||
              canvasState.layerType === LayerType.Ellipse),
        },
        {
          "cursor-grab": canvasState.mode === CanvasMode.Grabbing,
        }
      )}
    >
      <Info
        boardId={boardId}
        userId={user.id}
        workspaceId={board.boardWorkspaceId}
      />
      <Participants connectedUsers={connectedUsers} currentUser={user} />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo()}
        canUndo={canUndo()}
        undo={handleUndo}
        redo={handleRedo}
      />
      <SelectionTools
        camera={camera}
        layers={layers}
        layerIds={layerIds}
        setLayerIds={handleUpdateLayerIds}
        myPresence={myPresence}
        setMyPresence={setMyPresence}
        setLastUsedValues={setLastUsedValues}
        updateLayers={updateLayers}
        deleteLayers={deleteLayer}
        duplicateLayer={duplicateLayer}
      />
      <svg
        className="h-[100vh] w-screen"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId, index) => (
            <LayerPreview
              key={index}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={"#ffffff"}
              layers={layers}
              updateLayers={updateLayers}
            />
          ))}
          <SelectionBox
            selectedLayers={myPresence.selectedLayers}
            layers={layers}
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-primary/5 stroke-primary stroke-1"
                x={Math.min(canvasState.current.x, canvasState.origin.x)}
                y={Math.min(canvasState.current.y, canvasState.origin.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorsPresence
            cursors={Object.keys(cursors)
              .filter((id) => id !== user.id)
              .reduce((acc, id) => ({ ...acc, [id]: cursors[id] }), {})}
          />
          {tempLayer !== null && (
            <LayerPreview
              id={"0"}
              onLayerPointerDown={() => {}}
              selectionColor={"#ffffff"}
              layers={{ "0": tempLayer }}
              updateLayers={() => {}}
            />
          )}
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={
                typeof lastUsedValues.fillColor === "string"
                  ? lastUsedValues.fillColor
                  : colorToCss(lastUsedValues.fillColor)
              }
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
