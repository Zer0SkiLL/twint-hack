"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Filter, Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { FestivalHeader } from "@/components/festival-header"
import { OrganizerStats } from "@/components/organizer/organizer-stats"
import { TransactionTable } from "@/components/organizer/transaction-table"
import { VisitorTable } from "@/components/organizer/visitor-table"
import { RevenueChart } from "@/components/organizer/revenue-chart"
import { PopularVendorsChart } from "@/components/organizer/popular-vendors-chart"
import { VisitorActivityChart } from "@/components/organizer/visitor-activity-chart"
import { DateRangePicker } from "@/components/organizer/date-range-picker"
import { generateMockData } from "@/lib/mock-data-generator"

export default function OrganizerDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 2)),
    to: new Date(),
  })
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For demo purposes, we'll generate mock data
    const loadData = async () => {
      setLoading(true)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock data
        const data = generateMockData(dateRange.from, dateRange.to)
        setDashboardData(data)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "Error loading data",
          description: "There was an error loading the dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange, toast])

  const handleRefresh = () => {
    setLoading(true)
    // Simulate refresh
    setTimeout(() => {
      const data = generateMockData(dateRange.from, dateRange.to)
      setDashboardData(data)
      setLoading(false)
      toast({
        title: "Dashboard refreshed",
        description: "The dashboard data has been updated.",
      })
    }, 1000)
  }

  const handleExport = () => {
    toast({
      title: "Exporting data",
      description: "Your data is being exported. It will be downloaded shortly.",
    })

    // Simulate export delay
    setTimeout(() => {
      // In a real app, this would generate and download a CSV/Excel file
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dashboardData))
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "festival-data.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <FestivalHeader title="Organizer Dashboard" showBackButton backUrl="/" />

      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 flex items-center">
              <BarChart3 className="mr-2 h-8 w-8 text-purple-600" />
              Event Analytics Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Monitor transactions, visitor behavior, and event performance
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-12 w-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          </div>
        ) : dashboardData ? (
          <>
            <OrganizerStats data={dashboardData} />

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="visitors">Visitors</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="festival-card">
                    <CardHeader>
                      <CardTitle className="text-purple-700 dark:text-purple-300">Revenue Over Time</CardTitle>
                      <CardDescription>Total transaction volume by day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RevenueChart data={dashboardData.revenueByDay} />
                    </CardContent>
                  </Card>

                  <Card className="festival-card">
                    <CardHeader>
                      <CardTitle className="text-purple-700 dark:text-purple-300">Popular Vendors</CardTitle>
                      <CardDescription>Transaction volume by vendor</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PopularVendorsChart data={dashboardData.vendorPerformance} />
                    </CardContent>
                  </Card>
                </div>

                <Card className="festival-card">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Recent Transactions</CardTitle>
                    <CardDescription>Latest transactions across all vendors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionTable
                      transactions={dashboardData.transactions.slice(0, 5)}
                      visitors={dashboardData.visitors}
                      vendors={dashboardData.vendors}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <Card className="festival-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-purple-700 dark:text-purple-300">All Transactions</CardTitle>
                      <CardDescription>Complete transaction history</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <TransactionTable
                      transactions={dashboardData.transactions}
                      visitors={dashboardData.visitors}
                      vendors={dashboardData.vendors}
                      showPagination
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visitors" className="space-y-6">
                <Card className="festival-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-purple-700 dark:text-purple-300">Visitor Registry</CardTitle>
                      <CardDescription>All registered festival attendees</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <VisitorTable
                      visitors={dashboardData.visitors}
                      transactions={dashboardData.transactions}
                      showPagination
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="festival-card">
                    <CardHeader>
                      <CardTitle className="text-purple-700 dark:text-purple-300">Visitor Activity</CardTitle>
                      <CardDescription>Transactions by hour of day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VisitorActivityChart data={dashboardData.activityByHour} />
                    </CardContent>
                  </Card>

                  <Card className="festival-card">
                    <CardHeader>
                      <CardTitle className="text-purple-700 dark:text-purple-300">Spending Categories</CardTitle>
                      <CardDescription>Transaction breakdown by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500">Category data visualization will appear here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="festival-card">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Visitor Retention</CardTitle>
                    <CardDescription>Return visitor analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500">Retention data visualization will appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No data available for the selected date range.</p>
              <Button onClick={handleRefresh}>Refresh Data</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
