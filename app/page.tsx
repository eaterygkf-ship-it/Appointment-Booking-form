import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AppointmentForm from "@/components/appointment-form"

export default function Page() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-balance">Book an Appointment</CardTitle>
            <CardDescription className="text-muted-foreground">
              All fields are required. A confirmation email will be sent upon successful booking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
