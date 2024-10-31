"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  Bookmark,
  ChevronLeft,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from "@/redux/features/authSlice";

export default function MoreDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const [showModeToggle, setShowModeToggle] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!event.target) return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowModeToggle(false);
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref]);

  const handlLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      })
      .finally(() => {
        router.push("/");
      });
  };

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={() => setOpen(!open)}
          variant={"ghost"}
          size={"lg"}
          className="md:w-full !justify-start space-x-2 !px-3"
        >
          <Menu />
          <div className="hidden lg:block">More</div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={ref}
        className={cn(
          "dark:bg-neutral-800 w-64 !rounded-xl !p-0 transition-opacity",
          !open && "opacity-0"
        )}
        align="end"
        alignOffset={-40}
      >
        {!showModeToggle && (
          <>
            <DropdownMenuItem className="menuItem">
              <Settings size={20} />
              <p>Settings</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="menuItem">
              <Activity size={20} />
              <p>Your activity</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="menuItem">
              <Bookmark size={20} />
              <p>Saved</p>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="menuItem"
              onClick={() => setShowModeToggle(true)}
            >
              <Moon size={20} />
              <p>Switch appearance</p>
            </DropdownMenuItem>

            <DropdownMenuItem className="menuItem" onClick={handlLogout}>
              <LogOut size={20} />
              <p>Log out</p>
            </DropdownMenuItem>
          </>
        )}

        {showModeToggle && (
          <>
            <div className="flex items-center border-b border-gray-200 dark:border-neutral-700 py-3.5 px-2.5">
              <ChevronLeft size={18} onClick={() => setShowModeToggle(false)} />
              <p className="font-bold ml-1">Switch appearance</p>
              {theme === "dark" ? (
                <Moon size={20} className="ml-auto" />
              ) : (
                <Sun size={20} className="ml-auto" />
              )}
            </div>

            <Label htmlFor="dark-mode" className="menuItem">
              Dark Mode
              <DropdownMenuItem className="ml-auto !p-0">
                <Switch
                  id="dark-mode"
                  className="ml-auto"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? "dark" : "light");
                  }}
                />
              </DropdownMenuItem>
            </Label>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
