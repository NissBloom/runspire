// Centralized data for coaching packages
export const coachingPackages = {
  base: {
    id: "base",
    name: "Base Package",
    price: "₪100/month",
    features: [
      "Personalized training plan tailored to your goals & schedule",
      "Monthly 20-minute call for plan updates and adjustments",
      "Weekly WhatsApp/email communication to review progress and stay on track",
    ],
  },
  performance: {
    id: "performance",
    name: "Performance Package",
    price: "₪250/month",
    features: [
      "Everything in Base, plus:",
      "20-minute calls every 2 weeks for ongoing support",
      "Full post-workout analysis (pace, HR, effort, Strava/Garmin uploads)",
      "Weekly training plan adjustments based on your latest data",
      "Frequent communication for motivation, accountability, and quick answers",
    ],
  },
}

// Helper function to get a specific package by ID
export function getPackageById(id: string) {
  return coachingPackages[id] || null
}

// Helper function to get all packages as an array
export function getAllPackages() {
  return Object.values(coachingPackages)
}

// Training plans data
export const trainingPlans = [
  {
    id: "5k-beginner",
    name: "5K Beginner",
    description: "Perfect for new runners aiming for their first 5K",
    duration: "8 weeks",
    level: "Beginner",
    goal: "Complete a 5K run",
    weeklyMileage: "15-25 Kms",
    workouts: ["Easy runs", "Walk-run intervals", "Basic tempo runs"],
    features: [
      "Progressive walk-run program",
      "Easy-to-follow daily workouts",
      "Injury prevention tips",
      "Nutrition guidance for beginners",
    ],
    sampleWeek: [
      { day: "Monday", workout: "20-min walk-run intervals" },
      { day: "Tuesday", workout: "Rest or gentle walk" },
      { day: "Wednesday", workout: "15-min easy run" },
      { day: "Thursday", workout: "Rest day" },
      { day: "Friday", workout: "20-min walk-run intervals" },
      { day: "Saturday", workout: "Rest or cross-training" },
      { day: "Sunday", workout: "25-min long walk-run" },
    ],
  },
  {
    id: "10k-intermediate",
    name: "10K Intermediate",
    description: "Build endurance and speed for a strong 10K finish",
    duration: "10 weeks",
    level: "Intermediate",
    goal: "Improve 10K time",
    weeklyMileage: "30-50 Kms",
    workouts: ["Tempo runs", "Interval training", "Long runs", "Recovery runs"],
    features: [
      "Speed and endurance building",
      "Tempo and interval sessions",
      "Progressive long runs",
      "Race strategy guidance",
    ],
    sampleWeek: [
      { day: "Monday", workout: "30-min easy run" },
      { day: "Tuesday", workout: "25-min tempo run" },
      { day: "Wednesday", workout: "Rest or cross-training" },
      { day: "Thursday", workout: "Interval training - 6x400m" },
      { day: "Friday", workout: "Rest day" },
      { day: "Saturday", workout: "45-min long run" },
      { day: "Sunday", workout: "30-min recovery run" },
    ],
  },
  {
    id: "half-marathon",
    name: "Half Marathon",
    description: "Comprehensive training for your 13.1 Km goal",
    duration: "12 weeks",
    level: "Intermediate to Advanced",
    goal: "Complete or improve half marathon time",
    weeklyMileage: "40-65 Kms",
    workouts: ["Long runs", "Tempo runs", "Speed work", "Hill training", "Recovery runs"],
    features: ["Progressive long run buildup", "Race pace training", "Hill and speed work", "Tapering strategy"],
    sampleWeek: [
      { day: "Monday", workout: "40-min easy run" },
      { day: "Tuesday", workout: "30-min tempo run" },
      { day: "Wednesday", workout: "Rest or cross-training" },
      { day: "Thursday", workout: "Hill repeats - 6x2min" },
      { day: "Friday", workout: "Rest day" },
      { day: "Saturday", workout: "75-min long run" },
      { day: "Sunday", workout: "35-min recovery run" },
    ],
  },
  {
    id: "marathon",
    name: "Marathon",
    description: "Complete marathon preparation with progressive distance",
    duration: "16 weeks",
    level: "Advanced",
    goal: "Complete 26.2 Kms",
    weeklyMileage: "55-90 Kms",
    workouts: [
      "Long runs (up to 32 Kms)",
      "Marathon pace runs",
      "Speed work",
      "Hill training",
      "Recovery runs",
      "Cross training",
    ],
    features: ["32-Km long run preparation", "Marathon pace practice", "Comprehensive tapering", "Race day strategy"],
    sampleWeek: [
      { day: "Monday", workout: "45-min easy run" },
      { day: "Tuesday", workout: "40-min tempo run" },
      { day: "Wednesday", workout: "Rest or cross-training" },
      { day: "Thursday", workout: "Speed work - 8x800m" },
      { day: "Friday", workout: "Rest day" },
      { day: "Saturday", workout: "2-hour long run" },
      { day: "Sunday", workout: "45-min recovery run" },
    ],
  },
]

// Helper function to get a specific training plan by ID
export function getTrainingPlanById(id: string) {
  return trainingPlans.find((plan) => plan.id === id) || null
}

// Helper function to get all training plans
export function getAllTrainingPlans() {
  return trainingPlans
}
