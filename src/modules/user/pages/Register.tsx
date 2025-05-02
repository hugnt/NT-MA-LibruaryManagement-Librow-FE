import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PATH } from "@/constants/paths";
import { useAuthContext } from "@/context/authContext";
import { handleSuccessApi, setClientToken } from "@/lib/utils";
import { registerSchema } from "@/types/schema/registerSchema ";
import { RegisterRequest, Token } from "@/types/User";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import loginService from "../service/loginService";

export default function Register() {
    const [loading, setLoading] = useState<boolean>(false);
    const { setIsAuthenticated, setUser } = useAuthContext();
    const navigate = useNavigate();
    const form = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            password: '',
            fullname: '',
            email: '',
            passwordRetype: '',
            isCheckPassword: true
        },
    })

    const handleFormSubmit = (data: RegisterRequest) => {
        console.log("data:", data)
        setLoading(true)
        loginService.register(data).then(res => {
            const token: Token = {
                accessToken: res.data?.accessToken,
                refreshToken: res.data?.refreshToken,
            }
            handleSuccessApi({ message: "Register successfully!" })
            setClientToken(token);
            setIsAuthenticated(true);
            setUser(res.data?.user);
            form.reset();
            navigate(PATH.Book);
        }).finally(() => setLoading(false))
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="p-6 md:p-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Register</h1>
                            <p className="text-balance text-muted-foreground">
                                Register a new account to join with us
                            </p>
                        </div>
                        <FormField
                            control={form.control}
                            name='fullname'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Your fullname</FormLabel>
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
                                    <FormLabel>Your email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} placeholder='Enter username' />
                                    </FormControl>
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
                            name='password'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder='Enter Password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='passwordRetype'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Retype Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder='Enter Password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button loading={loading} type="submit" className="w-full">
                            Register
                        </Button>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        </div>
                        <div className="text-center text-sm">
                            Do you have an account?{" "}
                            <Link to={PATH.Login} className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>

        </div>
    )
}

