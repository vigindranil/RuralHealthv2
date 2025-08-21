"use client"

import { Button } from "../components/button"
import { Input } from "../components/input"
import { Label } from "../components/label"
import { Checkbox } from "../components/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select"
import { Separator } from "../components/separator"
import { MapPin, Building, Home, Users } from "lucide-react"

// Update the hierarchical data with the comprehensive master record for Jalpaiguri district

const hierarchicalData = {
  "Jalpaiguri District": {
    "Jalpaiguri Sadar Sub Division": {
      "Jalpaiguri Block": [
        "Kharia GP",
        "Arabinda GP",
        "Paharpur GP",
        "Mondalghat GP",
        "Bahadur GP",
        "Patkata GP",
        "Belakoba GP",
        "Barapatina Nutanabos GP",
        "Garalbari GP",
        "Nagar Berubari GP",
        "South Berubari GP",
        "Kharija–Barubari–I GP",
        "Kharija–Barubari–II GP",
        "Boalmari–Nandanpur GP",
      ],
      "Maynaguri Block": [
        "Amguri GP",
        "Domohoni–I GP",
        "Domohoni–II GP",
        "Madhabdanga–I GP",
        "Madhabdanga–II GP",
        "Padamoti–I GP",
        "Padamoti–II GP",
        "Barnis GP",
        "Ramshai GP",
        "Churabhandar GP",
        "Khagrabari–I GP",
        "Khagrabari–II GP",
        "Dharmapur GP",
        "Saptibari–I GP",
        "Saptibari–II GP",
      ],
      "Rajganj Block": [
        "Dabgram–I GP",
        "Dabgram–II GP",
        "Fulbari–I GP",
        "Fulbari–II GP",
        "Binnaguri GP",
        "Sannyasikata GP",
        "Majhiali GP",
        "Panikouri GP",
        "Sukhani GP",
        "Kukurjan GP",
        "Sikarpur GP",
        "Mantadari & Junglee Mohal Forest Area GP",
      ],
    },
    "Dhupguri Sub Division": {
      "Dhupguri Block": [
        "Barogharia GP",
        "Gadhearkuthi GP",
        "Godong–I GP",
        "Godong–II GP",
        "Jharaltagram–I GP",
        "Magurmari–I GP",
        "Magurmari–II GP",
        "Sakoajhora–II GP",
        "Salbari–II GP",
      ],
      "Banarhat Block": [
        "Sakoajhora–I GP",
        "Salbari–I GP",
        "Salbari–II GP",
        "Banarhat–I GP",
        "Banarhat–II GP",
        "Chamurchi GP",
        "Binnaguri GP",
      ],
    },
    "Mal Sub Division": {
      "Mal Block": ["Bagrakot GP", "Damdim GP", "Rangamati GP", "Kumlai GP", "Odlabari GP", "Tesimala GP"],
      "Matiali Block": [
        "Bidhannagar GP",
        "Matiali Hat GP",
        "Matiali–Batabari–II GP",
        "Indong–Matiali GP",
        "Matiali–Batabari–I GP",
      ],
      "Nagrakata Block": ["Angrabhasa–I GP", "Champaguri GP", "Sulkapara GP", "Angrabhasa–II GP", "Luksan GP"],
      "Kranti Block": ["Lataguri GP", "Rajadanga GP", "Changmari GP", "Kranti GP", "Moulani GP", "Chipadanga GP"],
    },
  },
  "Cooch Behar District": {
    "Cooch Behar Sub Division": {
      "Cooch Behar Block": ["Cooch Behar GP", "Ghughumari GP", "Khagrabari GP", "Dewanhat GP"],
      "Dinhata Block": ["Dinhata GP", "Sahebganj GP", "Takaganj GP", "Baxirhat GP"],
      "Mathabhanga Block": ["Mathabhanga GP", "Sitalkuchi GP", "Boxirhat GP", "Chilakhana GP"],
    },
    "Tufanganj Sub Division": {
      "Tufanganj Block": ["Tufanganj GP", "Kuchlibari GP", "Pundibari GP", "Gitaldaha GP"],
      "Mekhliganj Block": ["Mekhliganj GP", "Haldibari GP", "Falimari GP", "Nishiganj GP"],
    },
  },
}

interface FilterSidebarProps {
  activeFilters: any
  setActiveFilters: (filters: any) => void
}

