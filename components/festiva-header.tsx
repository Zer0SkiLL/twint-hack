import Link from "next/link"
import { ArrowLeft, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FestivalHeaderProps {
  showBackButton?: boolean
  backUrl?: string
  title: string
}

export function FestivalHeader({ showBackButton = false, backUrl = "/", title }: FestivalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full festival-header">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
                <Link href={backUrl}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-6 w-6 text-white" />
              <span className="font-bold text-xl text-white">FestPay</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </div>
    </header>
  )
}
