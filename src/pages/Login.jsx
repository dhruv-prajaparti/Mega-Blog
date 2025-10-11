// src/pages/LoginPage.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      const errorMessage = err.errors?.[0]?.longMessage || "An unknown error occurred.";
      setError(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  // --- GitHub OAuth Handler ---
  const handleGithubLogin = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <Card className="w-full max-w-sm dark-login-card">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full " >
              Login
            </Button>
          </div>
        </form>
        {error && <p className="text-sm font-medium text-destructive mt-4 text-center">{error}</p>}
      </CardContent>
      <CardFooter className="flex-col gap-3">
       
        <Button variant="outline" className="w-full bg-black" onClick={handleGoogleLogin}>
          <img src="https://i.pinimg.com/originals/68/3d/9a/683d9a1a8150ee8b29bfd25d46804605.png" alt="Google Logo" className="w-5 h-5 mr-2"/>
          Login with Google
        </Button>
        {/* --- GitHub Login Button --- */}
        <Button variant="outline" className="w-full bg-black" onClick={handleGithubLogin} >
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" className="w-5 h-5 mr-2"/>
          Login with GitHub
        </Button>
         <p className="text-xs text-muted-foreground">Don't have an account? <Link to="/sign-up" className="underline underline-offset-4 hover:text-primary">Sign up</Link></p>
      </CardFooter>
    </Card>
  );
}