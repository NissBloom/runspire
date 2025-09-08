import { MonitorIcon as Running } from "lucide-react"
import TopicLayout from "../components/topic-layout"

export default function TrainingFundamentalsPage() {
  const videos = [
    {
      id: "1",
      title: "Building Your Aerobic Base: The Foundation of Running",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "2",
      title: "Proper Running Form: Efficiency in Motion",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "3",
      title: "Progressive Overload: How to Safely Increase Your Training",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "4",
      title: "Recovery Strategies: Making the Most of Your Rest Days",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "5",
      title: "Understanding Training Zones: Heart Rate and Effort",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "6",
      title: "Interval Training: Boost Your Speed and Endurance",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  const podcasts = [
    {
      title: "The Science of Endurance Training",
      host: "Dr. Alex Johnson",
      duration: "45 min",
      link: "#",
    },
    {
      title: "From Couch to 5K: Building Your Foundation",
      host: "Running Coach Sarah",
      duration: "32 min",
      link: "#",
    },
    {
      title: "The Art and Science of Recovery",
      host: "Elite Runner Podcast",
      duration: "53 min",
      link: "#",
    },
    {
      title: "Mastering Running Form",
      host: "Technique Talk",
      duration: "38 min",
      link: "#",
    },
  ]

  const articles = [
    {
      title: "Building Your Aerobic Base",
      content:
        "The aerobic base is the foundation of all endurance training. By spending time training at lower intensities, you develop the cardiovascular and metabolic systems that support all your running. A strong aerobic base improves your body's ability to use oxygen efficiently, increases mitochondrial density, and enhances fat utilization during exercise. Most runners should spend about 80% of their training time in this zone, focusing on easy, conversational-pace runs.",
    },
    {
      title: "Proper Running Form",
      content:
        "Good running form isn't about forcing a particular style, but rather finding your most efficient movement pattern. Key elements include a slight forward lean from the ankles (not the waist), a midfoot strike under your center of gravity, relaxed shoulders, and compact arm swing. Your cadence should typically be around 170-180 steps per minute. Remember that small improvements in efficiency can lead to significant performance gains over long distances.",
    },
    {
      title: "Progressive Overload",
      content:
        "The principle of progressive overload states that to improve, you must gradually increase the stress placed on your body. For runners, this means carefully increasing volume (mileage) and intensity (pace) over time. A good rule of thumb is to increase weekly mileage by no more than 10% each week, with a recovery week (reduced volume) every 3-4 weeks. This approach allows your body to adapt to training stress while minimizing injury risk.",
    },
    {
      title: "Recovery Strategies",
      content:
        "Recovery is when adaptation happens—it's when you actually get stronger from your training. Effective recovery strategies include proper sleep (7-9 hours per night), nutrition (adequate protein and carbohydrates), hydration, and active recovery like walking or light cycling. Recovery tools like foam rollers, massage guns, and compression garments can help manage muscle soreness. Remember that recovery needs increase with training intensity and volume, as well as with age.",
    },
  ]

  return (
    <TopicLayout
      title="Training Fundamentals"
      description="Master the core principles of effective running training to build endurance, improve performance, and prevent injuries."
      icon={<Running className="h-10 w-10 text-blue-600" />}
      color="bg-blue-50"
      videos={videos}
      podcasts={podcasts}
      articles={articles}
    />
  )
}
