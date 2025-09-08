"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ArrowRight, Calendar, Clock, Zap, CheckCircle2, BookOpen, CalendarIcon } from "lucide-react"
import { saveTrainingPlan } from "./actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { coachingPackages } from "@/lib/data"

export default function PlanBuilderPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    goal: "5k",
    experience: "beginner",
    daysPerWeek: 3,
    currentMileage: 15,
    raceDistance: "",
    personalBest: "",
  })

  const [showBundleDialog, setShowBundleDialog] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [planId, setPlanId] = useState("")

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleRadioChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSliderChange = (field, value) => {
    setFormData({ ...formData, [field]: value[0] })
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSelectChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Create FormData object
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value.toString())
      })

      // Add the selected bundle and CTA
      formDataObj.append("bundle", selectedBundle)
      formDataObj.append("cta", "request_plan")

      // Submit the form
      const result = await saveTrainingPlan(formDataObj)

      if (result.success) {
        // Show confirmation dialog instead of navigating immediately
        setPlanId(result.planId)
        setShowBundleDialog(false)
        setShowConfirmation(true)
      } else {
        alert(result.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isIntermediateOrAdvanced = formData.experience === "intermediate" || formData.experience === "advanced"

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">Build Your Training Plan</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Create a customized running plan in just a few steps
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex justify-between">
            <StepIndicator number={1} active={step >= 1} label="Goal" />
            <StepIndicator number={2} active={step >= 2} label="Experience" />
            <StepIndicator number={3} active={step >= 3} label="Schedule" />
            <StepIndicator number={4} active={step >= 4} label="Plan" />
          </div>

          <Card>
            <CardContent className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">What's your running goal?</h2>
                  <RadioGroup defaultValue={formData.goal} onValueChange={(value) => handleRadioChange("goal", value)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <GoalOption
                        value="5k"
                        title="5K Race"
                        description="Build speed for a 5K race"
                        checked={formData.goal === "5k"}
                      />
                      <GoalOption
                        value="10k"
                        title="10K Race"
                        description="Train for a 10K race"
                        checked={formData.goal === "10k"}
                      />
                      <GoalOption
                        value="half"
                        title="Half Marathon"
                        description="Prepare for 13.1 Kms"
                        checked={formData.goal === "half"}
                      />
                      <GoalOption
                        value="full"
                        title="Marathon"
                        description="Get ready for 26.2 Kms"
                        checked={formData.goal === "full"}
                      />
                    </div>
                  </RadioGroup>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">What's your experience level?</h2>
                  <RadioGroup
                    defaultValue={formData.experience}
                    onValueChange={(value) => handleRadioChange("experience", value)}
                  >
                    <div className="grid gap-4">
                      <ExperienceOption
                        value="beginner"
                        title="Beginner"
                        description="New to running or returning after a long break"
                        checked={formData.experience === "beginner"}
                      />
                      <ExperienceOption
                        value="intermediate"
                        title="Intermediate"
                        description="Running consistently for 6+ months"
                        checked={formData.experience === "intermediate"}
                      />
                      <ExperienceOption
                        value="advanced"
                        title="Advanced"
                        description="Experienced runner looking to improve performance"
                        checked={formData.experience === "advanced"}
                      />
                    </div>
                  </RadioGroup>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Let's customize your schedule</h2>

                  <div className="space-y-4">
                    <Label>How many days per week can you run?</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        defaultValue={[formData.daysPerWeek]}
                        max={7}
                        min={2}
                        step={1}
                        onValueChange={(value) => handleSliderChange("daysPerWeek", value)}
                      />
                      <span className="w-10 text-center font-bold">{formData.daysPerWeek}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Current weekly distance (Kms)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        defaultValue={[formData.currentMileage]}
                        max={160}
                        min={0}
                        step={5}
                        onValueChange={(value) => handleSliderChange("currentMileage", value)}
                      />
                      <span className="w-10 text-center font-bold">{formData.currentMileage}</span>
                    </div>
                  </div>

                  {isIntermediateOrAdvanced && (
                    <>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-4">
                          This will help us build the correct plan for your experience level.
                        </p>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="raceDistance">Race Distance</Label>
                            <Select
                              value={formData.raceDistance}
                              onValueChange={(value) => handleSelectChange("raceDistance", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select your race distance" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5k">5K</SelectItem>
                                <SelectItem value="10k">10K</SelectItem>
                                <SelectItem value="half">Half Marathon</SelectItem>
                                <SelectItem value="full">Marathon</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="personalBest">Personal Best (optional)</Label>
                            <Input
                              id="personalBest"
                              placeholder="e.g., 25:30 for 5K"
                              value={formData.personalBest}
                              onChange={(e) => handleInputChange("personalBest", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t">
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Your Personalized Plan</h2>

                  <div className="rounded-lg bg-green-100 p-4">
                    <h3 className="mb-2 text-xl font-bold">
                      {formData.goal === "5k"
                        ? "5K"
                        : formData.goal === "10k"
                          ? "10K"
                          : formData.goal === "half"
                            ? "Half Marathon"
                            : "Marathon"}{" "}
                      Training Plan
                    </h3>

                    <div className="mb-4 grid gap-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-green-700" />
                        <span>
                          {formData.goal === "5k"
                            ? "8"
                            : formData.goal === "10k"
                              ? "10"
                              : formData.goal === "half"
                                ? "12"
                                : "16"}{" "}
                          weeks of training
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-green-700" />
                        <span>{formData.daysPerWeek} runs per week</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="mr-2 h-4 w-4 text-green-700" />
                        <span>
                          {formData.experience === "beginner"
                            ? "Beginner"
                            : formData.experience === "intermediate"
                              ? "Intermediate"
                              : "Advanced"}{" "}
                          intensity level
                        </span>
                      </div>
                    </div>

                    <p className="mb-4">
                      This plan is customized based on your current {formData.currentMileage} Kms per week and will
                      gradually build your endurance and speed to help you reach your goal.
                    </p>

                    <div className="flex justify-center">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setShowBundleDialog(true)}
                        disabled={loading}
                      >
                        Request Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? <Button onClick={handleNext}>Continue</Button> : <div></div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bundle Selection Dialog */}
      <Dialog open={showBundleDialog} onOpenChange={setShowBundleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Choose Your Plan Bundle</DialogTitle>
            <DialogDescription>Select the coaching bundle that best fits your needs</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {Object.values(coachingPackages).map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-lg border p-4 cursor-pointer transition-all ${
                  selectedBundle === pkg.id
                    ? "border-run-green bg-run-green/10"
                    : "border-gray-200 hover:border-run-blue hover:bg-blue-50"
                }`}
                onClick={() => setSelectedBundle(pkg.id)}
              >
                <div className="flex justify-between">
                  <h4 className="font-bold">{pkg.name}</h4>
                  <span className="font-bold">{pkg.price}</span>
                </div>
                <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => setShowBundleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !selectedBundle} className="bg-run-green text-white">
              {loading ? "Processing..." : "Confirm Selection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Thank You!</DialogTitle>
            <DialogDescription className="text-center mb-6">
              Our coaches are now reviewing your information and building your personalized training plan. We'll be in
              touch soon to discuss the details and finalize your coaching package.
            </DialogDescription>

            <p className="text-sm text-gray-600 mb-6">
              We'll contact you via email at {formData.email} within 24-48 hours, or you can schedule an initial
              consultation right now.
            </p>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-transparent"
                onClick={() => {
                  setShowConfirmation(false)
                  router.push("/info")
                }}
              >
                <BookOpen className="h-4 w-4" />
                Learn More
              </Button>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                onClick={() => window.open("https://calendly.com/nissbloom/30min", "_blank")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Initial Call
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StepIndicator({ number, active, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          active ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        {number}
      </div>
      <span className="mt-2 text-sm">{label}</span>
    </div>
  )
}

function GoalOption({ value, title, description, checked }) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={`goal-${value}`} className="peer sr-only" />
      <Label
        htmlFor={`goal-${value}`}
        className={`flex cursor-pointer flex-col rounded-lg border p-4 hover:bg-green-50 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50`}
      >
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </Label>
    </div>
  )
}

function ExperienceOption({ value, title, description, checked }) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={`experience-${value}`} className="peer sr-only" />
      <Label
        htmlFor={`experience-${value}`}
        className={`flex cursor-pointer flex-col rounded-lg border p-4 hover:bg-green-50 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50`}
      >
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </Label>
    </div>
  )
}
