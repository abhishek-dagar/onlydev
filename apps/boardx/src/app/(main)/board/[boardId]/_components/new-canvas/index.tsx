"use client";
import Logo from "@/components/Logo";
import { useSocket } from "@/context/SocketProvider";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import { Button } from "@repo/ui/components/ui/button";
import { BoardType } from "@repo/ui/lib/types/bards.type";
import { UserType } from "@repo/ui/lib/types/user.types";
import { cn } from "@repo/ui/lib/utils";
import {
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState, useEffect, useCallback } from "react";
import { CursorsPresence } from "../cursor-presence";
import { Point } from "@repo/ui/lib/types/canvas.type";
import "./index.css";
import { updateBoard } from "@/lib/actions/board.action";
import { Switch } from "@repo/ui/components/ui/switch";

interface ExcalidrawWrapperProps {
  board: BoardType;
  user: UserType;
  updateDbBoard: (data: BoardType) => void;
}

const ExcalidrawWrapper = ({
  board,
  user,
  updateDbBoard,
}: ExcalidrawWrapperProps) => {
  const [isLight, setIsLight] = useState<boolean | undefined>(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
  const [isButtonDown, setIsButtonDown] = useState(false);
  const [elements, setElements] = useState<readonly ExcalidrawElement[]>([]);
  const [cursors, setCursors] = useState<Record<string, Point>>({});
  const [tabs, setTabs] = useState("note");
  const [panelSize, setPanelSize] = useState([50, 50]);

  const { theme, setTheme } = useTheme();
  const { socket } = useSocket();

  const handleThemeChange = (newMode: string, colorVariant?: string) => {
    const themeArray = theme?.split("-") || ["light"]; // Default to light if theme is undefined
    themeArray[0] = newMode; // Change the first part of the theme (mode: light or dark)
    if (colorVariant) themeArray[1] = colorVariant;
    setTheme(themeArray.join("-")); // Update theme preserving any additional variants
  };

  const updateBoardData = async (data: any) => {
    if (data.userId === user.id) return; // Ignore updates from the same user
    setCursors(data.cursors);
    if (data.elements) {
      setElements(data.elements);
    }
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: data.elements || [],
      });
    }
  };

  // Send updates to the server when elements change
  const handleElementsChange = useCallback(
    (data: { elements: readonly ExcalidrawElement[]; appState?: AppState }) => {
      if (!isButtonDown) return;
      setElements(data.elements);
    },
    [isButtonDown]
  );

  const handleLiveBoardData = useCallback(
    (data: any) => {
      const liveBoardData = {
        cursors,
        roomId: board.id,
        userId: user.id,
        elements: elements,
        ...data,
      };
      socket?.emit("update-board", liveBoardData);
    },
    [elements, cursors]
  );

  const updateDBboardLayers = async (
    elements: readonly ExcalidrawElement[]
  ) => {
    const res = await updateBoard({
      id: board.id,
      layers: elements,
    });
  };

  useEffect(() => {
    // console.log(board.layers);
    setElements(board.layers as any);
  }, []);

  useEffect(() => {
    setIsLight(theme?.includes("light"));
  }, [theme]);

  useEffect(() => {
    if (socket) {
      // Join the board room
      socket.emit("connect-to-board-room", {
        roomId: board.id,
        userId: user.id,
      });

      // Listen for board updates from the server
      socket.on("update-board", (data) => {
        updateBoardData(data);
      });

      return () => {
        // Leave the board room on cleanup
        socket.emit("leave-board-room", {
          roomId: board.id,
          userId: user.id,
        });
        socket.off("update-board", updateBoardData);
      };
    }
  }, [socket, excalidrawAPI, board.id, user.id]);

  const onPointerUp = useCallback(() => {
    setIsButtonDown(false);
    if (excalidrawAPI) {
      updateDBboardLayers(excalidrawAPI.getSceneElements());
      setElements(excalidrawAPI.getSceneElements());
    }
  }, [excalidrawAPI, elements]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const current = { x: e.clientX, y: e.clientY };
      // handleLiveBoardData({ cursors: current });
      setCursors((prev) => {
        handleLiveBoardData({ cursors: { ...prev, [user.id]: current } });
        return {
          ...prev,
          [user.id]: current,
        };
      });
    },
    [elements, cursors]
  );

  const onPointerLeave = useCallback(() => {
    setIsButtonDown(false);
    const updatedCursors = JSON.parse(JSON.stringify(cursors));
    delete updatedCursors[user.id];
    setCursors(updatedCursors);
    handleLiveBoardData({ cursors: updatedCursors });
  }, [cursors]);

  const handlePanelSize = (value: string) => {
    setTabs(value);
    if (value === "both") {
      setPanelSize([50, 50]);
    } else if (value === "note") {
      setPanelSize([100, 0]);
    } else if (value === "board") {
      setPanelSize([0, 100]);
    }
  };

  const handleIsPublic = async (checked: boolean) => {
    updateDbBoard({ ...board, isPublic: checked });
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      onPointerDown={() => setIsButtonDown(true)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
    >
      {cursors && (
        <CursorsPresence
          cursors={Object.keys(cursors)
            .filter((id) => id !== user.id)
            .reduce((acc, id) => ({ ...acc, [id]: cursors[id] }), {})}
        />
      )}
      {/* <div className="h-10 border-b">
        <Button onClick={() => handlePanelSize("both")}>Both</Button>
        <Button onClick={() => handlePanelSize("note")}>Note</Button>
        <Button onClick={() => handlePanelSize("board")}>Board</Button>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={panelSize[0]}
          minSize={tabs === "note" ? 100 : tabs === "both" ? 25 : 0}
        >
          <div className="h-[calc(100%-2.5rem)] w-full">notes</div>
        </ResizablePanel>
        {tabs === "both" && <ResizableHandle withHandle />}
        <ResizablePanel
          defaultSize={panelSize[1]}
          minSize={tabs === "board" ? 100 : tabs === "both" ? 30 : 0}
        > */}
      <div className="h-full w-full">
        <Excalidraw
          theme={!isLight ? "dark" : "light"}
          initialData={{ elements }}
          excalidrawAPI={(api) => {
            setExcalidrawAPI(api);
          }}
          onChange={(elements, appState) => {
            handleElementsChange({ elements, appState });
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.SaveToActiveFile />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.Separator />
            <MainMenu.ItemCustom className="flex items-center justify-between">
              <p className="flex items-center">
                {board.isPublic ? (
                  <LockKeyholeOpenIcon className="h-4 w-4 mr-2" />
                ) : (
                  <LockKeyholeIcon className="h-4 w-4 mr-2" />
                )}
                Public
              </p>
              <div className="opacity-100 border rounded-md">
                <Switch
                  checked={board.isPublic}
                  onCheckedChange={handleIsPublic}
                  className="h-4 w-9"
                  thumbClassName="h-3 w-3"
                />
              </div>
            </MainMenu.ItemCustom>
            <MainMenu.Separator />
            <MainMenu.ItemCustom className="flex items-center justify-between">
              <span>Theme</span>
              <div className="opacity-100 border rounded-md">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className={cn("h-7 w-10", {
                    "bg-primary text-white": isLight,
                  })}
                  onClick={() => handleThemeChange("light")}
                >
                  <SunIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className={cn("h-7 w-10", {
                    "bg-primary text-white": !isLight,
                  })}
                  onClick={() => handleThemeChange("dark", "violet")}
                >
                  <MoonIcon className="h-4 w-4" />
                </Button>
              </div>
            </MainMenu.ItemCustom>
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.HelpHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Logo>
                <Logo />
              </WelcomeScreen.Center.Logo>
              <WelcomeScreen.Center.Heading>
                Diagram made simple
              </WelcomeScreen.Center.Heading>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      </div>
      {/* </ResizablePanel>
      </ResizablePanelGroup> */}
    </div>
  );
};

export default ExcalidrawWrapper;
