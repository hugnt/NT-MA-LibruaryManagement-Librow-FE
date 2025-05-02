import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/paths'
import { useNavigate } from 'react-router'

export default function ForbiddenError() {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
            <span className='font-medium'>Access Forbidden</span>
            <p className='text-muted-foreground text-center'>
                You don't have necessary permission <br />
                to view this resource.
            </p>
            <div className='mt-6 flex gap-4'>
                <Button variant='outline' onClick={() => history.go(-1)}>
                    Go Back
                </Button>
                <Button onClick={() => navigate(PATH.Dashboard)}>Back to Home</Button>
            </div>
        </div>
    )
}