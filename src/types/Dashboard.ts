import { JSX } from "react"

export type DashboardModel = {
    title: string,
    total: number,
    subContent?: string,
    icon?: JSX.Element
    fill?: string,
}