"use client"

import { Map } from "lucide-react"
import { FestivalHeader } from "@/components/festival-header"
import { SimpleFestivalMap } from "@/components/simple-festival-map"

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <FestivalHeader title="Festival Map" showBackButton backUrl="/" />

      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center mb-4">
          <Map className="h-6 w-6 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Festival Map</h1>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          <p>
            Explore the festival grounds with our interactive map. You can zoom, pan, and view details about different
            locations.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              Use the <span className="font-medium">+/- buttons</span> to zoom in and out
            </li>
            <li>Click and drag to pan around the map</li>
            <li>Click any point to view its details</li>
          </ul>
        </div>

        <div className="w-full h-[calc(100vh-12rem)] bg-white rounded-xl overflow-hidden shadow-lg">
          <SimpleFestivalMap />
        </div>
      </div>
    </div>
  )
}
