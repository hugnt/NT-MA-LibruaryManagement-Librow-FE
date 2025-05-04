import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardModel } from "@/types/Dashboard"
import { Pie, PieChart } from "recharts"
import { useMemo } from "react"

interface ChartDataProps {
    data: DashboardModel[]
}

export function RequestStatusChart({ data }: ChartDataProps) {

    const chartConfig: ChartConfig = useMemo(() => {
        return Object.fromEntries(
            data.map((item) => [
                item.title,
                {
                    label: item.title,
                    color: item.fill!,
                },
            ])
        )
    }, [data])

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]" >
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={data} dataKey="total" nameKey="title" />
                <ChartLegend
                    content={<ChartLegendContent nameKey="title" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/2 [&>*]:justify-center"
                />
            </PieChart>
        </ChartContainer>
    )
}
