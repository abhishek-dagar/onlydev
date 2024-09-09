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
import { fetchBoardById, updateBoard } from "@/lib/actions/board.action";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import { Path } from "../layer-components/path";

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

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [myPresence, setMyPresence] = useState<MyPresenceType>({
    selectedLayers: [],
  });
  const [layerIds, setLayerIds] = useState<string[]>([]);
  const [layers, setLayers] = useState<{ [key: string]: Layer }>({});
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255,
  });
  const [cursors, setCursors] = useState<Record<string, Point>>({});
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [pencilDraft, setPencilDraft] = useState<number[][] | null>(null);
  const [history, setHistory] = useState<{ [key: string]: Layer }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const { socket } = useSocket();

  const trackHistory = () => {
    setHistory((prev) => {
      // Check if last history is the same as the current layers state
      if (JSON.stringify(prev[historyIndex]) === JSON.stringify(layers)) {
        return prev; // No need to update if nothing has changed
      }

      // Remove all entries after the current index to ensure proper redo functionality
      const newHistory = prev.slice(0, historyIndex + 1);

      // Add the current state of layers to the history
      const updatedHistory = [
        ...newHistory,
        JSON.parse(JSON.stringify(layers)),
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
    if (canUndo()) {
      let updatedHistory = JSON.parse(JSON.stringify(history));
      updatedHistory[historyIndex] = layers;
      setHistory(updatedHistory);
      setLayers(history[historyIndex]); // Set the layers to the previous state
      setLayerIds(
        Object.keys(history[historyIndex]).map((key) => key.toString())
      );
      setHistoryIndex((prev) => prev - 1); // Move the history index back
    }
  }, [history, historyIndex]);

  // Handle redo operation
  const handleRedo = useCallback(() => {
    if (canRedo()) {
      setLayers(history[historyIndex + 1]); // Set the layers to the next state
      setLayerIds(
        Object.keys(history[historyIndex + 1]).map((key) => key.toString())
      );
      setHistoryIndex((prev) => prev + 1); // Move the history index forward
    }
  }, [history, historyIndex]);

  // React.useEffect(() => {
  //   console.log(history[historyIndex]);
  // }, [history, historyIndex]);
  const updateBoardData = async (data: any) => {
    if (data.userId === user.id) return;
    setLayerIds(data.layerIds);
    setLayers(data.layers);
    setCamera(data.camera);
    setCursors(data.cursors);
    setConnectedUsers(data.connectedUsers);
    setPencilDraft(data.pencilDraft);
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

  const updateDBboardLayers = async () => {
    await updateBoard({ id: boardId, layers: Object.values(layers) });
  };

  React.useEffect(() => {
    // console.log(layers);

    updateDBboardLayers();
  }, [layers]);

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

  const updateLayers = useCallback(
    (key: string, layer: Layer) => {
      updateLiveBoardData({
        layers: { ...layers, [key]: layer },
      });
      if (layers[key].fill !== layer.fill) {
        trackHistory();
      }
      setLayers((prev) => ({ ...prev, [key]: layer }));
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
      const layer = {
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      };

      setLayerIds((prev) => [...prev, layerId]);
      trackHistory();
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
    },
    [layerIds, lastUsedColor, layers, myPresence]
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
    trackHistory();
    setLayers(liveLayers);
    updateLiveBoardData({ layerIds: liveLayerIds, layers: liveLayers });
    setMyPresence({ ...myPresence, selectedLayers: [] });
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
    trackHistory();
    setLayers((prev) => ({
      ...prev,
      [layerId]: penPointsToPathLayer(pencilDraft, lastUsedColor),
    }));
    setPencilDraft(null);
    updateLiveBoardData({
      pencilDraft: null,
    });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, [pencilDraft, layers, layerIds, lastUsedColor]);

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
      if (canvasState.mode === CanvasMode.Inserting) {
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
        // trackHistory();
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
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
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (
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
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
    },
    [camera, canvasState, setCanvasState, pencilDraft]
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
    <main className="h-full w-full relative touch-none">
      <Info boardId={boardId} />
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
        setLastUsedColor={setLastUsedColor}
        updateLayers={updateLayers}
        deleteLayers={deleteLayer}
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
              selectionColor={"#fff"}
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
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
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
