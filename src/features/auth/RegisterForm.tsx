import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { tokenManager } from "@/lib/auth/tokenManager";

import { toast } from "@/hooks/use-toast";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/types/auth/authSchema";

export default function RegisterForm() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setSubmitting(true);

    try {
      const res = await authService.register({
        username: values.username,
        email: values.email,
        password: values.password,
        displayName: values.displayName ?? values.username,
      });

      setUser(res.user);

      if (res.accessToken) {
        tokenManager.setAccessToken(res.accessToken);
      }

      navigate("/register");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Register failed";

      toast({
        title: "Register error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} />
        {errors.username && (
          <p className="text-xs text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="displayName">Display name</Label>
        <Input id="displayName" {...register("displayName")} />
        {errors.displayName && (
          <p className="text-xs text-destructive">
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input id="confirm" type="password" {...register("confirm")} />
        {errors.confirm && (
          <p className="text-xs text-destructive">
            {errors.confirm.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full hover:opacity-90 transition"
      >
        {submitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-sm text-center">
        Already have account?{" "}
        <Link to="/login" className="font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}