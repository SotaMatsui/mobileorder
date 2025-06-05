import { Home, LayoutDashboard, Settings, UtensilsIcon } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { AppSidebarTitle } from "@/components/app-sidebar-title"
import { AppSidebarTrigger } from "./app-sidebar-trigger"

const sidebarOperationItems = [
  {
    title: "注文ダッシュボード",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "メニュー管理",
    url: "/menu",
    icon: UtensilsIcon,
  },
]
const sidebarAccountItems = [
  {
    title: "アカウント設定",
    url: "/my-page",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarContent>
        <AppSidebarTitle />
        <SidebarGroup>
          <SidebarGroupLabel>店内オペレーション</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarOperationItems.map((item) => (
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
        <SidebarGroup>
          <SidebarGroupLabel>アカウント</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarAccountItems.map((item) => (
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
      <SidebarFooter className="pb-8 pr-0">
        <div className="flex justify-end">
          <div className="bg-background p-2 rounded-l-full">
            <AppSidebarTrigger />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}