import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Unlink as Running, Heart, Brain, Award, ArrowRight } from "lucide-react"

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">Running Knowledge Hub</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Everything you need to know about effective running training
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <InfoCard
            title="Training Fundamentals"
            icon={<Running className="h-8 w-8 text-blue-600" />}
            color="bg-white hover:bg-blue-50 transition-colors duration-200"
          >
            <p>Learn the core principles of effective running training, including:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Building your aerobic base</li>
              <li>Proper running form</li>
              <li>Progressive overload</li>
              <li>Recovery strategies</li>
            </ul>
          </InfoCard>

          <InfoCard
            title="Nutrition & Hydration"
            icon={<Heart className="h-8 w-8 text-red-600" />}
            color="bg-white hover:bg-red-50 transition-colors duration-200"
          >
            <p>Discover how to fuel your runs and recover properly:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Pre-run nutrition strategies</li>
              <li>Hydration guidelines</li>
              <li>Post-run recovery nutrition</li>
              <li>Race day fueling</li>
            </ul>
          </InfoCard>

          <InfoCard
            title="Mental Training"
            icon={<Brain className="h-8 w-8 text-purple-600" />}
            color="bg-white hover:bg-purple-50 transition-colors duration-200"
          >
            <p>Strengthen your mental game with these techniques:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Goal setting strategies</li>
              <li>Visualization techniques</li>
              <li>Managing race anxiety</li>
              <li>Building mental toughness</li>
            </ul>
          </InfoCard>

          <InfoCard
            title="Race Strategies"
            icon={<Award className="h-8 w-8 text-yellow-600" />}
            color="bg-white hover:bg-yellow-50 transition-colors duration-200"
          >
            <p>Prepare for race day success with these tips:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Tapering properly</li>
              <li>Pacing strategies</li>
              <li>Course tactics</li>
              <li>Post-race recovery</li>
            </ul>
          </InfoCard>
        </div>

        <div className="mt-12 text-center">
          <Link href="/start">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              Ready to build your training plan?
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, icon, color, children }) {
  return (
    <div className={`rounded-xl p-6 shadow-md ${color}`}>
      <div className="mb-4 flex items-center">
        {icon}
        <h2 className="ml-2 text-2xl font-bold">{title}</h2>
      </div>
      <div className="text-muted-foreground">{children}</div>
      <div className="mt-4 flex items-center text-gray-400">
        <span className="mr-2 text-sm font-medium">Coming Soon</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  )
}
