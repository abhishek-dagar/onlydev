import Image from "next/image";
import React from "react";

const EmptyFavorite = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src={"/empty-favorites.svg"} alt="Empty" height={140} width={140} />
      <h2 className="text-2xl font-semibold mt-6">No favorite boards!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try favoring a board
      </p>
    </div>
  );
};

export default EmptyFavorite;
