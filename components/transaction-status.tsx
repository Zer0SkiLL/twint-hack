import { CheckCircle, Clock, XCircle } from "lucide-react"

interface TransactionStatusProps {
  status: "pending" | "completed" | "declined"
}

export function TransactionStatus({ status }: TransactionStatusProps) {
  if (status === "completed") {
    return (
      <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full text-sm">
        <CheckCircle className="mr-2 h-4 w-4" />
        <span className="font-medium">Completed</span>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="flex items-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full text-sm">
        <XCircle className="mr-2 h-4 w-4" />
        <span className="font-medium">Declined</span>
      </div>
    )
  }

  return (
    <div className="flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full text-sm">
      <Clock className="mr-2 h-4 w-4" />
      <span className="font-medium">Pending</span>
    </div>
  )
}
