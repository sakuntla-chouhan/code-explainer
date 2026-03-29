import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2, Sparkles, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ user }) => {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('detailed');
  const [language, setLanguage] = useState('english');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.post('http://localhost:5000/api/analyze', {
        code,
        mode,
        language
      }, config);
      setResponse(res.data.explanation);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to connect to the AI buddy. Please check your connection.';
      setResponse(`### ❌ Error\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="hero-section">
        <h1 className="hero-title">Code Analysis</h1>
        <p className="hero-subtitle">Paste your code below to get a detailed explanation from your AI Buddy.</p>
      </header>

      <div className="analyzer-grid">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Editor</span>
            <div className="toggle-pill">
              <button 
                className={`pill-btn ${language === 'english' ? 'active' : ''}`}
                onClick={() => setLanguage('english')}
              >
                English
              </button>
              <button 
                className={`pill-btn ${language === 'hindi' ? 'active' : ''}`}
                onClick={() => setLanguage('hindi')}
              >
                Hinglish
              </button>
            </div>
            <div className="toggle-pill">
              <button 
                className={`pill-btn ${mode === 'simple' ? 'active' : ''}`}
                onClick={() => setMode('simple')}
              >
                Simple
              </button>
              <button 
                className={`pill-btn ${mode === 'detailed' ? 'active' : ''}`}
                onClick={() => setMode('detailed')}
              >
                Detailed
              </button>
            </div>
          </div>
          <div className="editor-container">
            <textarea
              placeholder="// Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="controls-bar">
            <button 
              className="btn-primary" 
              onClick={analyzeCode}
              disabled={loading || !code.trim()}
            >
              {loading ? <Loader2 className="spinner" /> : <><Send size={18} /> Get Explanation</>}
            </button>
          </div>
        </div>

        <div className="panel response-panel">
          <div className="panel-header">
            <span className="panel-title">Explanation</span>
          </div>
          <AnimatePresence mode="wait">
            {!response && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--fg-muted)' }}>
                <Sparkles size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
                <p>Waiting for code to analyze...</p>
              </div>
            )}
            
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--fg-muted)' }}>
                <Loader2 size={48} className="spinner" style={{ marginBottom: '1rem', borderColor: 'var(--fg-muted)', borderLeftColor: 'var(--fg)' }} />
                <p>Analyzing your code...</p>
              </div>
            )}

            {response && (
              <motion.div 
                key="response"
                className="markdown-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
