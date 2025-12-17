import React, { useState, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ComparisonChart from './components/ComparisonChart';
import PredictionChart from './components/PredictionChart';
import PredictionTable from './components/PredictionTable';
import StatsCard from './components/StatsCard';
import DownloadCSVButton from './components/DownloadCSVButton';
import LandingPage from './components/LandingPage';
import { stockAPI } from './api';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  
  const [symbols, setSymbols] = useState(['RELIANCE.NS', 'AAPL']);
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [predictionDays, setPredictionDays] = useState(7);
  
  const [comparisonData, setComparisonData] = useState(null);
  const [predictionData, setPredictionData] = useState({});
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockAPI.compareStocks(symbols, startDate, endDate);
      setComparisonData(response.data);
    } catch (err) {
      setError(`Failed to compare stocks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [symbols, startDate, endDate]);

  const handlePredict = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockAPI.predictStock(symbol, startDate, endDate, predictionDays);
      setPredictionData(prev => ({
        ...prev,
        [symbol]: response.data
      }));
      
      // Also fetch stats
      const statsResponse = await stockAPI.getStats(symbol, startDate, endDate);
      setStatsData(prev => ({
        ...prev,
        [symbol]: statsResponse.data
      }));
    } catch (err) {
      setError(`Failed to predict for ${symbol}: Kindly type the Stock Name correctly Or Check the Internet Connection!!`);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, predictionDays]);

  if (!showDashboard) {
    return <LandingPage onExplore={() => setShowDashboard(true)} />;
  }

  return (
    <div className="min-h-screen">
      <Header onBackHome={() => setShowDashboard(false)} />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-6 p-4 md:p-6">
        <Sidebar
          symbols={symbols}
          setSymbols={setSymbols}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          predictionDays={predictionDays}
          setPredictionDays={setPredictionDays}
          onCompare={handleCompare}
          loading={loading}
        />
        
        <div className="flex-1 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {comparisonData && (
            <div className="panel backdrop-blur p-6">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                📊 Stock Comparison
              </h2>
              <ComparisonChart data={comparisonData} />
            </div>
          )}

          {symbols.map(symbol => (
            <div key={symbol} className="panel backdrop-blur p-6">
              <h2 className="text-xl font-bold text-primary mb-4">📈 {symbol}</h2>
              
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => handlePredict(symbol)}
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Predicting...' : '🧠 Predict Stock'}
                </button>
                
                {predictionData[symbol] && (
                  <DownloadCSVButton 
                    symbol={symbol} 
                    days={predictionDays} 
                    loading={loading}
                  />
                )}
              </div>

              {predictionData[symbol] && (
                <>
                  <div className="mb-6">
                    <PredictionChart data={predictionData[symbol]} />
                  </div>
                  <PredictionTable data={predictionData[symbol]} />
                  {/* Prediction Table removed - revert to download only behavior */}
                  
                  {statsData[symbol] && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <StatsCard label="Open Price" value={`$${statsData[symbol].open_price.toFixed(2)}`} />
                      <StatsCard label="Prev Close" value={`$${statsData[symbol].prev_close.toFixed(2)}`} />
                      <StatsCard label="52W High" value={`$${statsData[symbol].high_52w.toFixed(2)}`} />
                      <StatsCard label="52W Low" value={`$${statsData[symbol].low_52w.toFixed(2)}`} />
                      <StatsCard label="MA (20)" value={`$${statsData[symbol].ma_20?.toFixed(2) || 'N/A'}`} />
                      <StatsCard label="RSI (14)" value={statsData[symbol].rsi_14?.toFixed(2) || 'N/A'} />
                      <StatsCard label="Volume" value={`${(statsData[symbol].volume / 1e6).toFixed(1)}M`} />
                      <StatsCard label="RMSE" value={predictionData[symbol].rmse.toFixed(2)} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
