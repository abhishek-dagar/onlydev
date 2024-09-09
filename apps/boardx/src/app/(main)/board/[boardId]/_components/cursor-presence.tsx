"use client";

// import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { memo } from "react";
// import { Cursor } from "./cursor";
// import { shallow } from "@liveblocks/client";
// import { Path } from "./layer-components/path";
// import { colorToCss } from "@/lib/utils";
import { Cursor } from "./cursor";
import { Point } from "@repo/ui/lib/types/canvas.type";

const Cursors = ({ cursors }: { cursors: Record<string, Point> }) => {
  return (
    <>
      {Object.keys(cursors).map((userId: string, index) => (
        <Cursor
          key={userId}
          userId={userId}
          cursor={cursors[userId]}
          index={index}
        />
      ))}
    </>
  );
};

// const Drafts = () => {
//   const others = useOthersMapped((other) => ({
//     pencilDraft: other.presence.pencilDraft,
//     penColor: other.presence.penColor,
//   }), shallow);

//   return (
//     <>
//       {others.map(([key, other]) => {
//         if (other.pencilDraft) {
//           return (
//             <Path
//               key={key}
//               x={0}
//               y={0}
//               points={other.pencilDraft}
//               fill={other.penColor ? colorToCss (other.penColor) : "#000"}
//             />
//           );
//         }

//         return null;
//       })}
//     </>
//   )
// }

export const CursorsPresence = memo(
  ({ cursors }: { cursors: Record<string, Point> }) => {
    return (
      <>
        {/* <Drafts /> */}
        <Cursors cursors={cursors} />
      </>
    );
  }
);

CursorsPresence.displayName = "CursorsPresence";
