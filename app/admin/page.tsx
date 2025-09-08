"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { approveTestimonial, rejectTestimonial } from "./actions"
import { getPackageById } from "@/lib/data"

export default function AdminPage() {
  const [connectionStatus, setConnectionStatus] = useState({ success: false, database: "", error: "" })
  const [requests, setRequests] = useState([])
  const [plans, setPlans] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch database connection status
        const statusRes = await fetch("/api/db-check")
        const statusData = await statusRes.json()
        setConnectionStatus(statusData)

        // Fetch coaching requests
        const requestsRes = await fetch("/api/coaching-requests")
        const requestsData = await requestsRes.json()
        setRequests(requestsData.requests || [])

        // Fetch training plans
        const plansRes = await fetch("/api/training-plans")
        const plansData = await plansRes.json()
        setPlans(plansData.plans || [])

        // Fetch testimonials
        const testimonialsRes = await fetch("/api/testimonials")
        const testimonialsData = await testimonialsRes.json()
        setTestimonials(testimonialsData.testimonials || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewTestimonial = (testimonial) => {
    setSelectedTestimonial(testimonial)
    setViewDialogOpen(true)
  }

  const handleApproveTestimonial = async (id) => {
    try {
      const result = await approveTestimonial(id)
      if (result.success) {
        // Update the testimonial status in the local state
        setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, status: "approved" } : t)))
      }
    } catch (error) {
      console.error("Error approving testimonial:", error)
    }
  }

  const handleRejectTestimonial = async (id) => {
    try {
      const result = await rejectTestimonial(id)
      if (result.success) {
        // Update the testimonial status in the local state
        setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)))
      }
    } catch (error) {
      console.error("Error rejecting testimonial:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-8 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Database Connection Status</h2>
        {connectionStatus.success ? (
          <div className="bg-green-100 text-green-800 p-3 rounded">
            <p>
              ✅ Connected to database: <strong>{connectionStatus.database}</strong>
            </p>
          </div>
        ) : (
          <div className="bg-red-100 text-red-800 p-3 rounded">
            <p>❌ Database connection error: {connectionStatus.error}</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="coaching">
        <TabsList className="mb-6">
          <TabsTrigger value="coaching">Coaching Requests</TabsTrigger>
          <TabsTrigger value="plans">Training Plans</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="coaching">
          <h2 className="text-xl font-semibold mb-4">Coaching Requests</h2>
          {requests.length > 0 ? (
            <Table>
              <TableCaption>List of coaching requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {request.first_name} {request.last_name}
                    </TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      {request.package_type && getPackageById(request.package_type)
                        ? getPackageById(request.package_type).name
                        : request.package_type}
                    </TableCell>
                    <TableCell>{request.goal}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No coaching requests found.</p>
          )}
        </TabsContent>

        <TabsContent value="plans">
          <h2 className="text-xl font-semibold mb-4">Training Plans</h2>
          {plans.length > 0 ? (
            <Table>
              <TableCaption>List of training plans</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Days/Week</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.email}</TableCell>
                    <TableCell>
                      {plan.goal === "5k"
                        ? "5K"
                        : plan.goal === "10k"
                          ? "10K"
                          : plan.goal === "half"
                            ? "Half Marathon"
                            : "Marathon"}
                    </TableCell>
                    <TableCell>{plan.experience.charAt(0).toUpperCase() + plan.experience.slice(1)}</TableCell>
                    <TableCell>{plan.days_per_week}</TableCell>
                    <TableCell>{new Date(plan.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No training plans found.</p>
          )}
        </TabsContent>

        <TabsContent value="testimonials">
          <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
          {testimonials.length > 0 ? (
            <Table>
              <TableCaption>List of testimonials</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Achievement</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      {testimonial.first_name} {testimonial.last_name}
                    </TableCell>
                    <TableCell>{testimonial.achievement}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          testimonial.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : testimonial.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(testimonial.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="link"
                          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                          onClick={() => handleViewTestimonial(testimonial)}
                        >
                          View
                        </Button>
                        {testimonial.status !== "approved" && (
                          <Button
                            variant="link"
                            className="text-green-600 hover:text-green-800 p-0 h-auto"
                            onClick={() => handleApproveTestimonial(testimonial.id)}
                          >
                            Approve
                          </Button>
                        )}
                        {testimonial.status !== "rejected" && (
                          <Button
                            variant="link"
                            className="text-red-600 hover:text-red-800 p-0 h-auto"
                            onClick={() => handleRejectTestimonial(testimonial.id)}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No testimonials found.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Testimonial View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Testimonial Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedTestimonial && new Date(selectedTestimonial.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={selectedTestimonial.image_url || "/placeholder.svg?height=80&width=80"}
                  alt={`${selectedTestimonial.first_name} ${selectedTestimonial.last_name}`}
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold">
                    {selectedTestimonial.first_name} {selectedTestimonial.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedTestimonial.achievement}</p>
                  <div className="flex mt-1">
                    {[...Array(selectedTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-yellow-300 pl-4 italic">
                "{selectedTestimonial.comment}"
              </blockquote>

              {selectedTestimonial.improvement_feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-semibold text-gray-700">Improvement Feedback:</h4>
                  <p className="text-sm text-gray-600">{selectedTestimonial.improvement_feedback}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                {selectedTestimonial.status !== "approved" && (
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      handleApproveTestimonial(selectedTestimonial.id)
                      setViewDialogOpen(false)
                    }}
                  >
                    Approve
                  </Button>
                )}
                {selectedTestimonial.status !== "rejected" && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleRejectTestimonial(selectedTestimonial.id)
                      setViewDialogOpen(false)
                    }}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
