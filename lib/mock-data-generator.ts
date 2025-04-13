// Mock data generator for the organizer dashboard

// Helper function to generate a random date between two dates
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to generate a random number between min and max
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Helper function to generate a random transaction amount
function randomAmount() {
  return (Math.random() * 50 + 5).toFixed(2)
}

// Helper function to generate a random ID
function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`
}

// Helper function to generate a random wallet address
function generateWalletAddress() {
  return `r${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`
}

// Generate mock data for the dashboard
export function generateMockData(startDate: Date, endDate: Date) {
  // Generate vendors
  const vendors = [
    { id: "vendor-1", name: "Main Stage Food Court", type: "food", location: "food-court" },
    { id: "vendor-2", name: "Craft Beer Garden", type: "drinks", location: "food-craft-beer" },
    { id: "vendor-3", name: "Festival Merchandise", type: "merchandise", location: "entrance-main" },
    { id: "vendor-4", name: "VIP Lounge", type: "vip", location: "entrance-vip" },
    { id: "vendor-5", name: "Snack Bar", type: "food", location: "food-3" },
    { id: "vendor-6", name: "Vegan Corner", type: "food", location: "food-vegan" },
  ]

  // Generate visitors
  const visitors = Array.from({ length: 50 }, (_, i) => {
    const checkInTime = randomDate(startDate, new Date(endDate.getTime() - 24 * 60 * 60 * 1000))
    return {
      id: `visitor-${i + 1}`,
      name: `Visitor ${i + 1}`,
      walletAddress: generateWalletAddress(),
      checkInTime: checkInTime.toISOString(),
      initialBalance: "100.00",
    }
  })

  // Generate transactions
  const transactions = []
  const transactionStatuses = ["completed", "pending", "declined"]
  const transactionDescriptions = [
    "Food purchase",
    "Drink purchase",
    "Merchandise purchase",
    "VIP upgrade",
    "Snack purchase",
    "Meal purchase",
  ]

  // Generate between 100-200 transactions
  const numTransactions = randomNumber(100, 200)

  for (let i = 0; i < numTransactions; i++) {
    const timestamp = randomDate(startDate, endDate).toISOString()
    const vendorId = vendors[randomNumber(0, vendors.length - 1)].id
    const visitorId = visitors[randomNumber(0, visitors.length - 1)].id
    const status = transactionStatuses[randomNumber(0, 2)]
    const amount = randomAmount()
    const description = transactionDescriptions[randomNumber(0, transactionDescriptions.length - 1)]

    const createdAt = new Date(timestamp)
    // If completed, add a completion time a few minutes later
    const completedAt =
      status === "completed" ? new Date(createdAt.getTime() + randomNumber(1, 10) * 60 * 1000).toISOString() : null

    transactions.push({
      id: generateId("tx"),
      vendorId,
      visitorId,
      amount,
      description,
      status,
      timestamp,
      createdAt: createdAt.toISOString(),
      completedAt,
      txHash: status === "completed" ? generateId("hash") : null,
    })
  }

  // Sort transactions by timestamp (newest first)
  transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Generate revenue by day
  const revenueByDay = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayTransactions = transactions.filter((t) => {
      const txDate = new Date(t.timestamp)
      return (
        txDate.getDate() === currentDate.getDate() &&
        txDate.getMonth() === currentDate.getMonth() &&
        txDate.getFullYear() === currentDate.getFullYear() &&
        t.status === "completed"
      )
    })

    const dayRevenue = dayTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0).toFixed(2)

    revenueByDay.push({
      date: format(currentDate, "MMM d"),
      revenue: Number.parseFloat(dayRevenue),
    })

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Generate vendor performance data
  const vendorPerformance = vendors
    .map((vendor) => {
      const vendorTransactions = transactions.filter((t) => t.vendorId === vendor.id && t.status === "completed")

      const totalRevenue = vendorTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0).toFixed(2)

      return {
        name: vendor.name,
        value: Number.parseFloat(totalRevenue),
      }
    })
    .sort((a, b) => b.value - a.value)

  // Generate activity by hour
  const activityByHour = Array.from({ length: 24 }, (_, hour) => {
    const hourTransactions = transactions.filter((t) => {
      const txDate = new Date(t.timestamp)
      return txDate.getHours() === hour
    })

    return {
      hour,
      count: hourTransactions.length,
    }
  })

  return {
    vendors,
    visitors,
    transactions,
    revenueByDay,
    vendorPerformance,
    activityByHour,
  }
}

// Helper function to format date for display
function format(date: Date, formatStr: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  if (formatStr === "MMM d") {
    return `${months[date.getMonth()]} ${date.getDate()}`
  }

  return date.toLocaleDateString()
}
