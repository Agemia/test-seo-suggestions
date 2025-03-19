import { Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface Keyword {
  keyword: string;
  url: string;
  rank: number;
  description: string;
}

interface KeywordTableProps {
  keywords: Keyword[];
  isLoading: boolean;
}

type SortField = 'keyword' | 'rank' | 'searchVolume' | 'cpc';
type SortDirection = 'asc' | 'desc' | null;

export default function KeywordTable({ keywords, isLoading }: KeywordTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4 ml-1" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4 ml-1" />;
    return <ArrowUpDown className="w-4 h-4 ml-1" />;
  };

  const sortedKeywords = [...keywords].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    if (sortField === 'keyword') {
      return sortDirection === 'asc' 
        ? a.keyword.localeCompare(b.keyword)
        : b.keyword.localeCompare(a.keyword);
    }

    if (sortField === 'rank') {
      return sortDirection === 'asc' 
        ? a.rank - b.rank
        : b.rank - a.rank;
    }

    const getSearchVolume = (keyword: Keyword) => {
      return parseInt(keyword.description.split('Search Volume: ')[1].split(' |')[0]);
    };

    const getCPC = (keyword: Keyword) => {
      return parseFloat(keyword.description.split('CPC: $')[1]);
    };

    if (sortField === 'searchVolume') {
      return sortDirection === 'asc' 
        ? getSearchVolume(a) - getSearchVolume(b)
        : getSearchVolume(b) - getSearchVolume(a);
    }

    if (sortField === 'cpc') {
      return sortDirection === 'asc' 
        ? getCPC(a) - getCPC(b)
        : getCPC(b) - getCPC(a);
    }

    return 0;
  });

  const exportToCSV = () => {
    if (keywords.length === 0) return;
    
    // Extract search volume and CPC from description
    const processedKeywords = keywords.map(keyword => {
      const searchVolume = keyword.description.split('Search Volume: ')[1].split(' |')[0];
      const cpc = keyword.description.split('CPC: $')[1];
      
      return {
        Keyword: keyword.keyword,
        KD: keyword.rank,
        'Search Volume': searchVolume,
        CPC: cpc
      };
    });
    
    // Create CSV content
    const headers = Object.keys(processedKeywords[0]);
    const csvContent = [
      headers.join(','),
      ...processedKeywords.map(row => 
        headers.map(header => {
          // Wrap values with commas in quotes
          const value = String(row[header as keyof typeof row]);
          return value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `keyword-suggestions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-700">Loading keywords...</span>
        </div>
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center text-gray-500 py-8">
          <p>No keywords to display. Try searching for a seed keyword.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Keyword Suggestions ({keywords.length})</h2>
        <button 
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('keyword')}
              >
                <div className="flex items-center">
                  Keyword
                  {getSortIcon('keyword')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rank')}
              >
                <div className="flex items-center">
                  KD
                  {getSortIcon('rank')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('searchVolume')}
              >
                <div className="flex items-center">
                  Search Volume
                  {getSortIcon('searchVolume')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('cpc')}
              >
                <div className="flex items-center">
                  CPC
                  {getSortIcon('cpc')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Search
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedKeywords.map((keyword, index) => {
              const searchVolume = keyword.description.split('Search Volume: ')[1].split(' |')[0];
              const cpc = keyword.description.split('CPC: $')[1];
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {keyword.keyword}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {keyword.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {searchVolume}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${cpc}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a href={keyword.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Search
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
