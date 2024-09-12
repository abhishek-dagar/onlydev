import Hint from "@repo/ui/components/common/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";


interface UserAvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
}

export const UserAvatar = ({
  src,
  name,
  fallback,
  borderColor,
}: UserAvatarProps) => {
  return (
    <Hint label={name || "Teammate"} side="bottom" sideOffset={10}>
      <Avatar className="h-8 w-8 border-2 bg-background" style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className="text-sm font-semibold uppercase bg-background">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};
