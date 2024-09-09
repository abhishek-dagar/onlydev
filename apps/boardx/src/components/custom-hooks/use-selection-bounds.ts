// import { useSelf, useStorage } from "@/liveblocks.config";
// import { Layer, XYWH } from "@/types/canvas";
// import { shallow } from "@liveblocks/client";

import { Layer, XYWH } from "@repo/ui/lib/types/canvas.type";

export const boundingBox = (layers: Layer[]): XYWH | null => {
  const first = layers[0];
  if (!first) return null;

  let left = first.x;
  let top = first.y;
  let right = first.x + first.width;
  let bottom = first.y + first.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];
    if (left > x) {
      left = x;
    }
    if (top > y) {
      top = y;
    }
    if (right < x + width) {
      right = x + width;
    }
    if (bottom < y + height) {
      bottom = y + height;
    }
  }
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

export const useSelectionBounds = ({
  layers,
  selectedLayers,
}: {
  layers: { [key: string]: Layer };
  selectedLayers: string[];
}) => {
  // const selection = useSelf((me) => me.presence.selection);
  // return useStorage((root) => {
  //   const selectedLayers = selection
  //     .map((id) => root.layers.get(id)!)
  //     .filter(Boolean);
  //     return boundingBox(selectedLayers);
  // },shallow);
  return boundingBox(selectedLayers.map((id) => layers[id]));
};
