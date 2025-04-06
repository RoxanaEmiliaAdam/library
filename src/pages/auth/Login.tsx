import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { logIn } from "./loginService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => logIn({ email, password }),
    onSuccess: (user) => {
      console.log(user);

      if (user) {
        console.log(user);
        localStorage.setItem("userEmail", JSON.stringify(user.email)); // store user info
        navigate(
          user.email === "admin@bookly.com"
            ? "/admin/dashboard"
            : "/user/dashboard"
        );
      } else {
        setError("Invalid email or password");
      }
    },
    onError: () => {
      setError("Failed to login.try again");
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Ensures the email field is not empty before submission
            className="mb-3"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
          />

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={!email || !password}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
