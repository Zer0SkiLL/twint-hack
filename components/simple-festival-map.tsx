"use client"

import { useState } from "react"
import { Music, Utensils, Tent, Bath, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"

interface POI {
  id: string
  type: "stage" | "food" | "entrance" | "restroom" | "custom"
  name: string
  x: number
  y: number
  description?: string
}

interface SimpleFestivalMapProps {
  highlightedId?: string
}

export function SimpleFestivalMap({ highlightedId }: SimpleFestivalMapProps) {
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)

  // Festival points of interest
  const pointsOfInterest: POI[] = [
    // Stages
    { id: "stage-1", type: "stage", name: "Main Stage", x: 25, y: 30, description: "Headliners perform here" },
    { id: "stage-2", type: "stage", name: "Electronic Stage", x: 75, y: 40, description: "Electronic music all day" },
    { id: "stage-3", type: "stage", name: "Indie Stage", x: 40, y: 70, description: "Alternative and indie bands" },

    // Food vendors
    { id: "food-1", type: "food", name: "Food Court", x: 60, y: 60, description: "Various food options" },
    { id: "food-2", type: "food", name: "Craft Beer Garden", x: 75, y: 70, description: "Local craft beers" },
    { id: "food-3", type: "food", name: "Snack Bar", x: 40, y: 50, description: "Quick bites and drinks" },
    { id: "food-4", type: "food", name: "Vegan Corner", x: 20, y: 40, description: "Plant-based options" },

    // Entrances
    {
      id: "entrance-1",
      type: "entrance",
      name: "Main Entrance",
      x: 50,
      y: 10,
      description: "Ticket check and security",
    },
    { id: "entrance-2", type: "entrance", name: "VIP Entrance", x: 70, y: 15, description: "VIP and artist entrance" },

    // Restrooms
    {
      id: "restroom-1",
      type: "restroom",
      name: "Restroom North",
      x: 40,
      y: 20,
      description: "Restrooms and water stations",
    },
    {
      id: "restroom-2",
      type: "restroom",
      name: "Restroom Central",
      x: 55,
      y: 50,
      description: "Restrooms and water stations",
    },
    {
      id: "restroom-3",
      type: "restroom",
      name: "Restroom South",
      x: 30,
      y: 85,
      description: "Restrooms and water stations",
    },
  ]

  const handlePOIClick = (poi: POI) => {
    setSelectedPOI(poi === selectedPOI ? null : poi)
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "stage":
        return <Music className="h-4 w-4" />
      case "food":
        return <Utensils className="h-4 w-4" />
      case "entrance":
        return <Tent className="h-4 w-4" />
      case "restroom":
        return <Bath className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case "stage":
        return "bg-purple-500 text-white"
      case "food":
        return "bg-amber-500 text-white"
      case "entrance":
        return "bg-emerald-500 text-white"
      case "restroom":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-green-100 rounded-xl overflow-hidden border-2 border-green-200">
      {/* Map background */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/festival-map.png')" }}
      />

      {/* Points of interest */}
      {pointsOfInterest.map((poi) => (
        <button
          key={poi.id}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full p-1 cursor-pointer transition-all duration-200",
            poi.id === highlightedId || poi.id === selectedPOI?.id
              ? "scale-125 ring-2 ring-white shadow-lg z-20"
              : "hover:scale-110 z-10",
            getColorForType(poi.type),
          )}
          style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          onClick={() => handlePOIClick(poi)}
          aria-label={poi.name}
        >
          {getIconForType(poi.type)}
        </button>
      ))}

      {/* Selected POI info */}
      {selectedPOI && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-30 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <div className={`rounded-full p-1 ${getColorForType(selectedPOI.type)}`}>
              {getIconForType(selectedPOI.type)}
            </div>
            <h3 className="font-bold text-purple-900">{selectedPOI.name}</h3>
          </div>
          <p className="text-sm text-gray-600">{selectedPOI.description}</p>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-green-200">
        <div className="text-xs font-semibold mb-1 text-gray-700">Legend</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className="rounded-full p-0.5 bg-purple-500 text-white">
              <Music className="h-3 w-3" />
            </div>
            <span className="text-xs">Stages</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="rounded-full p-0.5 bg-amber-500 text-white">
              <Utensils className="h-3 w-3" />
            </div>
            <span className="text-xs">Food</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="rounded-full p-0.5 bg-emerald-500 text-white">
              <Tent className="h-3 w-3" />
            </div>
            <span className="text-xs">Entrances</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="rounded-full p-0.5 bg-blue-500 text-white">
              <Bath className="h-3 w-3" />
            </div>
            <span className="text-xs">Restrooms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
