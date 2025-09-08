import { Brain } from "lucide-react"
import TopicLayout from "../components/topic-layout"

export default function MentalTrainingPage() {
  const videos = [
    {
      id: "1",
      title: "Goal Setting for Runners: SMART Objectives",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "2",
      title: "Visualization Techniques for Better Performance",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "3",
      title: "Managing Race Day Anxiety",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "4",
      title: "Building Mental Toughness for Endurance Events",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "5",
      title: "Mindfulness for Runners",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: "6",
      title: "Overcoming the Mental Barriers in Marathon Training",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  const podcasts = [
    {
      title: "The Runner's Mind: Mental Strategies for Success",
      host: "Sports Psychologist Dr. Emma Wilson",
      duration: "47 min",
      link: "#",
    },
    {
      title: "Visualization: Training Your Brain to Win",
      host: "Mental Performance Lab",
      duration: "35 min",
      link: "#",
    },
    {
      title: "Conquering Race Day Nerves",
      host: "Calm Runner Podcast",
      duration: "41 min",
      link: "#",
    },
    {
      title: "Building Resilience: Mental Toughness for Runners",
      host: "Endurance Mindset",
      duration: "52 min",
      link: "#",
    },
  ]

  const articles = [
    {
      title: "Goal Setting Strategies",
      content:
        "Effective goal setting is fundamental to running success. Use the SMART framework: Specific (e.g., 'run a sub-2 hour half marathon' rather than 'get faster'), Measurable (time, distance, frequency), Achievable (challenging but realistic), Relevant (aligned with your values and interests), and Time-bound (with a deadline). Set process goals (what you'll do) alongside outcome goals (what you'll achieve). Break larger goals into smaller milestones, and regularly review and adjust your goals as you progress.",
    },
    {
      title: "Visualization Techniques",
      content:
        "Visualization is a powerful mental training tool used by elite athletes. Spend 5-10 minutes daily imagining yourself running with perfect form, managing challenges, and achieving your goals. Make your visualizations multi-sensory by including what you see, hear, feel, and even smell during your imagined run. Visualize both process (your form, breathing, and pacing) and outcome (crossing the finish line). This practice strengthens neural pathways and builds confidence for real-world performance.",
    },
    {
      title: "Managing Race Anxiety",
      content:
        "Pre-race anxiety is normal, even beneficial when channeled correctly. Develop a pre-race routine to create a sense of control and familiarity. Practice deep breathing: inhale for 4 counts, hold for 2, exhale for 6. Reframe anxiety as excitement—both have similar physiological responses. Focus on what you can control (your preparation, nutrition, pacing) rather than what you can't (weather, other runners). Remember that some anxiety actually improves performance by increasing alertness and focus.",
    },
    {
      title: "Building Mental Toughness",
      content:
        "Mental toughness is developed through deliberate practice. Include challenging workouts that push your limits, then reflect on how you responded to discomfort. Practice positive self-talk by creating mantras for difficult moments ('strong', 'smooth', 'I can do hard things'). Embrace discomfort in training as preparation for race day challenges. Develop a segmenting strategy for long runs and races, focusing only on the current mile or segment rather than the entire distance. Remember that mental toughness is a skill that improves with practice.",
    },
  ]

  return (
    <TopicLayout
      title="Mental Training"
      description="Strengthen your mental game with proven psychological techniques to enhance performance and enjoyment."
      icon={<Brain className="h-10 w-10 text-purple-600" />}
      color="bg-purple-50"
      videos={videos}
      podcasts={podcasts}
      articles={articles}
    />
  )
}
