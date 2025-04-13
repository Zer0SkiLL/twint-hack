import Link from "next/link"
import { ArrowRight, Music, CreditCard, Zap, Ticket, Map, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full festival-header">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Music className="h-6 w-6 text-white" />
              <span className="font-bold text-xl text-white">FestPay</span>
            </Link>
          </div>
          <nav className="ml-auto flex items-center space-x-4">
            <Link href="/map" className="text-white hover:text-white/80 flex items-center">
              <Map className="h-4 w-4 mr-1" />
              <span>Map</span>
            </Link>
            <Link href="/organizer" className="text-white hover:text-white/80 flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span>Organizer</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 opacity-30"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="festival-title festival-gradient-text">Festival Payment Solution</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Seamlessly process cryptocurrency transactions between vendors and festival attendees.
                </p>
              </div>
              <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-4">
                <Card className="festival-card festival-card-glow">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Check-in Portal</CardTitle>
                    <CardDescription>
                      First time at the festival? Check in to receive your festival wallet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[140px] w-full rounded-md overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Ticket className="h-16 w-16 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full festival-button bg-gradient-to-r from-purple-600 to-pink-600">
                      <Link href="/check-in">
                        Festival Check-in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="festival-card festival-card-glow">
                  <CardHeader>
                    <CardTitle className="text-pink-600 dark:text-pink-300">Vendor Portal</CardTitle>
                    <CardDescription>Create orders and generate QR codes for customer payments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[140px] w-full rounded-md overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CreditCard className="h-16 w-16 text-pink-600" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full festival-button bg-gradient-to-r from-pink-600 to-amber-600">
                      <Link href="/merchant">
                        Vendor Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="festival-card festival-card-glow">
                  <CardHeader>
                    <CardTitle className="text-amber-600 dark:text-amber-300">Attendee Portal</CardTitle>
                    <CardDescription>View and approve transactions by scanning QR codes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[140px] w-full rounded-md overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-amber-500 opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="h-16 w-16 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full festival-button bg-gradient-to-r from-amber-600 to-yellow-600">
                      <Link href="/customer">
                        Attendee Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="festival-card festival-card-glow">
                  <CardHeader>
                    <CardTitle className="text-emerald-600 dark:text-emerald-300">Organizer Dashboard</CardTitle>
                    <CardDescription>Monitor transactions and analyze event performance.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[140px] w-full rounded-md overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full festival-button bg-gradient-to-r from-emerald-600 to-teal-600">
                      <Link href="/organizer">
                        Organizer Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm">
                  Festival Map
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800 dark:text-purple-200">
                  Explore the Festival Grounds
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Navigate the festival with ease. Find stages, food vendors, restrooms, and more with our interactive
                  map.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="festival-button bg-gradient-to-r from-purple-600 to-pink-600">
                    <Link href="/map">
                      <Map className="mr-2 h-4 w-4" />
                      View Full Map
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border-2 border-purple-200 shadow-lg">
                <Link href="/map" className="block relative">
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Button className="festival-button bg-gradient-to-r from-purple-600 to-pink-600">
                      Open Interactive Map
                    </Button>
                  </div>
                  <img src="/images/festival-map.png" alt="Festival Map" className="w-full h-auto" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col gap-2 min-[400px]:flex-row lg:flex-col lg:gap-2">
                <div className="grid gap-1 p-6 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
                  <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">For Vendors</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    1. Enter your XRP wallet seed
                    <br />
                    2. Create an order with details and amount
                    <br />
                    3. Generate a QR code for the customer
                    <br />
                    4. Receive instant confirmation when paid
                  </p>
                </div>
                <div className="grid gap-1 p-6 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
                  <h3 className="text-xl font-bold text-pink-600 dark:text-pink-300">For Attendees</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    1. Check in at the festival entrance
                    <br />
                    2. Receive your funded festival wallet
                    <br />
                    3. Scan vendor QR codes to pay
                    <br />
                    4. Track your spending in real-time
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-pink-100 dark:bg-pink-900/30 px-3 py-1 text-sm">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600 dark:text-pink-300">
                  Simple and Secure Transactions
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform leverages the XRP Ledger to provide fast, secure, and cost-effective transactions between
                  festival vendors and attendees. No more cash or cards needed!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white">
        <div className="container flex flex-col md:flex-row justify-between items-center px-4 md:px-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Music className="h-5 w-5" />
            <p className="text-sm font-medium">© 2024 FestPay. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/map" className="text-sm hover:underline flex items-center">
              <Map className="h-3 w-3 mr-1" />
              Festival Map
            </Link>
            <Link href="/organizer" className="text-sm hover:underline flex items-center">
              <BarChart3 className="h-3 w-3 mr-1" />
              Organizer Dashboard
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
