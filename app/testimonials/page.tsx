"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowRight, CheckCircle2, MessageSquare } from "lucide-react"
import { submitTestimonial } from "./actions"
import { useTestimonials } from "../providers/testimonials-provider"

export default function TestimonialsPage() {
  const { testimonials, loading, refreshTestimonials } = useTestimonials()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    achievement: "",
    comment: "",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    improvementOption: "nothing_great",
    otherImprovementFeedback: "",
  })
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState("")
  const [newTestimonial, setNewTestimonial] = useState(null)

  // Load user email from localStorage on component mount
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    if (userEmail) {
      setFormData((prev) => ({ ...prev, email: userEmail }))
    }
  }, [])

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    let timer
    if (submitted) {
      timer = setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
        setFormData({
          firstName: "",
          lastName: "",
          email: localStorage.getItem("userEmail") || "",
          achievement: "",
          comment: "",
          rating: 5,
          imageUrl: "/placeholder.svg?height=80&width=80",
          improvementOption: "nothing_great",
          otherImprovementFeedback: "",
        })
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [submitted])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setError("")

    try {
      // Create FormData object
      const formDataObj = new FormData()

      // Add all form fields
      formDataObj.append("firstName", formData.firstName)
      formDataObj.append("lastName", formData.lastName)
      formDataObj.append("email", formData.email)
      formDataObj.append("achievement", formData.achievement)
      formDataObj.append("comment", formData.comment)
      formDataObj.append("rating", formData.rating.toString())
      formDataObj.append("imageUrl", formData.imageUrl)

      // Combine improvement feedback
      let improvementFeedback = formData.improvementOption
      if (formData.improvementOption === "other" && formData.otherImprovementFeedback) {
        improvementFeedback += `: ${formData.otherImprovementFeedback}`
      }
      formDataObj.append("improvementFeedback", improvementFeedback)

      // Save user email to localStorage
      if (formData.email) {
        localStorage.setItem("userEmail", formData.email)
      }

      // Submit the form
      const result = await submitTestimonial(formDataObj)

      if (result.success) {
        setSubmitted(true)
        // Store the newly submitted testimonial to display it
        if (result.testimonial && result.testimonial.rating > 3) {
          setNewTestimonial(result.testimonial)
        }

        // Refresh the testimonials list to include the new one
        await refreshTestimonials(formData.email)
      } else {
        setError(result.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  // Helper function to format name display as "FirstName L."
  const formatDisplayName = (firstName, lastName) => {
    if (!firstName) return "Anonymous"
    if (!lastName) return firstName
    return `${firstName} ${lastName.charAt(0).toUpperCase()}.`
  }

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-run-dark">Success Stories</h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            See how our runners have achieved their goals and transformed their running
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          {!showForm && !submitted ? (
            <div className="text-center mb-12">
              <Button variant="orange" size="lg" className="flex items-center gap-2" onClick={() => setShowForm(true)}>
                <MessageSquare className="h-5 w-5" />
                Share Your Success Story
              </Button>
            </div>
          ) : submitted ? (
            <Card className="duolingo-card mb-12 bg-run-green/10 border-run-green">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="bg-run-green text-white p-4 rounded-full mb-4">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-run-dark">Thank You!</h2>
                <p className="mb-6 text-gray-600">
                  Your testimonial has been submitted successfully and will be reviewed by our team before being
                  published.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="duolingo-card mb-12">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-run-dark">Share Your Success Story</h2>

                {error && (
                  <div className="mb-6 bg-run-red/10 text-run-red p-4 rounded-xl border-2 border-run-red">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-bold text-run-dark">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="duolingo-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-bold text-run-dark">
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="duolingo-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-run-dark">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="duolingo-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="achievement" className="text-sm font-bold text-run-dark">
                      Achievement/Subject *
                    </label>
                    <Input
                      id="achievement"
                      placeholder="e.g., First Marathon, 10K Personal Best"
                      value={formData.achievement}
                      onChange={handleChange}
                      required
                      className="duolingo-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="comment" className="text-sm font-bold text-run-dark">
                      Your Story *
                    </label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience with Runspire..."
                      rows={4}
                      value={formData.comment}
                      onChange={handleChange}
                      required
                      className="duolingo-input resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="imageUrl" className="text-sm font-bold text-run-dark">
                      Profile Photo URL (optional)
                    </label>
                    <Input
                      id="imageUrl"
                      placeholder="Enter image URL or leave default"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="duolingo-input"
                    />
                    <p className="text-xs text-gray-500">Leave blank to use default avatar</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-run-dark">Rating *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none bg-white p-2 rounded-xl border-2 border-gray-200 hover:bg-gray-50"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= formData.rating ? "fill-run-yellow text-run-yellow" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Improvement Feedback Section - Not displayed publicly */}
                  <div className="space-y-4 border-t-2 border-gray-100 pt-6 mt-6">
                    <h3 className="font-bold text-run-dark">Help Us Improve</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This feedback will only be visible to our coaches to help us improve our services.
                    </p>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-run-dark">What could we have done better?</label>
                      <Select
                        value={formData.improvementOption}
                        onValueChange={(value) => handleSelectChange("improvementOption", value)}
                        defaultValue="nothing_great"
                      >
                        <SelectTrigger className="duolingo-input">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nothing_great">Nothing, everything was great</SelectItem>
                          <SelectItem value="more_personalization">More personalized training</SelectItem>
                          <SelectItem value="better_communication">Better communication</SelectItem>
                          <SelectItem value="more_resources">More training resources</SelectItem>
                          <SelectItem value="better_app">Improved app/website experience</SelectItem>
                          <SelectItem value="more_feedback">More feedback on my progress</SelectItem>
                          <SelectItem value="other">Other (please specify)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.improvementOption === "other" && (
                      <div className="space-y-2">
                        <label htmlFor="otherImprovementFeedback" className="text-sm font-bold text-run-dark">
                          Please specify
                        </label>
                        <Textarea
                          id="otherImprovementFeedback"
                          placeholder="Tell us what we could improve..."
                          rows={2}
                          value={formData.otherImprovementFeedback}
                          onChange={handleChange}
                          className="duolingo-input resize-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-2 border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="orange" disabled={formLoading} className="flex-1">
                      {formLoading ? "Submitting..." : "Submit Your Story"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {/* Show newly submitted testimonial first if it exists and has rating > 3 */}
            {newTestimonial && newTestimonial.rating > 3 && (
              <div className="md:col-span-2">
                <TestimonialCard
                  key={newTestimonial.id}
                  name={formatDisplayName(newTestimonial.first_name, newTestimonial.last_name)}
                  achievement={newTestimonial.achievement}
                  quote={newTestimonial.comment}
                  rating={newTestimonial.rating}
                  imageSrc={newTestimonial.image_url}
                  isNew={true}
                />
              </div>
            )}

            {/* Demo testimonials - temporary examples */}
            <TestimonialCard
              name="Sarah M."
              achievement="First 5K Completion"
              quote="I never thought I could run a full 5K without stopping, but with the personalized training plan and weekly check-ins, I crossed that finish line with a huge smile! The gradual build-up approach made it feel achievable every step of the way."
              rating={5}
              imageSrc="/placeholder.svg?height=80&width=80&text=SM"
            />
            <TestimonialCard
              name="David K."
              achievement="Marathon PR - 3:45"
              quote="After years of hitting a plateau around 4:10, the structured speed work and nutrition guidance helped me break through. Shaved 25 minutes off my marathon time and felt strong the entire race. The mental training techniques were game-changers!"
              rating={5}
              imageSrc="/placeholder.svg?height=80&width=80&text=DK"
            />
            <TestimonialCard
              name="Emma R."
              achievement="Return from Injury"
              quote="Coming back from a stress fracture was scary, but the careful progression plan and focus on form helped me return stronger than ever. Now I'm running pain-free and just completed my first half marathon since the injury. So grateful for the patient, expert guidance!"
              rating={5}
              imageSrc="/placeholder.svg?height=80&width=80&text=ER"
            />

            {/* Show approved testimonials from database */}
            {loading ? (
              <div className="md:col-span-2 text-center p-8 duolingo-card">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-run-blue mx-auto"></div>
                <p className="mt-6 text-gray-600 font-bold">Loading testimonials...</p>
              </div>
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={formatDisplayName(testimonial.first_name, testimonial.last_name)}
                  achievement={testimonial.achievement}
                  quote={testimonial.comment}
                  rating={testimonial.rating}
                  imageSrc={testimonial.image_url}
                  status={testimonial.status}
                />
              ))
            ) : (
              <div className="md:col-span-2 text-center p-8 duolingo-card">
                <p className="text-gray-600 font-bold">No testimonials found.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button variant="purple" size="lg" className="flex items-center gap-2" asChild>
              <Link href="/custom-coaching">
                Get personalized coaching
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ name, achievement, quote, rating, imageSrc, isNew = false, status }) {
  // Check if imageSrc is a real image URL (not placeholder or empty)
  const hasRealImage =
    imageSrc &&
    !imageSrc.includes("/placeholder.svg") &&
    !imageSrc.includes("placeholder") &&
    imageSrc.trim() !== "" &&
    imageSrc !== "/placeholder.svg?height=80&width=80"

  return (
    <div className={`duolingo-card p-6 ${isNew ? "border-run-yellow border-4" : ""}`}>
      {isNew && (
        <div className="mb-4 -mt-2 -ml-2 px-4 py-2 bg-run-yellow text-run-dark text-sm font-bold rounded-br-xl rounded-tl-xl inline-block">
          Your Story
        </div>
      )}
      {status === "pending" && (
        <div className="mb-4 float-right px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">
          Pending Review
        </div>
      )}
      <div className="mb-6 flex items-center">
        {hasRealImage && (
          <div className="relative mr-4">
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={name}
              className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <div className="bg-run-blue text-white p-1 rounded-full">
                <Star className="h-4 w-4 fill-white" />
              </div>
            </div>
          </div>
        )}
        <div>
          <h3 className="text-xl font-extrabold text-run-dark">{name}</h3>
          <p className="text-gray-600">{achievement}</p>
          <div className="mt-2 flex">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-run-yellow text-run-yellow" />
            ))}
          </div>
        </div>
      </div>
      <blockquote className="bg-gray-50 p-4 rounded-xl border-l-4 border-run-blue italic text-gray-600">
        "{quote}"
      </blockquote>
    </div>
  )
}
