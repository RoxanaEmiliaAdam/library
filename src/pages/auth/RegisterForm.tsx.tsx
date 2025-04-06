import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser } from "@/postService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: addUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSuccess("User registered successfully!");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        console.log("✅ Navigating to /user/dashboard...");
        navigate("/user/dashboard");
      }, 2000);
    },
    onError: () => {
      setError("Failed to register user");
    },
  });
  const handleRegister = () => {
    if (!email || !password) {
      setError("Email is required");
      return;
    }
    mutation.mutate({ email, password });
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Register</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-3"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-3"
          />
          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
