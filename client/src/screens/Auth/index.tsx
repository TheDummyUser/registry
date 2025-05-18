import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import { login } from "@/services/Auth.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/context/Auth.context";
import { toast } from "@/components/ui/sonner";
import { InputComponent } from "@/components/custom/Input.custom";

export function Auth({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: authLogin } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      login(data.email, data.password),
    onSuccess: (userData) => {
      // Handle successful login, e.g., redirect
      console.log(userData);
      console.log("Login successful");
      if (userData?.details) {
        toast(userData?.message);
        authLogin(userData.details);
        navigate("/user/home");
      }
    },
    onError: (error) => {
      // Handle login errors
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center h-screen",
        className,
      )}
      {...props}
    >
      <Card className="w-[500px] h-auto flex flex-col justify-around">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <InputComponent
                label="Email"
                placeholder="example@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                error={mutation.error?.message}
                id="email"
              />
              <InputComponent
                label="Password"
                placeholder="********"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                error={mutation?.error?.message}
                id="password"
              />
              <div className="grid gap-2">
                <div className="flex items-center">
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>
              {mutation.error && (
                <p className="text-red-500 text-sm">Invalid credentials</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
