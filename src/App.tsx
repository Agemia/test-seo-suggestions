import { useState } from 'react'
import SearchForm from './components/SearchForm'
import KeywordTable from './components/KeywordTable'

interface KeywordResult {
  keyword: string;
  url: string;
  rank: number;
  description: string;
}

export default function App() {
  const [keywords, setKeywords] = useState<KeywordResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (query: string, filters: any) => {
    setIsLoading(true)
    setError('')
    setKeywords([])
    
    try {
      // Mock data for development since the API credentials might be invalid
      const mockKeywords = generateMockKeywords(query);
      
      // Filter mock data based on user filters
      const filteredKeywords = mockKeywords.filter(item => {
        const searchVolume = parseInt(item.description.split('Search Volume: ')[1].split(' |')[0]);
        return item.rank <= filters.kdMax && searchVolume >= filters.searchVolumeMin;
      });
      
      if (filteredKeywords.length === 0) {
        setError(`No keywords found with KD ≤ ${filters.kdMax} and search volume ≥ ${filters.searchVolumeMin}. Try adjusting your filters.`);
      } else {
        setKeywords(filteredKeywords);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch keyword data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  // Generate mock keyword data based on the query
  const generateMockKeywords = (query: string): KeywordResult[] => {
    // Base keywords that will be combined with the query
    const baseKeywords = [
      'benefits', 'side effects', 'reviews', 'buy', 'online', 
      'near me', 'price', 'how to use', 'vs', 'alternative',
      'best', 'cheap', 'organic', 'natural', 'supplement',
      'dosage', 'powder', 'capsules', 'extract', 'pure'
    ];
    
    // Generate variations of the query
    const variations = [
      query,
      `${query} benefits`,
      `${query} side effects`,
      `best ${query}`,
      `${query} reviews`,
      `buy ${query}`,
      `${query} online`,
      `${query} near me`,
      `${query} price`,
      `how to use ${query}`,
      `${query} vs traditional medicine`,
      `${query} alternative`,
      `organic ${query}`,
      `natural ${query}`,
      `${query} supplement`,
      `${query} dosage`,
      `${query} powder`,
      `${query} capsules`,
      `${query} extract`,
      `pure ${query}`
    ];
    
    // Add some more specific variations
    variations.push(`what is ${query}`);
    variations.push(`${query} for health`);
    variations.push(`${query} for skin`);
    variations.push(`${query} for hair`);
    variations.push(`${query} for weight loss`);
    variations.push(`${query} benefits and side effects`);
    variations.push(`is ${query} safe`);
    variations.push(`${query} scientific research`);
    variations.push(`${query} where to buy`);
    variations.push(`${query} amazon`);
    
    // Create keyword results with random KD and search volume
    return variations.map(keyword => {
      // Generate a random KD between 1 and 30
      const kd = Math.floor(Math.random() * 30) + 1;
      
      // Generate a random search volume between 10 and 10000
      const searchVolume = Math.floor(Math.random() * 9990) + 10;
      
      // Generate a random CPC between 0.1 and 5.0
      const cpc = (Math.random() * 4.9 + 0.1).toFixed(2);
      
      return {
        keyword,
        url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
        rank: kd,
        description: `Search Volume: ${searchVolume} | CPC: $${cpc}`
      };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Low KD Keyword Finder</h1>
        
        <div className="space-y-8">
          <SearchForm onSubmit={handleSearch} isLoading={isLoading} />
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="text-red-700">{error}</div>
              </div>
            </div>
          )}
          
          <KeywordTable keywords={keywords} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
