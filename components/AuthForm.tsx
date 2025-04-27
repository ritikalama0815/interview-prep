"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client"
import { signUp } from "@/lib/actions/auth.action"


const authFormSchema = (type:FormType) => {
  
  return z.object({
    name: type ==="sign-up" ? z.string().min(5) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8).max(20),
  })
}
const AuthForm = ({type} : {type: FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if(type === "sign-up") {

        const{name, email, password} = values;

        // Create a new user with email and password
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!, // name is required
          email,
          password,
        })
        if(!result?.success){
          toast.error(result?.error);
          return;
        }
        toast.success("Registration successful!");
        router.push("/sign-in");
      } else{
        toast.success("Login successful!");
        router.push("/");
        // Redirect to home page or dashboard page.
        
      }
    } catch (error) {
      console.log(error);
      toast.error(`Form validation failed: ${error}`);
    }
  }

  const isSignIn = type === "sign-in"
  return (
    <div className="card-border lg:min-w-[556px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src='/logo.svg' alt="logo" height={32} width={38}/>
          <h2 className="text-primary-100">Interviewer Yuegui</h2>
        </div>
          <h3>Rock your Interview</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="name"
                placeholder="Your Name"
                />
            )}
            <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Your Email"
                type="email"
                />
            <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Your Password"
                type="password"
                />
            <Button  className='btn' type="submit">
              {isSignIn ? 'SignIn' : 'Create an Account'}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn? 'Don\'t have an account?' : 'Already have an account?'}
          <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
            {!isSignIn? 'Sign In' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
