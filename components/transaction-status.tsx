import { CheckCircle, Clock, XCircle } from "lucide-react"

interface TransactionStatusProps {
  status: "pending" | "completed" | "declined"
}

export function TransactionStatus({ status }: TransactionStatusProps) {
  if (status === "completed") {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="mr-2 h-5 w-5" />
        <span className="font-medium">Completed</span>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="flex items-center text-red-600">
        <XCircle className="mr-2 h-5 w-5" />
        <span className="font-medium">Declined</span>
      </div>
    )
  }

  return (
    <div className="flex items-center text-amber-600">
      <Clock className="mr-2 h-5 w-5" />
      <span className="font-medium">Pending</span>
    </div>
  )
}
