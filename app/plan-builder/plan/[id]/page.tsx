"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Calendar, Clock, Target, Zap, MessageCircle } from "lucide-react"
import { trainingPlans } from "@/lib/data"

export default function PlanDetailPage() {
  const params = useParams()
  const [plan, setPlan] = useState(null)

  useEffect(() => {
    const planId = params.id as string
    const foundPlan = trainingPlans.find((p) => p.id === planId)
    setPlan(foundPlan || null)
  }, [params.id])

  if (!plan) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan not found</h1>
          <Link href="/plan-builder">
            <Button>Back to Plan Builder</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/plan-builder">
          <Button variant="ghost" className="mb-8">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
        </Link>

        <div className="mx-auto max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold text-primary mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-lg">{plan.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {plan.duration}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold">Goal</p>
                    <p className="text-sm text-muted-foreground">{plan.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-sm text-muted-foreground">{plan.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold">Level</p>
                    <p className="text-sm text-muted-foreground">{plan.level}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">What's Included</h3>
                <ul className="grid gap-2 md:grid-cols-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-600 rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Sample Week</h3>
                <div className="grid gap-3">
                  {plan.sampleWeek.map((day, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-sm">{day.workout}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-green-100 p-6">
                <h3 className="mb-4 text-xl font-bold">Ready to Start Your Journey?</h3>
                <p className="mb-6 text-gray-700">
                  This plan is customized based on your current fitness level and will gradually build your endurance
                  and speed to help you reach your {plan.goal.toLowerCase()} goal.
                </p>

                <div className="space-y-3">
                  <Link href="/book">
                    <Button className="w-full" size="lg">
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Free 20-min Consult to Finalize Plan
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    Request Plan and Pay Later (₪150)
                  </Button>

                  <a
                    href="https://wa.me/972586690059?text=Hi%20there!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contact via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
