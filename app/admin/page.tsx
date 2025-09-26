"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Edit, Trash2 } from "lucide-react"
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
  first_name: string
  last_name: string
  email: string
  goal: string
  experience: string
  days_per_week: number
  created_at: string
  current_mileage?: number
  bundle?: string
  cta?: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [showLogin, setShowLogin] = useState(true)
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

  // Check if already logged in on component mount
  useEffect(() => {
    const savedLogin = localStorage.getItem("admin-logged-in")
    if (savedLogin === "true") {
      setIsLoggedIn(true)
      setShowLogin(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Simple authentication - you can change these credentials
    if (loginForm.username === "admin" && loginForm.password === "runspire2024") {
      setIsLoggedIn(true)
      setShowLogin(false)
      localStorage.setItem("admin-logged-in", "true")
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowLogin(true)
    localStorage.removeItem("admin-logged-in")
  }

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

        // Fetch training plans with better error handling
        try {
          const plansRes = await fetch("/api/training-plans")
          if (!plansRes.ok) {
            throw new Error(`HTTP error! status: ${plansRes.status}`)
          }
          const plansData = await plansRes.json()
          console.log("Training plans API response:", plansData)

          // Handle different response formats
          let plansArray = []
          if (plansData.plans) {
            plansArray = plansData.plans
          } else if (plansData.data) {
            plansArray = plansData.data
          } else if (Array.isArray(plansData)) {
            plansArray = plansData
          }

          console.log("Setting training plans:", plansArray)
          setPlans(plansArray)
        } catch (planError) {
          console.error("Error fetching training plans:", planError)
          setPlans([])
        }

        // Fetch testimonials with better error handling
        try {
          const testimonialsRes = await fetch("/api/testimonials")
          if (!testimonialsRes.ok) {
            throw new Error(`HTTP error! status: ${testimonialsRes.status}`)
          }
          const testimonialsData = await testimonialsRes.json()
          console.log("Testimonials API response:", testimonialsData)

          // Handle different response formats
          let testimonialsArray = []
          if (testimonialsData.testimonials) {
            testimonialsArray = testimonialsData.testimonials
          } else if (testimonialsData.data) {
            testimonialsArray = testimonialsData.data
          } else if (Array.isArray(testimonialsData)) {
            testimonialsArray = testimonialsData
          }

          console.log("Setting testimonials:", testimonialsArray)
          setTestimonials(testimonialsArray)
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

    if (isLoggedIn) {
      fetchData()
    }
  }, [isLoggedIn])

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
      const result = await updateTestimonial(selectedTestimonial.id.toString(), editForm)
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
      const result = await approveTestimonial(id.toString())
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
      const result = await rejectTestimonial(id.toString())
      if (result.success) {
        // Update the testimonial status in the local state
        setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)))
      }
    } catch (error) {
      console.error("Error rejecting testimonial:", error)
    }
  }

  const handleEditPlan = (plan: Plan) => {
    // TODO: Implement edit functionality
    console.log("Edit plan:", plan)
  }

  const handleDeletePlan = async (planId: number) => {
    if (confirm("Are you sure you want to delete this training plan?")) {
      try {
        // TODO: Implement delete API call
        console.log("Delete plan:", planId)
        // For now, just remove from local state
        setPlans(plans.filter((p) => p.id !== planId))
      } catch (error) {
        console.error("Error deleting plan:", error)
      }
    }
  }

  if (showLogin && !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Access the Runspire admin dashboard</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="Username"
                  className="rounded-t-md"
                />
              </div>
              <div>
                <Input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Password"
                  className="rounded-b-md"
                />
              </div>
            </div>

            {loginError && <div className="text-red-600 text-sm text-center">{loginError}</div>}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
        >
          Logout
        </Button>
      </div>

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
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : plans.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">Total plans: {plans.length}</div>
              <Table>
                <TableCaption>List of training plans</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Days/Week</TableHead>
                    <TableHead>Current Mileage</TableHead>
                    <TableHead>Bundle</TableHead>
                    <TableHead>CTA</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        {plan.first_name && plan.last_name
                          ? `${plan.first_name} ${plan.last_name}`
                          : plan.first_name || plan.last_name || "No name"}
                        {!plan.first_name && !plan.last_name && (
                          <span className="text-red-500 text-xs block">Missing user data</span>
                        )}
                      </TableCell>
                      <TableCell>{plan.email || <span className="text-gray-400">No email</span>}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {plan.goal === "5k"
                            ? "5K"
                            : plan.goal === "10k"
                              ? "10K"
                              : plan.goal === "half"
                                ? "Half Marathon"
                                : plan.goal === "full"
                                  ? "Marathon"
                                  : plan.goal}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {plan.experience?.charAt(0).toUpperCase() + plan.experience?.slice(1) || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.days_per_week || "N/A"}</TableCell>
                      <TableCell>{plan.current_mileage ? `${plan.current_mileage} km` : "N/A"}</TableCell>
                      <TableCell>
                        {plan.bundle ? (
                          <Badge variant="outline" className="text-xs">
                            {plan.bundle === "base"
                              ? "Base"
                              : plan.bundle === "performance"
                                ? "Performance"
                                : plan.bundle}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {plan.cta ? (
                          <Badge variant="outline" className="text-xs">
                            {plan.cta === "book_consult"
                              ? "Book Consult"
                              : plan.cta === "whatsapp"
                                ? "WhatsApp"
                                : plan.cta === "request_plan"
                                  ? "Request Plan"
                                  : plan.cta}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(plan.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPlan(plan)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No training plans found.</p>
              <p className="text-sm text-gray-400">
                Training plans will appear here once users submit them through the plan builder.
              </p>
            </div>
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
