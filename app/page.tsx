import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">XRPL Payment</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  XRP Ledger Payment Solution
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Seamlessly process transactions between merchants and customers using the XRP Ledger.
                </p>
              </div>
              <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Merchant Portal</CardTitle>
                    <CardDescription>Create orders and generate QR codes for customer payments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src="/placeholder.svg?height=100&width=200"
                      alt="Merchant illustration"
                      className="mx-auto h-[100px] w-[200px] rounded-md object-cover"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/merchant">
                        Access Merchant Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Portal</CardTitle>
                    <CardDescription>View and approve transactions by scanning QR codes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src="/placeholder.svg?height=100&width=200"
                      alt="Customer illustration"
                      className="mx-auto h-[100px] w-[200px] rounded-md object-cover"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple and Secure Transactions
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform leverages the XRP Ledger to provide fast, secure, and cost-effective transactions between
                  merchants and customers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row lg:flex-col lg:gap-2">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">For Merchants</h3>
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
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">For Customers</h3>
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 XRPL Payment. All rights reserved.</p>
      </footer>
    </div>
  )
}
