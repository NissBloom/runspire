"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { approveTestimonial, rejectTestimonial, updateTestimonial } from "./actions"
import { getPackageById } from "@/lib/data"

interface Testimonial {
  id: number
  first_name: string
  last_name: string
  email: string
  achievement: string
  comment: string
  rating: number
  status: string
  created_at: string
  image_url?: string
  improvement_feedback?: string
}

interface Request {
  id: number
  first_name: string
  last_name: string
  email: string
  package_type: string
  goal: string
  status: string
  created_at: string
}

interface Plan {
  id: number
  name: string
  email: string
  goal: string
  experience: string
  days_per_week: number
  created_at: string
}

export default function AdminPage() {
  const [connectionStatus, setConnectionStatus] = useState({ success: false, database: "", error: "" })
  const [requests, setRequests] = useState<Request[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    achievement: "",
    comment: "",
  })

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

        // Fetch testimonials with better error handling
        try {
          const testimonialsRes = await fetch("/api/testimonials")
          if (!testimonialsRes.ok) {
            throw new Error(`HTTP error! status: ${testimonialsRes.status}`)
          }
          const testimonialsData = await testimonialsRes.json()
          console.log("Testimonials data received:", testimonialsData)
          setTestimonials(testimonialsData.testimonials || [])
        } catch (testimonialError) {
          console.error("Error fetching testimonials:", testimonialError)
          setTestimonials([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setEditForm({
      first_name: testimonial.first_name,
      last_name: testimonial.last_name,
      achievement: testimonial.achievement,
      comment: testimonial.comment,
    })
    setIsEditing(false)
    setViewDialogOpen(true)
  }

  const handleEditTestimonial = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedTestimonial) return

    try {
      const result = await updateTestimonial(selectedTestimonial.id, editForm)
      if (result.success) {
        // Update the testimonial in the local state
        setTestimonials(testimonials.map((t) => (t.id === selectedTestimonial.id ? { ...t, ...editForm } : t)))
        setSelectedTestimonial({ ...selectedTestimonial, ...editForm })
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating testimonial:", error)
    }
  }

  const handleCancelEdit = () => {
    if (!selectedTestimonial) return

    setEditForm({
      first_name: selectedTestimonial.first_name,
      last_name: selectedTestimonial.last_name,
      achievement: selectedTestimonial.achievement,
      comment: selectedTestimonial.comment,
    })
    setIsEditing(false)
  }

  const handleApproveTestimonial = async (id: number) => {
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

  const handleRejectTestimonial = async (id: number) => {
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
          <TabsTrigger value="testimonials">Testimonials ({testimonials.length})</TabsTrigger>
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
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No testimonials found in the database.</p>
              <p className="text-sm text-gray-400">
                Testimonials will appear here once users submit them through the testimonials page.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Testimonial View/Edit Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Testimonial" : "Testimonial Details"}</DialogTitle>
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
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          placeholder="First Name"
                          className="text-sm"
                        />
                        <Input
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          placeholder="Last Name"
                          className="text-sm"
                        />
                      </div>
                      <Input
                        value={editForm.achievement}
                        onChange={(e) => setEditForm({ ...editForm, achievement: e.target.value })}
                        placeholder="Achievement/Subtitle"
                        className="text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold">
                        {selectedTestimonial.first_name} {selectedTestimonial.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedTestimonial.achievement}</p>
                    </>
                  )}
                  <div className="flex mt-1">
                    {[...Array(selectedTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              {isEditing ? (
                <Textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  placeholder="Testimonial description"
                  rows={4}
                  className="w-full"
                />
              ) : (
                <blockquote className="border-l-4 border-yellow-300 pl-4 italic">
                  "{selectedTestimonial.comment}"
                </blockquote>
              )}

              {selectedTestimonial.improvement_feedback && !isEditing && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-semibold text-gray-700">Improvement Feedback:</h4>
                  <p className="text-sm text-gray-600">{selectedTestimonial.improvement_feedback}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Always show Edit button for all testimonials */}
                    <Button
                      variant="outline"
                      onClick={handleEditTestimonial}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Edit
                    </Button>
                    {selectedTestimonial.status !== "approved" && (
                      <Button
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
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
                        className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => {
                          handleRejectTestimonial(selectedTestimonial.id)
                          setViewDialogOpen(false)
                        }}
                      >
                        Reject
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
