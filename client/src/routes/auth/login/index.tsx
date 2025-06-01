import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/services/auth.service";
import React, { useState } from "react"; // Import useState
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store";
import { setAuthUser } from "@/redux/slices/auth.slice";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginMutation, { error, isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    try {
      // Call the login mutation with email and password
      loginMutation({ email, password })
        .unwrap()
        .then(
          (res) => (
            toast.success(res.message),
            dispatch(
              setAuthUser({ user: res.details, tokens: res.details?.tokens }),
            ),
            navigate({ to: "/app/Home", replace: true })
          ),
        );
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {" "}
            {/* Add onSubmit handler */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  required
                  value={email} // Bind value to state
                  onChange={(e) => setEmail(e.target.value)} // Update state on change
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="**********"
                  value={password} // Bind value to state
                  onChange={(e) => setPassword(e.target.value)} // Update state on change
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {" "}
                  {/* Disable button while loading */}
                  {isLoading ? "Logging in..." : "Login"}{" "}
                  {/* Optional loading text */}
                </Button>
              </div>
              {/* Display error message if there is an error */}
              {error && (
                <div className="text-red-500 text-center">
                  {/* Assuming error object has data.message or similar */}
                  {/* You might need to inspect the actual error structure */}
                  {error.data?.message || error.message || "An error occurred."}
                </div>
              )}
              <Link
                to="/auth/forgotpassword"
                className="flex justify-end cursor-pointer"
              >
                <Button variant="link" className="cursor-pointer">
                  Forgot Password?
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
