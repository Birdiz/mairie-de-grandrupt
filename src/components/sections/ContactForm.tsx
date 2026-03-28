"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitState("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSubmitState("success");
      form.reset();
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800"
      >
        <h2 className="text-lg font-semibold">{t("successTitle")}</h2>
        <p className="mt-1 text-sm">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        {submitState === "error" && (
          <div
            role="alert"
            aria-live="assertive"
            className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm"
          >
            <strong>{t("errorTitle")} : </strong>
            {t("errorMessage")}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("name")}
                <span aria-hidden="true" className="text-destructive ml-1">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} autoComplete="name" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("email")}
                <span aria-hidden="true" className="text-destructive ml-1">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("subject")}
                <span aria-hidden="true" className="text-destructive ml-1">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t("subjectPlaceholder")} required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("message")}
                <span aria-hidden="true" className="text-destructive ml-1">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("messagePlaceholder")}
                  rows={6}
                  className="resize-y"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            disabled={submitState === "submitting"}
            className="w-full sm:w-auto"
          >
            {submitState === "submitting" ? t("submitting") : t("submit")}
          </Button>
          <p className="text-muted-foreground text-xs" aria-hidden="true">
            {t("requiredFields")}
          </p>
        </div>
      </form>
    </Form>
  );
}
