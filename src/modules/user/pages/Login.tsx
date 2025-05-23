import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";
import { handleSuccessApi } from "@/lib/utils";
import { LoginRequest } from "@/types/User";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

export default function Login() {
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<LoginRequest>({
        defaultValues: {
            username: '',
            password: ''
        },
    })
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const data = form.getValues();
        login(data).then(() => {
            handleSuccessApi({ message: "Login successfully!" })
            navigate(PATH.Book);
        }).finally(() => setLoading(false))
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={handleFormSubmit} className="p-6 md:p-8">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Hellooooo</h1>
                            <p className="text-balance text-muted-foreground">
                                Login to your Librow account
                            </p>
                        </div>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Enter username' />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder='Enter Password' />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button loading={loading} type="submit" className="w-full">
                            Login
                        </Button>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        </div>
                        <div className="text-center text-sm">
                            Dont have an account?{" "}
                            <Link to={PATH.Register} className="underline underline-offset-4">
                                Register
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
        </div>

    )
}
