import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"
import { DashboardModel } from "@/types/Dashboard"

interface PopularBookChartProps {
    data: DashboardModel[]
}

export function PopularBookChart({ data }: PopularBookChartProps) {
    // Thêm fill theo index cho mỗi item
    const chartData = useMemo(() => {
        return data.map((item, index) => ({
            ...item,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`, // Giới hạn 5 màu để tránh lỗi CSS
        }))
    }, [data])

    const chartConfig = useMemo(() => {
        return Object.fromEntries(
            chartData.map((item) => [
                item.title,
                {
                    label: item.title,
                    color: item.fill!,
                },
            ])
        )
    }, [chartData])

    return (
        <ChartContainer config={chartConfig} className="">
            <BarChart
                data={chartData}
                layout="vertical"
            >
                <YAxis
                    dataKey="title"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    width={150} // Set a fixed width for the axis
                    tick={{ fontSize: 12 }} // Adjust font size if needed
                />
                <XAxis dataKey="total" type="number" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                    dataKey="total"
                    layout="vertical"
                    radius={5}
                    fill={undefined}
                />
            </BarChart>
        </ChartContainer>
    )
}
