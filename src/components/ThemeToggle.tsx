import { Moon, Sun, Skull } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="fixed top-4 right-4">
					{theme === "light" && (
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
					)}
					{theme === "dark" && (
						<Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
					)}
					{theme === "dracula" && (
						<Skull className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
					)}
					<span className="sr-only">Alternar tema</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun className="mr-2 h-4 w-4" />
					<span>Claro</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon className="mr-2 h-4 w-4" />
					<span>Escuro</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dracula")}>
					<Skull className="mr-2 h-4 w-4" />
					<span>Dracula</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
