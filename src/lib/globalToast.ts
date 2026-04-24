import { toast } from "@/hooks/use-toast";

type ToastType = "success" | "error" | "info";

export function globalToast(
  type: ToastType,
  title: string,
  description?: string
) {
  toast({
    title,
    description,
    variant: type === "error" ? "destructive" : "default",
  });
}