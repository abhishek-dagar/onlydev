"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@repo/ui/lib/types/canvas.type";

interface ColorPickerProps {
  onChange: (color: Color | string) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-2">
      <ColorButton color={"transparent"} onClick={onChange} />
      <ColorButton color={{ r: 243, g: 82, b: 35 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 249, b: 177 }} onClick={onChange} />
      <ColorButton color={{ r: 68, g: 202, b: 99 }} onClick={onChange} />
      <ColorButton color={{ r: 39, g: 142, b: 237 }} onClick={onChange} />
      <ColorButton color={{ r: 155, g: 105, b: 245 }} onClick={onChange} />
      <ColorButton color={{ r: 252, g: 142, b: 42 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />
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
