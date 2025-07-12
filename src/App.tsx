import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types for our API response
type Article = {
  title: string;
  url: string;
  text: string;
  gemini_summary: string;
};

type Mentions = {
  positive: string[];
  neutral: string[];
  negative: string[];
};

type ApiResponse = {
  name: string;
  articles: Article[];
  mentions: Mentions;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setData(null);
    setError(null);

    try {
      // Simulate different loading phases
      setLoadingPhase('Searching social platforms...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      setLoadingPhase('Scraping and parsing results...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setLoadingPhase('Analyzing sentiment and synthesizing data...');

      // const response = await fetch(`http://127.0.0.1:8000/api/test-cors`);
      const response = await fetch(`/api/scrape?topic=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
      setLoadingPhase('');
    }
  };

  // Prepare data for the sentiment chart
  const sentimentData = data ? [
    {
      name: 'Positive',
      count: data.mentions.positive.length,
      fill: '#4ade80',
    },
    {
      name: 'Neutral',
      count: data.mentions.neutral.length,
      fill: '#94a3b8',
    },
    {
      name: 'Negative',
      count: data.mentions.negative.length,
      fill: '#f87171',
    },
  ] : [];

  return (
    <div className="flex flex-col min-h-screen w-full font-sans bg-gray-50">
      {/* Hero Section - Animated to shrink after search */}
      <motion.section
        className="relative flex flex-col justify-center items-center w-full overflow-hidden"
        animate={{
          height: data || isLoading ? '40vh' : '100vh',
          transition: { duration: 0.5 }
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/banner.webp"
            alt="Social Engineering"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

        {/* NavBar */}
        <nav className="absolute top-0 left-0 w-full z-20 bg-transparent px-10 py-8 flex items-center justify-between text-white">
          <h1 className="text-2xl font-bold hover:underline hover:cursor-pointer hover:text-orange-300">S.E.A</h1>
          <Button variant={"outline"} className="bg-white text-blue-700 hover:bg-blue-100 shadow">Support</Button>
        </nav>

        {/* Hero Content - Animated to move up */}
        <motion.div
          className="z-20 text-center text-white px-4 max-w-3xl w-full"
          animate={{
            y: data || isLoading ? -50 : 0,
            transition: { duration: 0.5 }
          }}
        >
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Social Engineering Analysis</h2>
          <p className="text-lg mb-6 drop-shadow-sm">
            Understand how your social presence is perceived and what's being said about you.
          </p>

          <motion.div
            className="relative max-w-xl w-full mx-auto"
            layout // This enables layout animations
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a person or topic..."
              className="w-full pl-4 pr-12 py-3 rounded-full text-gray-800 shadow-md focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full p-2 shadow hover:scale-105 transition disabled:opacity-70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-700 text-lg font-medium">{loadingPhase}</p>
              <p className="text-gray-500">This may take a moment as we analyze multiple sources...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded"
          >
            <p>Error: {error}</p>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Summary Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Analysis for <span className="text-orange-500">{data.name}</span>
                    </h2>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {data.articles.length} sources analyzed
                      </span>
                    </div>
                  </div>

                  {/* Sentiment Overview */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Positive Mentions</h3>
                      <p className="text-3xl font-bold text-green-500">{data.mentions.positive.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Neutral Mentions</h3>
                      <p className="text-3xl font-bold text-gray-500">{data.mentions.neutral.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Negative Mentions</h3>
                      <p className="text-3xl font-bold text-red-500">{data.mentions.negative.length}</p>
                    </div>
                  </div>

                  {/* Sentiment Chart */}
                  <div className="mt-8 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sentimentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Mentions">
                          {/* {sentimentData.map((entry, index) => (
                            <cell key={`cell-${index}`} fill={entry.fill} />
                          ))} */}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Articles Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Source Analysis</h3>
                <div className="space-y-4">
                  {data.articles.map((article, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-blue-600 hover:underline"
                          >
                            {article.title}
                          </a>
                          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                            Source {index + 1}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                          {article.gemini_summary.split('\n')[0]}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new URL(article.url).hostname}
                          </span>
                          <button className="text-orange-500 text-sm font-medium hover:text-orange-700">
                            Read more
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sentiment Quotes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Positive */}
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Positive Sentiment</h3>
                  <div className="space-y-3">
                    {data.mentions.positive.slice(1, 10).map((quote, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg shadow-xs">
                        <p className="text-sm text-gray-700">"{quote}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Neutral Sentiment</h3>
                  <div className="space-y-3">
                    {data.mentions.neutral.slice(1, 10).map((quote, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg shadow-xs">
                        <p className="text-sm text-gray-700">"{quote}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negative */}
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="text-lg font-medium text-red-800 mb-3">Negative Sentiment</h3>
                  <div className="space-y-3">
                    {data.mentions.negative.slice(1, 10).map((quote, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg shadow-xs">
                        <p className="text-sm text-gray-700">"{quote}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}