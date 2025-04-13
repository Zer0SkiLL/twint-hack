"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Ticket, RefreshCw, ArrowRight, Check, Wallet, MapPin, Music, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { FestivalHeader } from "@/components/festival-header"
import { SimpleFestivalMap } from "@/components/simple-festival-map"

export default function CheckInPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [ticketCode, setTicketCode] = useState("")
  const [visitorName, setVisitorName] = useState("")
  const [walletInfo, setWalletInfo] = useState<{
    address: string
    seed: string
    balance: string
  } | null>(null)
  const [xrplService, setXrplService] = useState<any>(null)

  // Load the XRPL service dynamically
  useEffect(() => {
    const loadXrplService = async () => {
      try {
        // Import all functions from the service
        const service = await import("@/lib/xrpl-service")
        setXrplService(service)
        console.log("XRPL service loaded successfully")
      } catch (error) {
        console.error("Failed to load XRPL service:", error)
        toast({
          title: "Service Error",
          description: "Failed to load the XRPL service. Please try refreshing the page.",
          variant: "destructive",
        })
      }
    }

    loadXrplService()
  }, [toast])

  // Check if visitor is already checked in
  useEffect(() => {
    const storedWallet = localStorage.getItem("visitorWallet")
    if (storedWallet) {
      try {
        const wallet = JSON.parse(storedWallet)
        setWalletInfo(wallet)
        setCheckedIn(true)

        // Also store as customer wallet for demo purposes
        localStorage.setItem("customerWalletSeed", wallet.seed)
      } catch (error) {
        console.error("Error parsing stored wallet:", error)
      }
    }
  }, [])

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ticketCode || !visitorName) {
      toast({
        title: "Missing information",
        description: "Please enter both your ticket code and name.",
        variant: "destructive",
      })
      return
    }

    if (!xrplService) {
      toast({
        title: "Service not loaded",
        description: "Please wait for the XRPL service to load.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setCheckingIn(true)

    try {
      // Simulate ticket validation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a test wallet with funds
      const result = await xrplService.generateTestWallet()

      if (result) {
        const wallet = {
          address: result.wallet.address,
          seed: result.wallet.seed,
          balance: result.balance,
        }

        setWalletInfo(wallet)
        localStorage.setItem("visitorWallet", JSON.stringify(wallet))

        // Also store as customer wallet for demo purposes
        localStorage.setItem("customerWalletSeed", wallet.seed)

        toast({
          title: "Check-in successful!",
          description: "Your festival wallet has been created and funded with XRP.",
        })

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCheckedIn(true)
      }
    } catch (error) {
      console.error("Error during check-in:", error)
      toast({
        title: "Check-in failed",
        description: "There was an error processing your check-in. Please try again.",
        variant: "destructive",
      })
      setCheckingIn(false)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem("visitorWallet")
    localStorage.removeItem("customerWalletSeed")
    setWalletInfo(null)
    setCheckedIn(false)
    setCheckingIn(false)
    setTicketCode("")
    setVisitorName("")

    toast({
      title: "Reset successful",
      description: "Your check-in information has been cleared.",
    })
  }

  const goToCustomerPortal = () => {
    router.push("/customer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <FestivalHeader title="Festival Check-in" showBackButton backUrl="/" />

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 space-x-2">
            <Ticket className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">Festival Check-in</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              {!checkedIn ? (
                <Card className="festival-card">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">
                      {checkingIn ? "Processing Check-in..." : "Welcome to the Festival!"}
                    </CardTitle>
                    <CardDescription>
                      {checkingIn
                        ? "Please wait while we validate your ticket and create your festival wallet."
                        : "Enter your ticket details to check in and receive your festival wallet."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {checkingIn ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="relative">
                          <RefreshCw className="h-12 w-12 text-purple-600 animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-center text-gray-500">Validating ticket...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleTicketSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ticketCode">Ticket Code</Label>
                          <Input
                            id="ticketCode"
                            placeholder="Enter your ticket code..."
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            required
                            className="festival-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="visitorName">Your Name</Label>
                          <Input
                            id="visitorName"
                            placeholder="Enter your name..."
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                            required
                            className="festival-input"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full festival-button bg-gradient-to-r from-purple-600 to-pink-600"
                          disabled={loading || !xrplService}
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : !xrplService ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Loading Service...
                            </>
                          ) : (
                            "Check In & Get Festival Wallet"
                          )}
                        </Button>

                        <p className="text-xs text-center text-gray-500 mt-4">
                          For demonstration purposes, this will create a test XRP wallet with funds that you can use
                          throughout the festival.
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="festival-card">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-green-100 p-1">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-purple-700 dark:text-purple-300">Check-in Complete!</CardTitle>
                    </div>
                    <CardDescription>
                      Welcome to the festival, {visitorName}! Your festival wallet has been created and funded.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wallet className="h-5 w-5 text-purple-600" />
                        <h3 className="font-medium text-purple-800 dark:text-purple-200">Your Festival Wallet</h3>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-gray-500">Wallet Address</Label>
                          <p className="font-mono text-xs break-all">{walletInfo?.address}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Initial Balance</Label>
                          <p className="font-medium text-lg text-purple-700 dark:text-purple-300">
                            {walletInfo?.balance} XRP
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={goToCustomerPortal}
                        className="w-full festival-button bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        Go to Payment Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <Button variant="outline" onClick={handleReset} className="w-full festival-button">
                        Reset Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="festival-card mt-6">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-purple-700 dark:text-purple-300">Festival Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-purple-800 dark:text-purple-200">Festival Hours</h3>
                    <p className="text-sm text-gray-600">Friday: 12pm - 11pm</p>
                    <p className="text-sm text-gray-600">Saturday: 11am - 11pm</p>
                    <p className="text-sm text-gray-600">Sunday: 11am - 10pm</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-purple-800 dark:text-purple-200">Important Information</h3>
                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                      <li>Your festival wallet can be used at all vendor locations</li>
                      <li>Free water stations are available near all restroom areas</li>
                      <li>First aid stations are located at each entrance</li>
                      <li>Lost & found is at the Main Entrance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="festival-card">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-purple-300">Festival Map</CardTitle>
                  <CardDescription>
                    Explore the festival grounds and locate stages, food vendors, and facilities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <SimpleFestivalMap />
                  <div className="mt-2 text-center">
                    <Button variant="outline" onClick={() => router.push("/map")} className="text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Open Full Map
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="festival-card">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-purple-300">Today's Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="rounded-md bg-purple-100 p-2 text-purple-600">
                        <Music className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-purple-800 dark:text-purple-200">Main Stage</h3>
                        <p className="text-sm text-gray-600">8:00 PM - Headliner Performance</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="rounded-md bg-pink-100 p-2 text-pink-600">
                        <Music className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-pink-600 dark:text-pink-300">Electronic Stage</h3>
                        <p className="text-sm text-gray-600">7:00 PM - DJ Showcase</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="rounded-md bg-amber-100 p-2 text-amber-600">
                        <Utensils className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-amber-600 dark:text-amber-300">Food Court</h3>
                        <p className="text-sm text-gray-600">All Day - International Food Festival</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
