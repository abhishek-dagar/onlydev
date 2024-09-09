"use client";

import { connectionIdToColor } from "@/lib/utils";
import { Point } from "@repo/ui/lib/types/canvas.type";
import { UserType } from "@repo/ui/lib/types/user.types";
import { MousePointer2Icon } from "lucide-react";
import { memo } from "react";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "@repo/ui/lib/actions/user.action";

interface CursorProps {
  userId: string;
  cursor: Point;
  index: number;
}

export const Cursor = memo(({ userId, cursor, index }: CursorProps) => {
  // const info = useOther(connectionId, (user) => user?.info);
  // const cursor = useOther(connectionId, (user) => user.presence.cursor);
  const [info, setInfo] = useState<UserType>();

  useEffect(() => {
    fetchUserProfile(userId).then(({ user }) => setInfo(user));
  }, [userId]);

  // const name = info?.name || "Teammate";
  const name = info?.name || info?.email.split("@")[0] || "Teammate";
  if (!cursor) return null;
  const { x, y } = cursor;
  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      height={50}
      width={name.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2Icon
        className="h-5 w-5"
        style={{
          fill: connectionIdToColor(index),
          color: connectionIdToColor(index),
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{
          backgroundColor: connectionIdToColor(index),
        }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
