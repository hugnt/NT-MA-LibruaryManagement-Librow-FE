import { PATH } from "@/constants/paths";
import { Role } from "@/types/User";
import { Book, ChartColumnStacked, Contact, LayoutDashboard } from "lucide-react";


export const SidebarData = [
  {
    title: "Dashboard",
    url: PATH.Dashboard,
    icon: LayoutDashboard,
    isActive: true,
    roles: [Role.Admin, Role.Customer]
  },
  {
    title: "Books",
    icon: Book,
    isActive: true,
    roles: [Role.Admin, Role.Customer],
    items: [
      {
        title: "Bookshelf",
        url: PATH.Book,
        roles: [Role.Admin, Role.Customer]
      },
      {
        title: "Borrowing requests",
        url: PATH.BookBorrowwingRequest,
        roles: [Role.Admin, Role.Customer]
      },
      {
        title: "Borrowing books",
        url: PATH.BookBorrowwingList,
        roles: [Role.Admin, Role.Customer]
      },
    ],
  },
  {
    title: "Category",
    url: PATH.BookCategory,
    icon: ChartColumnStacked,
    roles: [Role.Admin]
  },
  {
    title: "User",
    icon: Contact,
    roles: [Role.Admin],
    items: [
      {
        title: "User list",
        url: PATH.UserAccountList,
        roles: [Role.Admin]
      },
      {
        title: "Activity log",
        url: PATH.UserActivityLog,
        roles: [Role.Admin]
      }
    ],
  },
]

