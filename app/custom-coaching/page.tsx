"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, CheckCircle2, BookOpen, CalendarIcon } from "lucide-react"
import { submitCoachingRequest } from "./actions"

export default function CustomCoachingPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    package: "base",
    goal: "",
    experience: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState("base")

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId)
    setFormData((prev) => ({ ...prev, package: packageId }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create FormData object
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Submit the form
      const result = await submitCoachingRequest(formDataObj)

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">Personal Coaching</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Work directly with our expert coaches for a fully customized experience
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Why Choose Personal Coaching?</h2>

            <div className="space-y-4">
              <BenefitItem title="Personalized Attention">
                Get a training plan designed specifically for your goals, strengths, and limitations
              </BenefitItem>

              <BenefitItem title="Data-Driven Insights">
                Benefit from advanced analytics and performance metrics interpreted by experienced sports data analysts
              </BenefitItem>

              <BenefitItem title="Ongoing Adjustments">
                Your plan evolves as you progress, adapting to your changing needs
              </BenefitItem>

              <BenefitItem title="Accountability">
                Regular check-ins keep you motivated and on track to reach your goals
              </BenefitItem>

              <BenefitItem title="Performance Optimization">
                Leverage data analytics to identify improvement opportunities and optimize your training efficiency
              </BenefitItem>
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Coaching Packages</h3>
                <span className="text-sm text-red-600 font-bold">🔥 Opening Deals – Don't Miss Out</span>
              </div>

              <div className="space-y-4">
                <div
                  className={`rounded-lg border p-4 transition-all cursor-pointer ${
                    selectedPackage === "base"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-500 hover:bg-green-50"
                  }`}
                  onClick={() => handlePackageSelect("base")}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-green-700">🟢 Base Package</h4>
                    <span className="font-bold">₪200/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Perfect for runners who want structure without heavy check-ins
                  </p>
                  <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                    <li>Personalized training plan tailored to your goals & schedule</li>
                    <li>Monthly 20-minute call for plan updates and adjustments</li>
                    <li>Weekly WhatsApp/email communication to review progress and stay on track</li>
                  </ul>
                </div>

                <div
                  className={`rounded-lg border p-4 transition-all cursor-pointer ${
                    selectedPackage === "performance"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                  onClick={() => handlePackageSelect("performance")}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-blue-700">🔵 Performance Package</h4>
                    <span className="font-bold">₪350/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Ideal for runners who want close guidance and accountability
                  </p>
                  <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                    <li>Everything in Base, plus:</li>
                    <li>20-minute calls every 2 weeks for ongoing support</li>
                    <li>Full post-workout analysis (pace, HR, effort, Strava/Garmin uploads)</li>
                    <li>Weekly training plan adjustments based on your latest data</li>
                    <li>Frequent communication for motivation, accountability, and quick answers</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-700">⚪ Optional Add-On: 1:1 In-Person Coaching</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Take your training to the next level with a hands-on session:
                  </p>
                  <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                    <li>20-minute in-person session</li>
                    <li>Running fitness & technique assessment</li>
                    <li>Live recording + post-session video analysis</li>
                    <li>Personalized drills to improve form, efficiency, and speed</li>
                    <li>Tailored feedback you can apply immediately in your training</li>
                  </ul>
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                  📌 All packages require a minimum 2-month commitment.
                </div>
              </div>
            </div>
          </div>

          <div>
            {!submitted ? (
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-6 text-2xl font-bold">Get Started Today</h2>

                  {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">{error}</div>}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">
                          First Name *
                        </label>
                        <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">
                          Last Name *
                        </label>
                        <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="package" className="text-sm font-medium">
                        Coaching Package *
                      </label>
                      <Select value={formData.package} onValueChange={(value) => handleSelectChange("package", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="base">Base Package (₪200/month)</SelectItem>
                          <SelectItem value="performance">Performance Package (₪350/month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="goal" className="text-sm font-medium">
                        Your Running Goal *
                      </label>
                      <Select onValueChange={(value) => handleSelectChange("goal", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5k">Improve 5K time</SelectItem>
                          <SelectItem value="10k">Train for 10K</SelectItem>
                          <SelectItem value="half">Complete Half Marathon</SelectItem>
                          <SelectItem value="full">Finish Marathon</SelectItem>
                          <SelectItem value="ultra">Ultra Marathon</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="experience" className="text-sm font-medium">
                        Running Experience *
                      </label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about your running history, previous races, and any injuries"
                        rows={4}
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                      {loading ? "Submitting..." : "Request Coaching"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
                  <h2 className="mb-2 text-2xl font-bold">Request Submitted!</h2>
                  <p className="mb-6 text-muted-foreground">
                    Thank you for your interest in personal coaching with Runspire. Our coaches are reviewing your
                    information and will contact you within 24 hours to discuss your goals and create a personalized
                    plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 bg-transparent"
                      onClick={() => (window.location.href = "/info")}
                    >
                      <BookOpen className="h-4 w-4" />
                      Learn More
                    </Button>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                      onClick={() => window.open("https://calendly.com/nissbloom/30min", "_blank")}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Schedule Initial Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BenefitItem({ title, children }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="mb-2 font-bold text-purple-700">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  )
}
