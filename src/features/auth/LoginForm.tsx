import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type Values = z.infer<typeof schema>;

export default function LoginForm() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    const user = await authService.login(values.email, values.password);
    setUser(user);
    setSubmitting(false);
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} className="rounded-md" />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} className="rounded-md" />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="w-full rounded-full">
        {submitting ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-sm text-muted-foreground text-center">
        New here?{" "}
        <Link to="/register" className="font-semibold text-foreground hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
