import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

interface SearchFormProps {
  onSubmit: (query: string, filters: any) => void
  isLoading: boolean
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({
    kdMax: 20,
    searchVolumeMin: 0, // Set to 0 by default to get more results
    language: 'en',
    country: 'us'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      return; // Prevent empty searches
    }
    onSubmit(query.trim(), filters)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter seed keyword..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Search
        </button>
      </div>
      
      <div className="flex gap-4 items-center">
        <Filter className="text-gray-600" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max KD</label>
            <input
              type="number"
              value={filters.kdMax}
              onChange={(e) => setFilters({ ...filters, kdMax: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Volume</label>
            <input
              type="number"
              value={filters.searchVolumeMin}
              onChange={(e) => setFilters({ ...filters, searchVolumeMin: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
              <option value="es">Spain</option>
              <option value="it">Italy</option>
              <option value="nl">Netherlands</option>
              <option value="se">Sweden</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  )
}