export function FilterSidebar({ activeFilters, setActiveFilters }: FilterSidebarProps) {
  const metrics = [
    "Childbirths",
    "Underage Marriages",
    "Low Birth Weight",
    "No Immunization",
    "Under-20 Pregnant",
    "Teenage Pregnancy",
    "High-risk Pregnancy",
    "Malnourished Children",
    "Severely Underweight",
    "Infectious Diseases",
    "TB/Leprosy",
    "Anemic Adolescent Girls",
  ]

  const getSubDivisions = () => {
    return Object.keys(hierarchicalData[activeFilters.district as keyof typeof hierarchicalData] || {})
  }

  const getBlocks = () => {
    const district = hierarchicalData[activeFilters.district as keyof typeof hierarchicalData]
    if (!district || activeFilters.subDivision === "All") return []
    return Object.keys(district[activeFilters.subDivision as keyof typeof district] || {})
  }

  const getGPs = () => {
    const district = hierarchicalData[activeFilters.district as keyof typeof hierarchicalData]
    if (!district || activeFilters.subDivision === "All" || activeFilters.block === "All") return []
    const subDiv = district[activeFilters.subDivision as keyof typeof district]
    return subDiv?.[activeFilters.block as keyof typeof subDiv] || []
  }

  const handleDistrictChange = (district: string) => {
    setActiveFilters({
      ...activeFilters,
      district,
      subDivision: "All",
      block: "All",
      gp: "All",
    })
  }

  const handleSubDivisionChange = (subDivision: string) => {
    setActiveFilters({
      ...activeFilters,
      subDivision,
      block: "All",
      gp: "All",
    })
  }

  const handleBlockChange = (block: string) => {
    setActiveFilters({
      ...activeFilters,
      block,
      gp: "All",
    })
  }

  return (
    <div className="w-full p-4 space-y-6 overflow-y-auto">
      {/* Hierarchical Geographic Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* District */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
              <Building className="h-3 w-3 mr-1 text-blue-500" />
              District
            </Label>
            <Select value={activeFilters.district} onValueChange={handleDistrictChange}>
              <SelectTrigger className="bg-white border-gray-300 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jalpaiguri District">Jalpaiguri District</SelectItem>
                <SelectItem value="Cooch Behar District">Cooch Behar District</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sub Division */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
              <Home className="h-3 w-3 mr-1 text-blue-500" />
              Sub Division
            </Label>
            <Select value={activeFilters.subDivision} onValueChange={handleSubDivisionChange}>
              <SelectTrigger className="bg-white border-gray-300 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sub Divisions</SelectItem>
                {getSubDivisions().map((subDiv) => (
                  <SelectItem key={subDiv} value={subDiv}>
                    {subDiv}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Block */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
              <Users className="h-3 w-3 mr-1 text-blue-500" />
              Block
            </Label>
            <Select value={activeFilters.block} onValueChange={handleBlockChange}>
              <SelectTrigger className="bg-white border-gray-300 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Blocks</SelectItem>
                {getBlocks().map((block) => (
                  <SelectItem key={block} value={block}>
                    {block}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gram Panchayat */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-blue-500" />
              Gram Panchayat
            </Label>
            <Select
              value={activeFilters.gp}
              onValueChange={(value) => setActiveFilters({ ...activeFilters, gp: value })}
            >
              <SelectTrigger className="bg-white border-gray-300 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All GPs</SelectItem>
                {getGPs().map((gp) => (
                  <SelectItem key={gp} value={gp}>
                    {gp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Filters */}
          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1 block">ICDS Center</Label>
            <Input placeholder="Search ICDS center..." className="bg-white border-gray-300 rounded-md" />
          </div>

          <div>
            <Label className="text-xs font-medium text-gray-600 mb-1 block">Health Center</Label>
            <Input placeholder="Search health center..." className="bg-white border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Health Metrics */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Health Metrics</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-2">
          {metrics.map((metric) => (
            <div key={metric} className="flex items-center space-x-2">
              <Checkbox id={metric} className="border-gray-300" />
              <Label htmlFor={metric} className="text-sm cursor-pointer">
                {metric}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
        <Button variant="outline" className="w-full bg-white border-gray-300 hover:bg-gray-50">
          Clear All
        </Button>
      </div>

      {/* Quick Links */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Quick Links:</strong>
        </p>
        <ul className="space-y-1">
          <li>
            <Button variant="link" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700">
              High Priority Cases
            </Button>
          </li>
          <li>
            <Button variant="link" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700">
              Pending Follow-ups
            </Button>
          </li>
          <li>
            <Button variant="link" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700">
              This Week's Births
            </Button>
          </li>
          <li>
            <Button variant="link" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700">
              Overdue Immunizations
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}
