import { Book, ChartColumnStacked, Contact, LayoutDashboard } from "lucide-react";
import { useLocation } from "react-router";

export const SidebarData = [
  {
    title: "Dashboard",
    url: "",
    icon: LayoutDashboard,
    isActive: true
  },
  {
    title: "Books",
    url: "/books",
    icon: Book,
    isActive: true,
    items: [
      {
        title: "List",
        url: "/books",
      },
      {
        title: "Borrow request",
        url: "/books/borrow",
      },
    ],
  },
  {
    title: "Category",
    url: "/book-category",
    icon: ChartColumnStacked,
  },
  {
    title: "Account",
    url: "/account",
    icon: Contact,
    items: [
      {
        title: "Users",
        url: "#",
      },
      {
        title: "Roles",
        url: "#",
      }
    ],
  },
]

export const getBreadcrumb = () => {
  const { pathname } = useLocation(); // Lấy URL hiện tại
  const breadcrumbs = [];

  for (const item of SidebarData) {
    const itemUrl = item.url || "";
    if(itemUrl=="") continue;
    if (pathname.startsWith(itemUrl)) {
      breadcrumbs.push(item.title);

      if (item.items) {
        for (const subItem of item.items) {
          const subItemUrl = subItem.url ? `${itemUrl}${subItem.url.startsWith("/") ? subItem.url : "/" + subItem.url}` : itemUrl;
          if (pathname === subItemUrl) {
            breadcrumbs.push(subItem.title);
          }
        }
      }
    }
  }

  return breadcrumbs;
};