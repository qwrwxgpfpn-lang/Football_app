"use client"

export const ONBOARDED_KEY = "onboarded"
export const DEMO_PROFILE_KEY = "demo-profile"

export type DemoProfile = {
  name: string
  email: string
  position: string
  skillLevel: string
}

const defaultProfile: DemoProfile = {
  name: "Jordan Demo",
  email: "jordan@footyapp.local",
  position: "MID",
  skillLevel: "Intermediate",
}

export function hasDemoSession() {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ONBOARDED_KEY) === "true"
}

export function seedDemoSession(profile: Partial<DemoProfile> = {}) {
  if (typeof window === "undefined") return

  const nextProfile: DemoProfile = {
    ...defaultProfile,
    ...profile,
  }

  localStorage.setItem(ONBOARDED_KEY, "true")
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(nextProfile))
}

export function getDemoProfile() {
  if (typeof window === "undefined") return defaultProfile

  const savedProfile = localStorage.getItem(DEMO_PROFILE_KEY)

  if (!savedProfile) {
    return defaultProfile
  }

  try {
    return {
      ...defaultProfile,
      ...JSON.parse(savedProfile),
    } as DemoProfile
  } catch {
    return defaultProfile
  }
}
