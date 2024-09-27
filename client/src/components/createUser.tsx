import * as React from "react";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Errors, User, UserRegistration } from "../types/user";
import axios from "axios";
import { baseApi } from "../lib/baseapi";
import Loading from "./Loading";

const formSchema = z.object({
  username: z.string().min(2, { message: "Too short" }),
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(2, { message: "password must be at least 8 characters" }),
  role: z.string().min(2, { message: "role is required" }),
});

interface CreateUserProps {
  user?: User;
  onAddUser: (newUser: User) => void; // Callback to add the new user
}

export function CreateUser({ user, onAddUser }: CreateUserProps) {
  const [error, setError] = React.useState<Errors>();
  const roles = ["admin", "superUser", "user"];
 const [loading,setLoading]=React.useState(false)
  // Filtering out the current user's role from the selection
  const availableRoles = roles.filter((role) => role !== user?.role);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data: UserRegistration) => {
    setLoading(true)
    console.log(data);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);

    await axios
      .post(`${baseApi}/create-user`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        onAddUser(response?.data?.data);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setError(err?.response?.data);
        setLoading(false)
      });
  };

  if (loading) {
    return <Loading/>;
  }

  return (
    <>
      <Form {...form}>
        <Card className="w-full custom400:w-[350px]">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Create User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
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
                        <Input placeholder="Email" {...field} />
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

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                {availableRoles.map((item) => (
                                  <SelectItem value={item} key={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error?.message && (
                <p className="w-full text-red-500 text-[12px]">
                  {error.message}
                </p>
              )}

              <div className="w-full flex justify-between mt-4">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Form>
    </>
  );
}
