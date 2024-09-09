"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";

export function ThemeModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isLight, setIsLight] = React.useState<boolean | undefined>(false);

  const handleThemeChange = (newMode: string, colorVariant?: string) => {
    const themeArray = theme?.split("-") || ["light"]; // Default to light if theme is undefined
    themeArray[0] = newMode; // Change the first part of the theme (mode: light or dark)
    if (colorVariant) themeArray[1] = colorVariant;
    console.log(themeArray.join("-"));

    setTheme(themeArray.join("-")); // Update theme preserving any additional variants
  };

  React.useEffect(() => {
    setIsLight(theme?.includes("light"));
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 text-foreground" size="icon">
          {/* Check the theme and display the appropriate icon */}
          {isLight ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Option for Light theme */}
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>

        {/* Option for Dark theme (with a variant, for example, dark-violet) */}
        <DropdownMenuItem onClick={() => handleThemeChange("dark", "violet")}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
