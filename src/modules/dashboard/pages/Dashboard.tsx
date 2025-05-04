import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { BookOpenText, ChartBarStacked, GitPullRequestDraft, User } from 'lucide-react'
import { PopularBookChart } from '../components/PopularBookChart'
import { RequestStatusChart } from '../components/RequestStatusChart'
import { useEffect, useState } from 'react'
import { DashboardModel } from '@/types/Dashboard'
import dashboardService from '../service/dashboardService'


const iconsList = [
    <BookOpenText size={16} className='text-muted-foreground' />,
    <ChartBarStacked size={16} className='text-muted-foreground' />,
    <User size={16} className='text-muted-foreground' />,
    <GitPullRequestDraft size={16} className='text-muted-foreground' />
]


export default function Dashboard() {
    const [topData, setTopData] = useState<DashboardModel[]>([])
    const [popularBooks, setPopularBooks] = useState<DashboardModel[]>([])
    const [requestStatus, setRequestStatus] = useState<DashboardModel[]>([])

    useEffect(() => {
        dashboardService.getSummaryInfo().then(res => {
            for (let i = 0; i < res.data!.length; i++) {
                res.data![i].icon = iconsList[i]
            }
            setTopData(res.data!)
        })
        dashboardService.getPopularBooks().then(res => {
            for (let i = 0; i < res.data!.length; i++) {
                res.data![i].fill = `hsl(var(--chart-${i + 1}))`
            }
            setPopularBooks(res.data!)
        })
        dashboardService.getRequestAnalysis().then(res => {
            res.data![0].fill = "hsl(var(--chart-green))";
            res.data![1].fill = "hsl(var(--chart-red))";

            setRequestStatus(res.data!)
        })
    }, [])

    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between space-y-2'>
                <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
                <div className='flex items-center space-x-2'>
                    <Button>Download</Button>
                </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {topData.map(x => <Card key={x.title} className='gap-2'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            {x.title}
                        </CardTitle>
                        {x.icon}
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold'>{x.total}</div>
                        <p className='text-muted-foreground text-xs'>
                            {x.subContent}
                        </p>
                    </CardContent>
                </Card>)}
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-4'>
                    <CardHeader>
                        <CardTitle>Popular books</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                        <PopularBookChart data={popularBooks} />
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            Top most borrowed books
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Showing the total number of borrow requests
                        </div>
                    </CardFooter>
                </Card>
                <Card className='col-span-1 lg:col-span-3'>
                    <CardHeader>
                        <CardTitle>Request status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RequestStatusChart data={requestStatus} />
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Total approved versus total rejected requests
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Data reflects the total number of customers to date
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </ div>
    )
}
