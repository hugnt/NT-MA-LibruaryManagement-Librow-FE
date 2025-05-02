import FormLoading from "@/components/loading/FormLoading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Role, UserRequest, defaultUserRequest } from "@/types/User";
import { FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { userRequestSchema } from "@/types/schema/registerSchema ";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: UserRequest,
    title?: string,
    loading?: boolean,
    onSubmit?: (data: UserRequest) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, onSubmit = () => { }, title = "Details", loading = false } = props;
    const form = useForm<UserRequest>({
        resolver: zodResolver(userRequestSchema),
        defaultValues: data ?? defaultUserRequest,
    })

    useEffect(() => {
        if (data) form.reset(data);
    }, [data])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form.getValues())
        form.handleSubmit(onSubmit)();
    }

    return (
        <Sheet
            open={formSetting.open}
            onOpenChange={(v) => {
                setFormSetting({ ...formSetting, open: v })
                form.reset()
            }}>
            <SheetContent
                onInteractOutside={event => event.preventDefault()}
                className='flex flex-col'>
                <SheetHeader className='text-left'>
                    <SheetTitle>{formSetting.mode} {title}</SheetTitle>
                    <SheetDescription>
                        {formSetting.mode == FormMode.EDIT && 'Update details by providing necessary info.'}
                        {formSetting.mode == FormMode.ADD && 'Add a new record by providing necessary info.'}
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                {loading ? <FormLoading /> :
                    <>
                        <Form {...form}>
                            <ScrollArea className="h-[calc(100vh-250px)]">
                                <form
                                    id='tasks-form'
                                    onSubmit={handleFormSubmit}
                                    className='flex-1 space-y-5 px-4'>
                                    <FormField
                                        control={form.control}
                                        name='fullname'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1'>
                                                <FormLabel>Full name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder='Enter fullname of user' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select
                                                    defaultValue={field.value.toString()}
                                                    onValueChange={field.onChange}>
                                                    <FormControl className="w-full">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Role for this user" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent >
                                                        <SelectItem value={`${Role.Customer}`}>Customer</SelectItem>
                                                        <SelectItem value={`${Role.Admin}`}>Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='username'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1'>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder='Enter username' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1'>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} placeholder='Enter email' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1' hidden={!data?.isCheckPassword}>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} placeholder='Enter password' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='passwordRetype'
                                        render={({ field }) => (
                                            <FormItem className='space-y-1' hidden={!data?.isCheckPassword}>
                                                <FormLabel>Retype Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} placeholder='Enter password' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='isCheckPassword'
                                        render={({ field }) => (
                                            <Input hidden={true} type="checkbox" {...field} value={`${data?.isCheckPassword}`} />
                                        )}
                                    />
                                </form>
                            </ScrollArea>
                        </Form>
                        <SheetFooter className='gap-2'>
                            <SheetClose asChild>
                                <Button variant='outline'>Close</Button>
                            </SheetClose>
                            <Button form='tasks-form' type='submit'>
                                Save changes
                            </Button>
                        </SheetFooter>
                    </>}
            </SheetContent>
        </Sheet >
    )
}
