import Link from "next/link"
import { ArrowRight, Music, CreditCard, Zap } from "lucide-react"

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
                  Seamlessly process cryptocurrency transactions between merchants and festival attendees.
                </p>
              </div>
              <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="festival-card festival-card-glow">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Merchant Portal</CardTitle>
                    <CardDescription>Create orders and generate QR codes for customer payments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[140px] w-full rounded-md overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CreditCard className="h-16 w-16 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full festival-button bg-gradient-to-r from-purple-600 to-pink-600">
                      <Link href="/merchant">
                        Access Merchant Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="festival-card festival-card-glow">
                  <CardHeader>
                   <CardTitle className="text-pink-600 dark:text-pink-300">Customer Portal</CardTitle>
                    <CardDescription>View and approve transactions by scanning QR codes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[140px] w-full rounded-md overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-amber-500 opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="h-16 w-16 text-pink-600" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                   <Button asChild className="w-full festival-button bg-gradient-to-r from-pink-600 to-amber-600">
                      <Link href="/customer">
                        Access Customer Portal
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
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800 dark:text-purple-200">
                  Fast & Secure Festival Payments
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform leverages the XRP Ledger to provide fast, secure, and cost-effective transactions between
                  festival vendors and attendees.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row lg:flex-col lg:gap-2">
                <div className="grid gap-1 p-6 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-md">
                  <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">For Merchants</h3>
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
                  <h3 className="text-xl font-bold text-pink-600 dark:text-pink-300">For Customers</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    1. Enter your XRP wallet seed
                    <br />
                    2. Scan the merchant's QR code
                    <br />
                    3. Review transaction details
                    <br />
                    4. Approve and send the payment
                  </p>
                </div>
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
            <Link href="#" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
