import { SidebarData } from "@/routes/sidebar";
import { useLocation } from "react-router";


export const useBreadcrumb = () => {
    const { pathname } = useLocation();
    const breadcrumbs = [];

    for (const item of SidebarData) {
        const itemUrl = item.url || "";
        if (!itemUrl) continue;
        if (pathname.startsWith(itemUrl)) {
            breadcrumbs.push(item.title);

            if (item.items) {
                for (const subItem of item.items) {
                    const subItemUrl = subItem.url
                        ? `${itemUrl}${subItem.url.startsWith("/") ? subItem.url : "/" + subItem.url}`
                        : itemUrl;
                    if (pathname === subItemUrl) {
                        breadcrumbs.push(subItem.title);
                    }
                }
            }
        }
    }

    return breadcrumbs;
};
