import Link from "next/link"
import { BookOpen, Star, Calendar, Users, Award, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TestimonialsPreloader } from "@/components/testimonials-preloader"

export default function Home() {
  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      {/* Add the preloader component */}
      <TestimonialsPreloader />

      {/* Hero Section */}
      <section className="pt-16 pb-24 bg-gradient-to-b from-white to-[#F7F7F7]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-run-dark leading-tight">
                Train smarter. Run stronger. Live better.
              </h1>
              <p className="text-xl mb-8 text-gray-600">
                I’m here to coach you - guiding you every step, with tailored support that makes running simple,
                sustainable, and fun. From your first 5K to chasing sub-3 marathons.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/start">
                  <Button variant="default" size="lg">
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/custom-coaching">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-run-blue rounded-full opacity-20 absolute -top-10 -left-10"></div>
                <img
                  src="/images/runspire-hero.png"
                  alt="Feel the Runspiration - Cartoon runner illustration"
                  className="relative z-10 animate-bounce-slow max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-16 bg-[#F7F7F7]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-extrabold mb-6 text-run-dark">Meet Your Coach</h2>
              <p className="text-xl mb-6 text-gray-600">
                Hi, I'm Nissan Bloom - I help people start running, stay consistent, and reach big goals like finishing
                a first 5K or breaking 3 hours in the marathon.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-run-blue rounded-full p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-run-dark">Proven Experience</h3>
                    <p className="text-gray-600">
                      Helped many runners reach their goals, from beginners to sub-3 marathoners and ultramarathon
                      finishers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-run-blue rounded-full p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-run-dark">Experienced Runner</h3>
                    <p className="text-gray-600">
                      From 5Ks to ultramarathons, including a sub-3 marathon finish and triathlon races.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-run-blue rounded-full p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-run-dark">Personalized Approach</h3>
                    <p className="text-gray-600">
                      Training that fits your life, plus regular feedback, tailored adjustments, and motivation when you
                      need it most.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-run-blue rounded-full p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-run-dark">Data-Driven Coaching</h3>
                    <p className="text-gray-600">
                      A balance of advanced analytics and intuitive understanding of running, combined with
                      evidence-based coaching and real-world lessons from years of endurance experience
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/about">
                <Button variant="default" size="lg">
                  Learn More About Me
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="w-64 h-64 bg-run-purple rounded-full opacity-20 absolute -top-10 -right-10"></div>
                <img
                  src="/images/coach-collage.jpg"
                  alt="Coach Nissan Bloom running collage - various races and training photos"
                  className="relative z-10 rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="/images/finish-strong.png"
                alt="Happy runners celebrating at finish line with Finish Strong banner"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-extrabold mb-6 text-run-dark">Celebrate Every Achievement</h2>
              <p className="text-xl mb-8 text-gray-600">
                Whether it's your first 5K or your tenth marathon, we're here to help you reach your goals and celebrate
                every milestone along the way.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-run-green rounded-full p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-run-dark">Set meaningful goals</h3>
                    <p className="text-gray-600">Create achievable targets that keep you motivated</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-run-green rounded-full p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-run-dark">Follow your personalized plan</h3>
                    <p className="text-gray-600">Train with purpose using our expert-designed programs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-run-green rounded-full p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-run-dark">Celebrate your success</h3>
                    <p className="text-gray-600">Experience the joy of reaching your running goals</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/testimonials">
                  <Button variant="green" size="lg">
                    See Success Stories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-run-dark">
            Everything you need to become a better runner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-white" />}
              title="Learn"
              description="Discover training principles and running tips"
              href="/info"
              color="bg-run-blue"
              borderColor="border-blue-600"
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-white" />}
              title="Success Stories"
              description="Read what our runners have accomplished"
              href="/testimonials"
              color="bg-run-orange"
              borderColor="border-orange-600"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-white" />}
              title="Personal Coaching"
              description="Work directly with our expert coaches"
              href="/custom-coaching"
              color="bg-run-purple"
              borderColor="border-purple-700"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-run-dark">Why runners choose Runspire</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Award className="h-10 w-10" />}
              title="Expert Coaches"
              description="Learn from coaches with years of experience"
              color="text-run-blue"
            />
            <BenefitCard
              icon={<Calendar className="h-10 w-10" />}
              title="Personalized Plans"
              description="Training plans tailored to your specific goals and abilities"
              color="text-run-green"
            />
            <BenefitCard
              icon={<Star className="h-10 w-10" />}
              title="Proven Results"
              description="Trusted by athletes who are achieving their goals every day"
              color="text-run-orange"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-run-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-6">Ready to start your running journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of runners who have transformed their running with Runspire.
          </p>
          <Link href="/start">
            <Button variant="outline" size="lg" className="bg-white text-run-blue">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, href, color, borderColor }) {
  return (
    <Link href={href} className="block">
      <div className="duolingo-card h-full flex flex-col hover:translate-y-[-5px] transition-transform duration-300">
        <div className={`${color} p-6 flex justify-center`}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/20">{icon}</div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-run-dark">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex items-center text-run-blue font-bold">
            <span className="mr-2">Explore</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function BenefitCard({ icon, title, description, color }) {
  return (
    <div className="duolingo-card p-6 text-center">
      <div className={`${color} mb-4 flex justify-center`}>{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-run-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
