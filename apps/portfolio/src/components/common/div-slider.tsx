"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const DivSlider = () => {
  const controls = useAnimation(); // Control the animation programmatically

  useEffect(() => {
    // Start the animation
    controls.start({
      y: "-50%", // End position
      transition: { duration: 0.5 }, // Total animation duration
    });

    // Pause the animation after 2 seconds
    const timer = setTimeout(() => {
      controls.stop();
    }, 2000);
    const timerStart = setTimeout(() => {
      console.log("start");
      controls.start({
        y: "-100%",
        transition: { duration: 0.5 }, // Remaining duration
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerStart);
    };
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      className="bg-muted h-screen w-screen absolute top-0 left-0 z-[110]"
    />
  );
};

export default DivSlider;
