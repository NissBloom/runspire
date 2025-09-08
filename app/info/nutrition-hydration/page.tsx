import { Heart } from "lucide-react"
import TopicLayout from "../components/topic-layout"

export default function NutritionHydrationPage() {
  const videos = [
    {
      id: "1",
      title: "Pre-Run Nutrition: What to Eat Before You Run",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "2",
      title: "Hydration Strategies for Runners",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "3",
      title: "Post-Run Recovery Nutrition",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "4",
      title: "Race Day Fueling: From 5K to Marathon",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "5",
      title: "Carb Loading: Myths and Facts",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "6",
      title: "Nutrition for Runners: Building a Balanced Diet",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  const podcasts = [
    {
      title: "Fueling for Performance",
      host: "Sports Nutrition Network",
      duration: "42 min",
      link: "#",
    },
    {
      title: "Hydration Science for Endurance Athletes",
      host: "Dr. Stacy Phillips",
      duration: "38 min",
      link: "#",
    },
    {
      title: "Eating for Recovery: The Post-Run Window",
      host: "Runner's Nutrition Podcast",
      duration: "29 min",
      link: "#",
    },
    {
      title: "Race Day Nutrition Strategies",
      host: "Elite Performance",
      duration: "45 min",
      link: "#",
    },
  ]

  const articles = [
    {
      title: "Pre-Run Nutrition Strategies",
      content:
        "What you eat before running affects your energy, performance, and comfort. For short runs (under 60 minutes), a small carbohydrate-rich snack 30-60 minutes before is usually sufficient. For longer runs, aim for 200-300 calories 1-3 hours before, focusing on easily digestible carbs with moderate protein and low fat and fiber. Good options include a banana with peanut butter, toast with honey, or oatmeal with fruit. Experiment during training to find what works best for your body.",
    },
    {
      title: "Hydration Guidelines",
      content:
        "Proper hydration is crucial for performance and safety. Start your run well-hydrated by drinking 16-20oz of fluid 2-3 hours before. During runs lasting over an hour, aim to drink 4-8oz every 15-20 minutes. For runs longer than 90 minutes, include electrolytes, especially sodium. After running, replace fluid losses by drinking 16-24oz for every pound lost during exercise. In hot weather, increase your fluid intake and consider pre-cooling strategies like drinking cold beverages before your run.",
    },
    {
      title: "Post-Run Recovery Nutrition",
      content:
        "The 30-60 minute window after running is ideal for kickstarting recovery. Aim for a combination of carbohydrates and protein in a 3:1 or 4:1 ratio. This replenishes glycogen stores and provides amino acids for muscle repair. Good recovery options include chocolate milk, a fruit smoothie with protein powder, or a meal containing lean protein and carbohydrates. Don't forget to continue hydrating, especially if your next training session is within 24 hours.",
    },
    {
      title: "Race Day Fueling",
      content:
        "Race day nutrition should be practiced during training. For events under an hour, focus on pre-race nutrition and hydration. For longer races, plan to consume 30-60g of carbohydrates per hour, starting around 30-45 minutes into the race. Options include energy gels, chews, sports drinks, or real foods like bananas or dates. Develop a fueling schedule and stick to it, rather than waiting until you feel depleted. Remember the adage: nothing new on race day!",
    },
  ]

  return (
    <TopicLayout
      title="Nutrition & Hydration"
      description="Discover how to fuel your runs and recover properly with evidence-based nutrition and hydration strategies."
      icon={<Heart className="h-10 w-10 text-red-600" />}
      color="bg-red-50"
      videos={videos}
      podcasts={podcasts}
      articles={articles}
    />
  )
}
