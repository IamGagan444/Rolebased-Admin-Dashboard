import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Input } from "../components/ui/input";
import { UserLogin } from "../types/user";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message:
        "Username must only contain letters and spaces, no numbers or symbols are allowed.",
    }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema), // Don't forget to uncomment the zodResolver import
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Define onSubmit handler
  const onSubmit = (data: UserLogin) => {
    console.log(data); // Replace with actual form submission logic
  };
  return (
    <section className="h-screen flex justify-center items-center ">
      <Form {...form}>
        <Card className="w-[350px] ">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent className="my-7">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="username"
                            {...field}
                            type="string"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <br />
              <div className="w-full flex justify-between ">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Login</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Form>
    </section>
  );
}
