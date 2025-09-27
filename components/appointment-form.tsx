"use client"

import type * as React from "react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type FormState = {
  repName: string
  companyName: string
  email: string
  phone: string
  date: string
}

export default function AppointmentForm() {
  const [form, setForm] = useState<FormState>({
    repName: "",
    companyName: "",
    email: "",
    phone: "",
    date: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }
  }

  function validateClient(state: FormState) {
    if (!state.repName.trim()) return "Rep Name is required."
    if (!state.companyName.trim()) return "Company Name is required."
    if (!state.email.trim()) return "Email is required."
    // simple email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) return "Please enter a valid email."
    if (!state.phone.trim()) return "Phone Number is required."
    // phone digits check (allow +, spaces, dashes, parentheses)
    if (!/^[0-9]+$/.test(state.phone)) return "Phone Number must be numeric."
    if (!state.date) return "Date is required."
    return null
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    setSuccess(null)
    setError(null)

    const validationMessage = validateClient(form)
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.")
      }
      setSuccess("Booking confirmed! Check your email.")
      // reset the form after success
      setForm({ repName: "", companyName: "", email: "", phone: "", date: "" })
    } catch (err: any) {
      setError(err.message || "Failed to submit the form.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" aria-live="polite">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="repName">Rep Name</Label>
        <Input
          id="repName"
          name="repName"
          value={form.repName}
          onChange={handleChange("repName")}
          required
          placeholder="Jane Doe"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          value={form.companyName}
          onChange={handleChange("companyName")}
          required
          placeholder="Acme Inc."
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Mail ID</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
          placeholder="name@example.com"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="number"
          value={form.phone}
          onChange={handleChange("phone")}
          required
          placeholder="9876543210"
          inputMode="numeric"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" value={form.date} onChange={handleChange("date")} required />
      </div>

      <Button type="submit" className="mt-2" disabled={loading}>
        {loading ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  )
}
