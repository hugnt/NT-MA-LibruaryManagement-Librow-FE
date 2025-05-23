import FormLoading from "@/components/loading/FormLoading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Book, defaultBook } from "@/types/Book";
import { BookCategory } from "@/types/BookCategory";
import { FormMode, FormSetting, formSettingDefault } from "@/types/form";
import { BookSchema } from "@/types/schema/bookSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormDetailProps {
    formSetting: FormSetting,
    setFormSetting: (setting: FormSetting) => void,
    data?: Book,
    categories: BookCategory[],
    title?: string,
    loading?: boolean,
    onSubmit?: (data: Book) => void
}

export default function FormDetails(props: FormDetailProps) {
    const { formSetting = formSettingDefault, setFormSetting = () => { }, data, categories = [], onSubmit = () => { }, title = "Details", loading = false } = props;
    const form = useForm<Book>({
        resolver: zodResolver(BookSchema),
        defaultValues: data ?? defaultBook,
    })


    useEffect(() => {
        if (data) form.reset(data);
    }, [data])


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
                {loading ? <FormLoading /> : <>
                    <Form {...form}>
                        <form
                            id='tasks-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex-1 space-y-5 px-4'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter a title' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Category for this book" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                {
                                                    categories?.map(x => {
                                                        return <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='author'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <FormLabel>Author</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Enter author name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='quantity'
                                render={({ field }) => (
                                    <FormItem className='space-y-1'>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                placeholder='Enter quantity' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
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
        </Sheet>
    )
}
