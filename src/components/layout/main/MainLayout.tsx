import { AppSidebar } from "@/components/layout/main/AppSidebar"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import AppHeader from "./AppHeader"


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
