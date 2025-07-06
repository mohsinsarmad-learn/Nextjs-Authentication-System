"use client";

import { useFont } from "./FontProvider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CaseSensitive } from "lucide-react";

export function FontSwitcher() {
  const { setFont } = useFont();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <CaseSensitive className="h-5 w-5" />
          <span className="sr-only">Switch font</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setFont("font-sans")}>
          Sans Serif (Default)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFont("font-serif")}>
          Serif
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFont("font-mono")}>
          Monospace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
