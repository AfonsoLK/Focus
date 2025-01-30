"use client"
import { useState } from "react";
import { ChevronUp, ChevronDown, LogOut, NotebookPen, Search, Settings, Trash2, User2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "Tarefas",
    url: "#",
    icon: NotebookPen,
  },
  {
    title: "Pesquisar",
    url: "#",
    icon: Search,
  },
  {
    title: "Lixeira",
    url: "#",
    icon: Trash2,
  },
];

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-wh">
              Focus
              {open ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> Usuário
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem className="flex justify-between">
                <span>Conta</span>
                <Settings className="ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-between">
                <span>Sair</span>
                <LogOut className="ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
