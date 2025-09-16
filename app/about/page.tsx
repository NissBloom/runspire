import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Medal, Award, BookOpen, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-run-dark">About Me</h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">Meet the coach behind Runspire</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/3 bg-run-blue p-8 flex justify-center items-center">
                <img
                  src="/images/coach-profile.jpg"
                  alt="Coach portrait"
                  className="rounded-full border-4 border-white shadow-lg h-64 w-64 object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-run-dark mb-4">Nissan Bloom</h2>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-run-green/10 text-run-green px-3 py-1 rounded-full text-sm font-bold">
                    Marathon Specialist
                  </span>
                  <span className="bg-run-blue/10 text-run-blue px-3 py-1 rounded-full text-sm font-bold">
                    Ultramarathon Finisher
                  </span>
                  <span className="bg-run-purple/10 text-run-purple px-3 py-1 rounded-full text-sm font-bold">
                    Science-Backed
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  I help everyday runners train smarter, stay consistent, and actually enjoy the process. I love helping
                  people get into running and keep running -that's why I do this. From my first 5K to marathons,
                  triathlons, and ultramarathons, running became my daily anchor for mental strength and clarity
                </p>
                <p className="text-gray-600">
                  My coaching philosophy is simple: build training that fits your life, keep most runs truly easy with
                  purposeful hard sessions, and combine smart progression with recovery and technique—so I build a plan
                  you look forward to.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-run-green rounded-full p-3 mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-run-dark">Coaching Approach</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Enjoyment first: You'll stick with what you enjoy—so I build a plan you look forward to
                </li>
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Consistency wins: No single workout makes or breaks you; sustainable habits beat hero days
                </li>
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Easy most days, purposeful hard days: Clear intent on quality sessions; truly easy recovery runs
                </li>
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Recover to get stronger: Sleep, fueling, and deloads are built in
                </li>
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Progressive overload: Step-by-step increases at the right times for safe, steady gains
                </li>
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Technique & breathing: Practical cues to improve economy and reduce injury risk
                </li>
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Science + experience: Evidence-based structure tailored to your goals, schedule, and life
                </li>
                <li className="flex items-start">
                  <span className="text-run-blue mr-2">•</span>
                  Regular feedback and plan adjustments based on your progress
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-run-blue rounded-full p-3 mr-4">
                  <Medal className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-run-dark">My Achievements</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-run-green mr-2">•</span>
                  Multiple marathon completions and several ultramarathons (50–84 km)
                </li>
                <li className="flex items-start">
                  <span className="text-run-green mr-2">•</span>
                  Triathlon experience, up to and including half-Ironman
                </li>
                <li className="flex items-start">
                  <span className="text-run-green mr-2">•</span>
                  Sub-3 marathon finish
                </li>
                <li className="flex items-start">
                  <span className="text-run-green mr-2">•</span>
                  Continuous learning through leading endurance books, courses, and podcasts
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-run-purple rounded-full p-3 mr-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-run-dark">My Story</h3>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                I didn't start out loving running. I learned to love it by seeing how it strengthened my mind and
                life—then proved it through marathons, ultras, and by helping others experience the same shift. That's
                why I coach: to remove the guesswork, offer friendly accountability, and make big goals feel doable.
              </p>
              <p>
                I grew up biking and playing football (soccer) and only ran occasionally. While studying in Israel,
                running became my go-to. I kept showing up, discovered longer distances, and found a simple, sustainable
                approach that fit real life.
              </p>
              <p>
                Along the way I've been learning nonstop - distilling insights from great coaches, athletes, books, and
                podcasts into a practical method. The result is an approach that helps real people feel better, live
                healthier, and perform beyond expectations. When I work with you, I meet you where you are. I replace
                the "go hard every day" myth with smart, sustainable training: mostly easy running, purposeful hard
                sessions, and recovery that lets you adapt. Your plan fits your life, not the other way around.
              </p>
              <p>
                My goals for you are simple: help you enjoy running while chipping away at PRs, and be there when
                motivation dips with guidance and support tailored to you.
              </p>
            </div>
          </div>

          <div className="bg-run-blue text-white rounded-xl p-8 shadow-md">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-full p-3 mr-4">
                <Clock className="h-6 w-6 text-run-blue" />
              </div>
              <h3 className="text-xl font-bold">Ready to Work Together?</h3>
            </div>
            <p className="mb-6">
              Whether you're just starting your running journey or looking to take your performance to the next level,
              I'm here to help you achieve your goals with personalized coaching and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/start">
                <Button variant="outline" size="lg" className="bg-white text-run-blue hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link href="/custom-coaching">
                <Button variant="yellow" size="lg">
                  Get Personal Coaching
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
