import React, { useEffect, useState } from "react";
import { Rectangle } from "./layer-components/rectangle";
import { Ellipse } from "./layer-components/ellipse";
import { Text } from "./layer-components/text";
// import { Note } from "./layer-components/note";
import { Path } from "./layer-components/path";
import { colorToCss } from "@/lib/utils";
import { Layer, LayerType } from "@repo/ui/lib/types/canvas.type";
import { Note } from "./layer-components/note";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
  layers?: { [key: string]: Layer };
  updateLayers: (key: string, layer: Layer) => void;
}

export const LayerPreview = ({
  id,
  onLayerPointerDown,
  selectionColor,
  layers,
  updateLayers,
}: LayerPreviewProps) => {
  // const layer = useStorage((root) => root.layers.get(id));
  const [layer, setLayer] = useState<Layer>();

  useEffect(() => {
    if (layers) {
      const layer = layers[id];
      if (layer) {
        setLayer(layer);
      }
    }
  }, [id, layers]);

  if (!layer) return null;

  switch (layer.type) {
    case LayerType.Text:
      return (
        <Text
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
          updateLayer={updateLayers}
        />
      );
    case LayerType.Note:
      return (
        <Note
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
          updateLayer={updateLayers}
        />
      );
    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Path:
      return (
        <Path
          key={id}
          points={layer.points}
          onPointerDown={(e) => onLayerPointerDown(e, id)}
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : "#fff"}
          stroke={selectionColor}
        />
      );
    default:
      return null;
  }

  return <div>LayerPreview</div>;
};
LayerPreview.displayName = "LayerPreview";
