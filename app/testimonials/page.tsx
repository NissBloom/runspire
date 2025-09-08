"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { submitTestimonial } from "./actions"
import { useActionState } from "react"

interface Testimonial {
  id: number
  first_name: string
  last_name: string
  achievement: string
  comment: string
  rating: number
  status: string
  created_at: string
}

// Helper function to format display name as "FirstName L."
const formatDisplayName = (firstName: string, lastName: string): string => {
  if (!firstName || !lastName) return "Anonymous"
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`
}

// Demo testimonials with proper formatting
const demoTestimonials = [
  {
    id: "demo-1",
    name: "Sarah M.",
    achievement: "First Marathon Completion",
    comment:
      "The personalized training plan helped me complete my first marathon in 4:15! The nutrition guidance was especially valuable during those long training runs.",
    rating: 5,
    status: "approved",
  },
  {
    id: "demo-2",
    name: "David K.",
    achievement: "10K Personal Best",
    comment:
      "Improved my 10K time by 3 minutes using the structured interval training. The mental training techniques really helped during race day.",
    rating: 5,
    status: "approved",
  },
  {
    id: "demo-3",
    name: "Maria L.",
    achievement: "Half Marathon Success",
    comment:
      "As a beginner runner, the progressive training approach was perfect. Completed my first half marathon without injury and loved every minute!",
    rating: 5,
    status: "approved",
  },
]

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [state, formAction, isPending] = useActionState(submitTestimonial, null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (state?.success) {
      setShowForm(false)
      fetchTestimonials() // Refresh testimonials after successful submission
    }
  }, [state])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      if (response.ok) {
        const data = await response.json()
        const testimonialData = data.testimonials || data.data || data || []
        console.log("Fetched testimonials:", testimonialData.length)
        setTestimonials(testimonialData)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => setShowForm(false)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Success Stories
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Share Your Success Story</CardTitle>
              <p className="text-center text-gray-600">Help inspire other runners by sharing your achievement</p>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <Input id="firstName" name="firstName" required placeholder="Your first name" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <Input id="lastName" name="lastName" required placeholder="Your last name" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input id="email" name="email" type="email" required placeholder="your.email@example.com" />
                </div>

                <div>
                  <label htmlFor="achievement" className="block text-sm font-medium mb-2">
                    Your Achievement *
                  </label>
                  <Input
                    id="achievement"
                    name="achievement"
                    required
                    placeholder="e.g., First Marathon, 5K Personal Best, etc."
                  />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-2">
                    Your Story *
                  </label>
                  <Textarea
                    id="comment"
                    name="comment"
                    required
                    rows={4}
                    placeholder="Tell us about your running journey and how our coaching helped you achieve your goal..."
                  />
                </div>

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium mb-2">
                    Rating *
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Very Good</option>
                    <option value="3">⭐⭐⭐ Good</option>
                    <option value="2">⭐⭐ Fair</option>
                    <option value="1">⭐ Poor</option>
                  </select>
                </div>

                {state?.error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{state.error}</p>
                  </div>
                )}

                {state?.success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-600 text-sm">
                      Thank you for sharing your success story! It will be reviewed and published soon.
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Your Story"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-xl text-gray-600 mb-8">
            Real achievements from real runners who transformed their performance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Share Your Success Story
            </Button>
            <Link href="/">
              <Button variant="outline" className="px-8 py-3 bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading success stories...</p>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Demo Testimonials */}
            {demoTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {testimonial.achievement}
                      </Badge>
                    </div>
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}

            {/* Database Testimonials */}
            {testimonials
              .filter((t) => t.status === "approved")
              .map((testimonial) => (
                <Card key={testimonial.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {formatDisplayName(testimonial.first_name, testimonial.last_name)}
                        </h3>
                        <Badge variant="secondary" className="mt-1">
                          {testimonial.achievement}
                        </Badge>
                      </div>
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Be the first to share your success story!</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Share Your Story
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
