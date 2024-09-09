export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
}

export type BasicLayer = {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color | string;
  rx?: number;
  value?: string;
  stroke: Color | string;
  strokeWidth?: number;
};

export interface RectangleLayer extends BasicLayer {
  type: LayerType.Rectangle;
}

export interface EllipseLayer extends BasicLayer {
  type: LayerType.Ellipse;
}

export interface PathLayer extends BasicLayer {
  type: LayerType.Path;
  points: number[][];
}

export interface TextLayer extends Omit<BasicLayer, "stroke" | "strokeWidth"> {
  type: LayerType.Text;
}

export interface NoteLayer extends Omit<BasicLayer, "stroke" | "strokeWidth"> {
  type: LayerType.Note;
}

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note;
    }
  | {
      mode: CanvasMode.Pencil;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    }
  | {
      mode: CanvasMode.Resizing;
      initialBounds: XYWH;
      corner: Side;
    };

export enum CanvasMode {
  None,
  Pressing,
  SelectionNet,
  Translating,
  Inserting,
  Resizing,
  Pencil,
}

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer;

export interface MyPresenceType {
  selectedLayers: string[];
}
