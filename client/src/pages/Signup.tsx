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
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Input } from "../components/ui/input";
import { Errors, UserRegister } from "../types/user";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseApi } from "../lib/baseapi";
import { useState } from "react";
import Loading from "../components/Loading";

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
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<Errors>();

  const form = useForm({
    resolver: zodResolver(formSchema), // Don't forget to uncomment the zodResolver import
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  // Define onSubmit handler
  const onSubmit = async (data: UserRegister) => {
    console.log(data);
    setLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);

    await axios
      .post(`${baseApi}/user-registration`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((reponse) => {
        console.log("gagan", reponse.data.message);
        form.reset();

        navigate("/dashboard");
        setLoading(false);
      })
      .catch((error) => {
        console.log("dflkjsdf", error?.response?.data?.message);
        setError(error.response.data);
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <section className=" flex items-center justify-center">
      <Form {...form}>
        <Card className="w-[350px] my-28">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Registration</CardTitle>
          </CardHeader>
          <CardContent>
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
                            placeholder="Username"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} type="email" />
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
                            placeholder="Password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error?.success ? (
                  ""
                ) : (
                  <p className="w-full text-red-500 text-[12px]">
                    {error?.message}
                  </p>
                )}
              </div>
              <br />
              <div className="w-full flex items-center justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit">Signup</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
          {/* <br /> */}
          <CardFooter>
            <p className="text-center w-full">
              Already have an account?{" "}
              <Link to={"/login"} className=" text-sky-500">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Form>
    </section>
  );
}
