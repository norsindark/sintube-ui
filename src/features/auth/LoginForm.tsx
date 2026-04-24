import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { tokenManager } from "@/lib/auth/tokenManager";

import {
  identifySchema,
  verifySchema,
  type IdentifyFormValues,
  type VerifyFormValues,
} from "@/types/auth/authSchema";

export default function LoginForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const identifyData = useAuthStore((s) => s.identifyData);
  const setIdentifyData = useAuthStore((s) => s.setIdentifyData);

  const {
    register: registerIdentify,
    handleSubmit: handleSubmitIdentify,
    control: controlIdentify,
    reset: resetIdentifyForm,
    formState: { errors: errorsIdentify },
  } = useForm<IdentifyFormValues>({
    resolver: zodResolver(identifySchema),
    defaultValues: {
      identifier: "",
    },
  });

  const identifier = useWatch({
    control: controlIdentify,
    name: "identifier",
  });

  const canContinue = (identifier ?? "").trim().length >= 3;

  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    reset: resetVerifyForm,
    formState: { errors: errorsVerify },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (window.location.pathname === "/login") {
      useAuthStore.getState().logout();

      resetIdentifyForm({ identifier: "" });
      resetVerifyForm({ password: "" });
    }
  }, []);

  useEffect(() => {
    if (!identifyData) {
      resetIdentifyForm({ identifier: "" });
      resetVerifyForm({ password: "" });
    } else {
      resetIdentifyForm({
        identifier: identifyData.userInfo.username || "",
      });
    }
  }, [identifyData]);

  function resetIdentifyFlow() {
    setIdentifyData(null);
  }

  async function handleIdentify(values: IdentifyFormValues) {
    const res = await authService.identify({
      identifier: values.identifier,
    });

    tokenManager.setPasswordVerificationToken(
      res.passwordVerificationToken
    );

    setIdentifyData(res);
  }

  async function handleVerify(values: VerifyFormValues) {
    if (!identifyData) return;

    const res = await authService.verifyPassword({
      userId: identifyData.userInfo.id,
      password: values.password,
    });

    tokenManager.setAccessToken(res.accessToken);

    if (res.refreshToken) {
      tokenManager.setRefreshToken(res.refreshToken);
    }

    useAuthStore.getState().setUser(res.user);
    navigate("/");
  }

  async function onSubmitIdentify(values: IdentifyFormValues) {
    setSubmitting(true);
    try {
      await handleIdentify(values);
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmitVerify(values: VerifyFormValues) {
    setSubmitting(true);
    try {
      await handleVerify(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={
          identifyData
            ? handleSubmitVerify(onSubmitVerify)
            : handleSubmitIdentify(onSubmitIdentify)
        }
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label>Username / Email</Label>
          <Input
            {...registerIdentify("identifier")}
            disabled={!!identifyData}
            className="rounded-md"
          />
          {errorsIdentify.identifier && !identifyData && (
            <p className="text-xs text-destructive">
              {errorsIdentify.identifier.message}
            </p>
          )}
        </div>

        {identifyData && (
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input
              type="password"
              autoComplete="current-password"
              {...registerVerify("password")}
              className="rounded-md"
            />
            {errorsVerify.password && (
              <p className="text-xs text-destructive">
                {errorsVerify.password.message}
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting || (!identifyData && !canContinue)}
          className="w-full rounded-full"
        >
          {submitting
            ? identifyData
              ? "Signing in..."
              : "Checking..."
            : identifyData
            ? "Sign in"
            : "Continue"}
        </Button>

        {identifyData && (
          <button
            type="button"
            onClick={resetIdentifyFlow}
            className="text-sm text-muted-foreground underline w-full"
          >
            Change account
          </button>
        )}
      </form>

      <p className="text-sm text-muted-foreground text-center">
        New here?{" "}
        <Link
          to="/register"
          className="font-semibold hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}