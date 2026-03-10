import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import screenImg from './assets/cv.jpg'

const StepCard = ({ number, title, onFileSelect, fileName, isDisabled }) => {
  const fileInputRef = useRef(null);
  return (
    <div
      onClick={() => !isDisabled && fileInputRef.current.click()}
      className={`relative p-6 rounded-[24px] border transition-all duration-300 flex flex-col items-center text-center justify-center flex-1
        ${isDisabled ? 'bg-gray-50 border-transparent cursor-not-allowed opacity-40' : 'bg-white border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-gray-200'}`}
    >
      <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => onFileSelect(e.target.files[0])} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3 
        ${fileName ? 'bg-black text-white' : (isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-black')}`}>
        {fileName ? '✓' : number}
      </div>
      <p className={`text-sm font-medium tracking-tight px-2 ${isDisabled ? 'text-gray-300' : 'text-gray-800'}`}>
        {fileName ? fileName.name.substring(0, 15) : title}
      </p>
    </div>
  )
}

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");

  const resultsRef = useRef(null);

  const handleAnalysis = async () => {
    setLoading(true); setStarted(true); setAnalysisResult("");
    const formData = new FormData();
    formData.append('job_file', file1);
    formData.append('cv_file', file2);

    try {
      const response = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      setAnalysisResult(data.analysis || data.error);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      setAnalysisResult("Erreur de connexion au serveur.");
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setStarted(false); setAnalysisResult(""); setFile1(null); setFile2(null);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 bg-[#FDFDFD] text-black font-sans tracking-tight">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-3 uppercase tracking-[0.1em]">Profila</h1>
        <p className="text-gray-400 font-light italic">Analyseur de candidature par IA</p>
      </motion.div>

      {/* Main Layout : Aligné sur la hauteur de l'image */}
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 w-full max-w-5xl">

        {/* Image : Taille réduite pour l'équilibre */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 max-w-md">
          <img src={screenImg} alt="CV" className="rounded-[32px] shadow-sm w-full h-full object-cover border border-gray-100 filter grayscale" />
        </motion.div>

        {/* Colonne de droite : Prend exactement la hauteur de l'image */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col gap-4 max-w-sm">
          <StepCard number="1" title="Offre (TXT)" onFileSelect={setFile1} fileName={file1} />
          <StepCard number="2" title="Votre CV (PDF)" onFileSelect={setFile2} fileName={file2} isDisabled={!file1} />

          <button
            disabled={!file1 || !file2 || loading}
            onClick={handleAnalysis}
            className={`w-full py-5 rounded-[24px] text-xs font-bold uppercase tracking-widest transition-all 
              ${(!file1 || !file2 || loading) ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900 shadow-md active:scale-95'}`}
          >
            {loading ? "Chargement..." : "Lancer l'analyse"}
          </button>
        </motion.div>
      </div>

      <div ref={resultsRef} className="scroll-mt-10" />

      <AnimatePresence>
        {started && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="mt-24 w-full max-w-4xl border-t border-gray-100 pt-16 mb-32">
            {loading ? (
              <div className="flex flex-col items-center py-10">
                <div className="w-6 h-6 border-2 border-gray-100 border-t-black rounded-full animate-spin mb-6"></div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-medium font-mono">Processing...</p>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-50 pb-10">
                  <div>
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-black mb-1">Rapport</h2>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em]">Compatibilité</p>
                  </div>
                  <span className="text-8xl font-light font-mono leading-none tracking-tighter text-black">
                    {analysisResult.match(/\d+/)?.[0] || "--"}%
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-12 text-base leading-relaxed text-gray-600 font-light whitespace-pre-line">
                  {analysisResult}
                </div>
                <div className="pt-8 flex justify-start">
                  <button onClick={handleReset} className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                    Nouvelle analyse
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App