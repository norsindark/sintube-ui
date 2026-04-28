import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RegisterForm from "@/features/auth/RegisterForm";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Register() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 grid place-items-center px-4 py-10">
        <Card className="w-full max-w-md rounded-xl">
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col items-center gap-2">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
                <Play className="h-6 w-6 fill-current" />
              </span>
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-sm text-muted-foreground">Start watching on YouTube Mini</p>
            </div>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
