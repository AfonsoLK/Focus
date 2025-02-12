"use client";
import { useState, useEffect } from "react";
import { getSession, signOut } from "@/app/lib/auth-client";
import { ChevronUp, LogOut, NotebookPen, Trash2, Coffee } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const mainItems = [
  {
    title: "Tarefas",
    url: "#",
    icon: NotebookPen,
  },
];

interface UserData {
  name?: string | null;
  image?: string | null;
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getSession();
        if (session?.data?.user) {
          setUserData({
            name: session.data.user.name,
            image: session.data.user.image,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="pl-0 relative">
            <Coffee className="mr-0.5 w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2 group-data-[collapsible=icon]:hidden" />
            <SidebarGroupLabel className="flex items-center text-black dark:text-white text-lg pl-12">
              <span className="mt-1 text-sm mr-4 -ml-2">Focus</span>
            </SidebarGroupLabel>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="mr-2 group-data-[collapsible=icon]:mr-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
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
            <SidebarMenuButton className="flex items-center justify-center">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userData.image ?? ""}
                  alt={userData.name ?? ""}
                />
                <AvatarFallback className="rounded-lg">
                  {userData.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 group-data-[collapsible=icon]:hidden">
                {userData.name ?? "Usuário"}
              </span>
              <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="flex justify-between"
                  onSelect={(e) => e.preventDefault()}
                >
                  <span>Sair</span>
                  <LogOut className="ml-2" />
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar saída</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja sair?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Não</AlertDialogCancel>
                  <AlertDialogAction onClick={signOut}>Sim</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
