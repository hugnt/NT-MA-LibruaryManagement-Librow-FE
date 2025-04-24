import { AppSidebar } from "@/components/layout/main/app-sidebar"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import AppHeader from "./app-header"


export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="p-4 pt-0">
          <Outlet />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
