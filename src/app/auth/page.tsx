"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { singUp } from "@/services/auth";

const AuthPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await singUp(credentials.username, credentials.password);

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        document.cookie = `access_token=${data.access_token}; path=/; secure; samesite=strict`;
        window.location.href = "/";
      } else {
        throw new Error("No se recibió el token de acceso");
      }
    } catch (err: any) {
      setError(err.message || "Error durante la autenticación");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    return (
      isValidEmail(credentials.username) && credentials.password.length > 0
    );
  };

  // El resto del código permanece igual...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-invoice-50 to-invoice-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-invoice-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-invoice-600">
            {isSignUp
              ? "Enter your details to create your account"
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-danger-50 border-danger-200"
              >
                <AlertCircle className="h-4 w-4 text-danger-500" />
                <AlertDescription className="text-danger-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-invoice-800">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="email"
                  placeholder="your.email@example.com"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className={`border-invoice-200 focus:border-invoice-500 focus:ring-invoice-500
                    ${
                      !credentials.username
                        ? ""
                        : isValidEmail(credentials.username)
                        ? "border-success-500"
                        : "border-danger-500"
                    }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-invoice-800">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="pr-10 border-invoice-200 focus:border-invoice-500 focus:ring-invoice-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-invoice-400 hover:text-invoice-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-invoice-600 hover:bg-invoice-700 text-white"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
