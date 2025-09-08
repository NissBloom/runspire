"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Play, Headphones, ArrowRight } from "lucide-react"

interface Video {
  id: string
  title: string
  thumbnail: string
}

interface Podcast {
  title: string
  host: string
  duration: string
  link: string
}

interface Article {
  title: string
  content: string
}

interface TopicLayoutProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  videos: Video[]
  podcasts: Podcast[]
  articles: Article[]
}

export default function TopicLayout({ title, description, icon, color, videos, podcasts, articles }: TopicLayoutProps) {
  const [activeTab, setActiveTab] = useState("videos")
  const videosRef = useRef<HTMLDivElement>(null)

  const scrollVideos = (direction: "left" | "right") => {
    if (videosRef.current) {
      const scrollAmount = 300
      if (direction === "left") {
        videosRef.current.scrollLeft -= scrollAmount
      } else {
        videosRef.current.scrollLeft += scrollAmount
      }
    }
  }

  return (
    <div className={`min-h-screen ${color}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link href="/info">
            <Button variant="ghost">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Hub
            </Button>
          </Link>

          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-4">
            {icon}
            <h1 className="ml-3 text-3xl md:text-4xl font-bold">{title}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">{description}</p>
        </div>

        <Tabs defaultValue="videos" className="mb-12" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
                onClick={() => scrollVideos("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div
                ref={videosRef}
                className="flex overflow-x-auto gap-4 py-4 px-10 hide-scrollbar snap-x"
                style={{ scrollBehavior: "smooth" }}
              >
                {videos.map((video) => (
                  <div key={video.id} className="flex-none w-80 snap-start">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 shadow-lg">
                          <Play className="h-6 w-6 text-primary fill-primary" />
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-2 font-medium">{video.title}</h3>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
                onClick={() => scrollVideos("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="podcasts">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((podcast, index) => (
                <a key={index} href={podcast.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 rounded-full p-3">
                          <Headphones className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{podcast.title}</h3>
                          <p className="text-sm text-muted-foreground">{podcast.host}</p>
                          <p className="text-sm text-muted-foreground mt-2">{podcast.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                    <p className="text-muted-foreground">{article.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Link href="/plan-builder">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              Apply this knowledge to your training plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
