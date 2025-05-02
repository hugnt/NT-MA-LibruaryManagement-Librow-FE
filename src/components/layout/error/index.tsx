import { Outlet } from 'react-router'

export default function ErrorLayout() {
    return (
        <div className='h-svh'>
            <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                <Outlet />
            </div>
        </div>
    )
}