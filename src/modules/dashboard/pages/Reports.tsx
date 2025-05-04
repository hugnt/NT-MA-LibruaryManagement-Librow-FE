import { Button } from '@/components/ui/button'

export default function Report() {
    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between space-y-2'>
                <h1 className='text-2xl font-bold tracking-tight'>Report</h1>
                <div className='flex items-center space-x-2'>
                    <Button>Download</Button>
                </div>
            </div>

        </ div>
    )
}
