/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserMinus, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Frown, 
  Dices,
  Settings2,
  ListChecks,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'main' | 'success' | 'failure';

export default function App() {
  const [totalStudents, setTotalStudents] = useState<number>(30);
  const [excludedInput, setExcludedInput] = useState<string>('');
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [currentPickedNumber, setCurrentPickedNumber] = useState<number | null>(null);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [successList, setSuccessList] = useState<number[]>([]);
  const [failureList, setFailureList] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('main');
  const [tempNumber, setTempNumber] = useState<number | null>(null);

  // Parse excluded numbers
  useEffect(() => {
    const numbers = excludedInput
      .split(/[\s,]+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= totalStudents);
    setExcludedNumbers([...new Set(numbers)]);
  }, [excludedInput, totalStudents]);

  const availableNumbers = useMemo(() => {
    const all = Array.from({ length: totalStudents }, (_, i) => i + 1);
    const used = [...successList, ...failureList, ...excludedNumbers];
    return all.filter(n => !used.includes(n));
  }, [totalStudents, successList, failureList, excludedNumbers]);

  const pickNumber = () => {
    if (availableNumbers.length === 0) {
      alert('더 이상 뽑을 수 있는 번호가 없습니다!');
      return;
    }

    setIsPicking(true);
    setCurrentPickedNumber(null);

    // Animation effect
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      setTempNumber(availableNumbers[randomIndex]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * availableNumbers.length);
        const picked = availableNumbers[finalIndex];
        setCurrentPickedNumber(picked);
        setTempNumber(null);
        setIsPicking(false);
      }
    }, 50);
  };

  const handleResult = (type: 'success' | 'failure') => {
    if (currentPickedNumber === null) return;
    
    if (type === 'success') {
      setSuccessList(prev => [...prev, currentPickedNumber].sort((a, b) => a - b));
    } else {
      setFailureList(prev => [...prev, currentPickedNumber].sort((a, b) => a - b));
    }
    setCurrentPickedNumber(null);
  };

  const resetHistory = () => {
    if (confirm('뽑기 기록(성공/실패 명단)을 초기화하시겠습니까?')) {
      setSuccessList([]);
      setFailureList([]);
      setCurrentPickedNumber(null);
      setTempNumber(null);
      setActiveTab('main');
    }
  };

  const resetAll = () => {
    if (confirm('모든 설정을 포함하여 초기 상태로 되돌리시겠습니까?')) {
      setTotalStudents(30);
      setExcludedInput('');
      setSuccessList([]);
      setFailureList([]);
      setCurrentPickedNumber(null);
      setTempNumber(null);
      setActiveTab('main');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#2D3436] font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-2xl mb-8 text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-2 tracking-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          English Random Draw
        </motion.h1>
        <p className="text-[#636E72] italic">Professional Classroom Picker</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="w-full max-w-2xl flex bg-white rounded-2xl shadow-sm border border-[#DFE6E9] p-1 mb-8">
        {(['main', 'success', 'failure'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab 
                ? 'bg-[#2D3436] text-white shadow-md' 
                : 'text-[#636E72] hover:bg-[#F1F2F6]'
            }`}
          >
            {tab === 'main' && <Dices size={18} />}
            {tab === 'success' && <CheckCircle2 size={18} />}
            {tab === 'failure' && <XCircle size={18} />}
            {tab === 'main' ? '뽑기' : 
             tab === 'success' ? '성공 명단' : '실패 명단'}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="w-full max-w-2xl flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Picker Card (Moved Up) */}
              <div className="bg-white rounded-3xl shadow-sm border border-[#DFE6E9] p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D3436 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Remaining Count Display */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 text-xs font-bold text-[#636E72] bg-[#F1F2F6]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#DFE6E9]">
                  <Users size={12} />
                  <span>남은 인원: {availableNumbers.length}</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-8 w-full">
                  <div className="h-40 flex items-center justify-center">
                    {isPicking ? (
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 0.2 }}
                        className="text-8xl font-black text-[#2D3436] tabular-nums"
                      >
                        {tempNumber}
                      </motion.div>
                    ) : currentPickedNumber ? (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="text-9xl font-black text-[#2D3436] drop-shadow-sm">
                          {currentPickedNumber}
                        </div>
                        <div className="flex gap-4 mt-4">
                          <button 
                            onClick={() => handleResult('success')}
                            className="flex items-center gap-2 bg-[#00B894] hover:bg-[#00A884] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#00B894]/20 transition-all active:scale-95"
                          >
                            <CheckCircle2 size={20} />
                            성공
                          </button>
                          <button 
                            onClick={() => handleResult('failure')}
                            className="flex items-center gap-2 bg-[#D63031] hover:bg-[#C22D2D] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#D63031]/20 transition-all active:scale-95"
                          >
                            <XCircle size={20} />
                            실패
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-[#B2BEC3] text-center">
                        <Dices size={64} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">버튼을 눌러 번호를 뽑으세요</p>
                      </div>
                    )}
                  </div>

                  {!currentPickedNumber && !isPicking && (
                    <button
                      onClick={pickNumber}
                      disabled={availableNumbers.length === 0}
                      className="w-full max-w-xs bg-[#2D3436] hover:bg-[#000] text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-[#2D3436]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <Dices size={24} />
                      번호 뽑기
                    </button>
                  )}
                </div>
              </div>

              {/* Settings Card (Moved Down) */}
              <div className="bg-white rounded-3xl shadow-sm border border-[#DFE6E9] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 text-[#2D3436] font-bold text-lg border-b border-[#F1F2F6] pb-4">
                  <Settings2 size={20} />
                  <span>설정</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#636E72]">
                      <Users size={16} />
                      총 인원
                    </label>
                    <input 
                      type="number" 
                      value={totalStudents}
                      onChange={(e) => setTotalStudents(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#F1F2F6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D3436] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#636E72]">
                      <UserMinus size={16} />
                      제외 번호 (쉼표로 구분)
                    </label>
                    <input 
                      type="text" 
                      placeholder="예: 5, 12, 23"
                      value={excludedInput}
                      onChange={(e) => setExcludedInput(e.target.value)}
                      className="w-full bg-[#F1F2F6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D3436] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#B2BEC3] uppercase tracking-wider w-full mb-1">남은 번호: {availableNumbers.length}개 (이미 뽑힌 번호 제외됨)</span>
                  {excludedNumbers.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {excludedNumbers.map(n => (
                        <span key={n} className="px-2 py-1 bg-[#F1F2F6] text-[#636E72] text-[10px] font-bold rounded-md border border-[#DFE6E9]">
                          {n} 제외
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={resetHistory}
                  className="bg-white border border-[#DFE6E9] text-[#636E72] hover:text-[#2D3436] hover:border-[#2D3436] px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <RotateCcw size={14} />
                  뽑기 기록 초기화
                </button>
                <button 
                  onClick={resetAll}
                  className="text-[#B2BEC3] hover:text-[#D63031] flex items-center gap-2 text-xs font-medium transition-colors"
                >
                  <RotateCcw size={12} />
                  전체 초기화 (설정 포함)
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-sm border border-[#DFE6E9] p-8 min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#00B894]/10 text-[#00B894] rounded-2xl">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2D3436]">성공 명단</h2>
                    <p className="text-sm text-[#636E72]">총 {successList.length}명</p>
                  </div>
                </div>
              </div>

              {successList.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {successList.map(num => (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={num} 
                      className="aspect-square flex items-center justify-center bg-[#F1F2F6] text-[#2D3436] font-bold rounded-xl border border-[#DFE6E9]"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-[#B2BEC3]">
                  <ListChecks size={48} className="mb-4 opacity-20" />
                  <p>아직 성공한 번호가 없습니다.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'failure' && (
            <motion.div
              key="failure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-sm border border-[#DFE6E9] p-8 min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#D63031]/10 text-[#D63031] rounded-2xl">
                    <Frown size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2D3436]">실패 명단</h2>
                    <p className="text-sm text-[#636E72]">총 {failureList.length}명</p>
                  </div>
                </div>
              </div>

              {failureList.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {failureList.map(num => (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={num} 
                      className="aspect-square flex items-center justify-center bg-[#F1F2F6] text-[#2D3436] font-bold rounded-xl border border-[#DFE6E9]"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-[#B2BEC3]">
                  <History size={48} className="mb-4 opacity-20" />
                  <p>아직 실패한 번호가 없습니다.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl mt-12 py-6 text-center border-t border-[#DFE6E9]">
        <p className="text-xs font-bold text-[#B2BEC3] uppercase tracking-[0.2em]">
          Donghae Middle School &copy; 2026
        </p>
      </footer>

      {/* Global Styles for School Feel */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}} />
    </div>
  );
}
