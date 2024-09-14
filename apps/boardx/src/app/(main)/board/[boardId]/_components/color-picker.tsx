"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@repo/ui/lib/types/canvas.type";

interface ColorPickerProps {
  onChange: (color: Color | string) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2">
      <ColorButton color={"transparent"} onClick={onChange} />
      <ColorButton color={"#f35223"} onClick={onChange} />
      <ColorButton color={"#fff9b1"} onClick={onChange} />
      <ColorButton color={"#44ca63"} onClick={onChange} />
      <ColorButton color={"#3b82f6"} onClick={onChange} />
      <ColorButton color={"#9a5cf2"} onClick={onChange} />
      <ColorButton color={"#eab308"} onClick={onChange} />
      <ColorButton color={"#ffffff"} onClick={onChange} />
      <ColorButton color={"#000000"} onClick={onChange} />
    </div>
  );
};

interface ColorButtonProps {
  color: Color | string;
  onClick: (color: Color | string) => void;
}

export const ColorButton = ({ color, onClick }: ColorButtonProps) => {
  return (
    <button
      className="w-5 h-5 flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-5 w-5 rounded-md border bg-white"
        style={{
          backgroundColor:
            typeof color === "string"
              ? color === "transparent"
                ? "#fff"
                : color
              : colorToCss(color),

          backgroundImage:
            color === "transparent"
              ? "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==)"
              : "",
            backgroundSize: "10px 10px",
        }}
        aria-hidden="true"
      />
    </button>
  );
};
