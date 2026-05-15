"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Briefcase, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? "Registration failed")
        return
      }

      toast.success("Account created! Signing you in...")

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-12 justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 -left-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">MicroCRM</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Your pipeline,<br />
            <span className="text-indigo-400">finally organized.</span>
          </h2>
          <p className="mt-6 text-slate-400 text-lg leading-relaxed">
            Join freelancers and small agencies who use MicroCRM to track
            contacts, manage deals, and close more clients — without the
            enterprise bloat.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: "Contacts", icon: "👥" },
            { label: "Pipeline", icon: "📊" },
            { label: "Analytics", icon: "📈" },
          ].map((f) => (
            <div
              key={f.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-sm text-slate-300">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - register form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">MicroCRM</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
