import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "./themecontext";
export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-amber-500 dark:text-slate-400" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-slate-500 dark:text-amber-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
