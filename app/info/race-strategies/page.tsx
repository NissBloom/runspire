import { Award } from "lucide-react"
import TopicLayout from "../components/topic-layout"

export default function RaceStrategiesPage() {
  const videos = [
    {
      id: "1",
      title: "Tapering for Peak Performance",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "2",
      title: "Race Pacing Strategies: From 5K to Marathon",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "3",
      title: "Course Tactics: Hills, Turns, and Terrain",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "4",
      title: "Post-Race Recovery: Bounce Back Faster",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "5",
      title: "Race Day Preparation: What to Do the Week Before",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "6",
      title: "Managing the Unexpected: Weather, Cramps, and More",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  const podcasts = [
    {
      title: "The Perfect Taper: Science and Strategy",
      host: "Performance Running Podcast",
      duration: "39 min",
      link: "#",
    },
    {
      title: "Race Day Execution: Pacing for Personal Bests",
      host: "Coach Mark Johnson",
      duration: "44 min",
      link: "#",
    },
    {
      title: "Course Strategy: Reading Terrain for Advantage",
      host: "Tactical Runner",
      duration: "36 min",
      link: "#",
    },
    {
      title: "The Recovery Window: Maximizing Post-Race Bounce Back",
      host: "Sports Medicine Today",
      duration: "48 min",
      link: "#",
    },
  ]

  const articles = [
    {
      title: "Tapering Properly",
      content:
        "Tapering—reducing training volume before a race—is essential for peak performance. For a marathon, taper for 2-3 weeks, reducing weekly mileage by 20-30% the first week, 40-50% the second week, and 60-70% the final week while maintaining some intensity. For shorter races like a 5K or 10K, a 7-10 day taper is usually sufficient. During the taper, focus on quality over quantity, get extra sleep, stay hydrated, and follow a balanced diet with adequate carbohydrates. Resist the urge to squeeze in extra training—trust that the work you've done will carry you through race day.",
    },
    {
      title: "Pacing Strategies",
      content:
        "Proper pacing is perhaps the most critical element of race execution. For most distances, even or slightly negative splits (running the second half faster than the first) yield the best results. In a 5K, start conservatively for the first kilometer, settle into your goal pace, then push in the final kilometer if you feel strong. For marathons, start 10-15 seconds per mile slower than goal pace, then gradually work toward your target. Use course knowledge to adjust pacing for hills and terrain. Remember that it's better to pass people in the later stages of a race than to be passed after going out too fast.",
    },
    {
      title: "Course Tactics",
      content:
        "Strategic course management can save energy and improve your time. Study the course map and elevation profile before race day. For hilly courses, maintain even effort (not pace) uphill by shortening your stride and increasing cadence, then use gravity to your advantage on downhills by lengthening your stride. Take tangents on turns to run the shortest possible distance. In windy conditions, draft behind other runners when possible. Position yourself appropriately at the start based on your goal time to avoid weaving through crowds, which adds unnecessary distance.",
    },
    {
      title: "Post-Race Recovery",
      content:
        "Effective recovery begins immediately after crossing the finish line. Start with a 10-15 minute walk to gradually bring your heart rate down. Consume carbohydrates and protein within 30 minutes post-race. Stay hydrated and consider compression garments to reduce muscle soreness. In the days following, engage in active recovery like swimming, cycling, or light walking. For shorter races (5K/10K), resume easy running after 2-3 days. For half marathons, wait 4-7 days, and for marathons, take 2-3 weeks before resuming normal training. Listen to your body—mental recovery is just as important as physical recovery.",
    },
  ]

  return (
    <TopicLayout
      title="Race Strategies"
      description="Prepare for race day success with expert advice on tapering, pacing, course tactics, and recovery."
      icon={<Award className="h-10 w-10 text-yellow-600" />}
      color="bg-yellow-50"
      videos={videos}
      podcasts={podcasts}
      articles={articles}
    />
  )
}
