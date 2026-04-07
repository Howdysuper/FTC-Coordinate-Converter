/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRightLeft, RefreshCw, Info, ChevronRight, Copy, Check, Repeat } from 'lucide-react';

interface Coordinates {
  x: string;
  y: string;
  heading: string;
}

type ConversionMode = 'pedroToRR' | 'rrToPedro';

export default function App() {
  // Mode State
  const [mode, setMode] = useState<ConversionMode>('pedroToRR');

  // Pedro -> Road Runner State
  const [pedroInput, setPedroInput] = useState<Coordinates>({ x: '0', y: '0', heading: '0' });
  const [rrOutput, setRrOutput] = useState<Coordinates>({ x: '72.00', y: '-72.00', heading: '-90.00' });

  // Road Runner -> Pedro State
  const [rrInput, setRrInput] = useState<Coordinates>({ x: '0', y: '0', heading: '0' });
  const [pedroOutput, setPedroOutput] = useState<Coordinates>({ x: '72.00', y: '72.00', heading: '90.00' });

  // Copy Feedback State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Conversion Logic: Pedro -> Road Runner
  useEffect(() => {
    const px = parseFloat(pedroInput.x) || 0;
    const py = parseFloat(pedroInput.y) || 0;
    const ph = parseFloat(pedroInput.heading) || 0;

    setRrOutput({
      x: (72 - py).toFixed(2),
      y: (px - 72).toFixed(2),
      heading: (ph - 90).toFixed(2),
    });
  }, [pedroInput]);

  // Conversion Logic: Road Runner -> Pedro
  useEffect(() => {
    const rx = parseFloat(rrInput.x) || 0;
    const ry = parseFloat(rrInput.y) || 0;
    const rh = parseFloat(rrInput.heading) || 0;

    setPedroOutput({
      x: (ry + 72).toFixed(2),
      y: (72 - rx).toFixed(2),
      heading: (rh + 90).toFixed(2),
    });
  }, [rrInput]);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<Coordinates>>,
    field: keyof Coordinates,
    value: string
  ) => {
    setter(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const swapValues = () => {
    if (mode === 'pedroToRR') {
      // Move RR output to RR input and switch mode
      setRrInput({ x: rrOutput.x, y: rrOutput.y, heading: rrOutput.heading });
      setMode('rrToPedro');
    } else {
      // Move Pedro output to Pedro input and switch mode
      setPedroInput({ x: pedroOutput.x, y: pedroOutput.y, heading: pedroOutput.heading });
      setMode('pedroToRR');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 font-sans selection:bg-orange-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-orange-400 via-zinc-100 to-blue-400 bg-clip-text text-transparent">
              Coordinate Converter
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              FTC utility for Pedro Pathing and Road Runner translation.
            </p>
          </motion.div>
        </header>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800 backdrop-blur-md flex items-center gap-1">
            <button
              onClick={() => setMode('pedroToRR')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                mode === 'pedroToRR' 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              Pedro &rarr; RR
            </button>
            <button
              onClick={() => setMode('rrToPedro')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                mode === 'rrToPedro' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              RR &rarr; Pedro
            </button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {mode === 'pedroToRR' ? (
              <motion.section
                key="pedroToRR"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl border-orange-500/20">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <ChevronRight size={20} />
                      </div>
                      <h2 className="text-xl font-semibold">Pedro &rarr; Road Runner</h2>
                    </div>
                    <button 
                      onClick={swapValues}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all group"
                      title="Swap conversion direction"
                    >
                      <Repeat size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputGroup
                        label="Pedro X"
                        value={pedroInput.x}
                        onChange={(val) => handleInputChange(setPedroInput, 'x', val)}
                        color="orange"
                      />
                      <InputGroup
                        label="Pedro Y"
                        value={pedroInput.y}
                        onChange={(val) => handleInputChange(setPedroInput, 'y', val)}
                        color="orange"
                      />
                      <InputGroup
                        label="Heading"
                        value={pedroInput.heading}
                        onChange={(val) => handleInputChange(setPedroInput, 'heading', val)}
                        color="orange"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                      <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest">Result</div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <OutputGroup 
                        label="RR X" 
                        value={rrOutput.x} 
                        color="orange" 
                        onCopy={() => copyToClipboard(rrOutput.x, 'rrx')}
                        isCopied={copiedField === 'rrx'}
                      />
                      <OutputGroup 
                        label="RR Y" 
                        value={rrOutput.y} 
                        color="orange" 
                        onCopy={() => copyToClipboard(rrOutput.y, 'rry')}
                        isCopied={copiedField === 'rry'}
                      />
                      <OutputGroup 
                        label="RR Heading" 
                        value={rrOutput.heading} 
                        color="orange" 
                        onCopy={() => copyToClipboard(rrOutput.heading, 'rrh')}
                        isCopied={copiedField === 'rrh'}
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        onClick={() => copyToClipboard(`new Pose2d(${rrOutput.x}, ${rrOutput.y}, Math.toRadians(${rrOutput.heading}))`, 'full_rr')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-sm font-medium border border-orange-500/20"
                      >
                        {copiedField === 'full_rr' ? <Check size={16} /> : <Copy size={16} />}
                        Copy as Pose2d
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="rrToPedro"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl border-blue-500/20">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <ChevronRight size={20} />
                      </div>
                      <h2 className="text-xl font-semibold">Road Runner &rarr; Pedro</h2>
                    </div>
                    <button 
                      onClick={swapValues}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all group"
                      title="Swap conversion direction"
                    >
                      <Repeat size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputGroup
                        label="RR X"
                        value={rrInput.x}
                        onChange={(val) => handleInputChange(setRrInput, 'x', val)}
                        color="blue"
                      />
                      <InputGroup
                        label="RR Y"
                        value={rrInput.y}
                        onChange={(val) => handleInputChange(setRrInput, 'y', val)}
                        color="blue"
                      />
                      <InputGroup
                        label="Heading"
                        value={rrInput.heading}
                        onChange={(val) => handleInputChange(setRrInput, 'heading', val)}
                        color="blue"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                      <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest">Result</div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <OutputGroup 
                        label="Pedro X" 
                        value={pedroOutput.x} 
                        color="blue" 
                        onCopy={() => copyToClipboard(pedroOutput.x, 'px')}
                        isCopied={copiedField === 'px'}
                      />
                      <OutputGroup 
                        label="Pedro Y" 
                        value={pedroOutput.y} 
                        color="blue" 
                        onCopy={() => copyToClipboard(pedroOutput.y, 'py')}
                        isCopied={copiedField === 'py'}
                      />
                      <OutputGroup 
                        label="Heading" 
                        value={pedroOutput.heading} 
                        color="blue" 
                        onCopy={() => copyToClipboard(pedroOutput.heading, 'ph')}
                        isCopied={copiedField === 'ph'}
                      />
                    </div>

                    <div className="flex justify-center">
                      <button 
                        onClick={() => copyToClipboard(`new Pose(${pedroOutput.x}, ${pedroOutput.y}, Math.toRadians(${pedroOutput.heading}))`, 'full_p')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-sm font-medium border border-blue-500/20"
                      >
                        {copiedField === 'full_p' ? <Check size={16} /> : <Copy size={16} />}
                        Copy as Pose
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Info */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <Info size={16} />
            <span>Standard 144" Field Dimensions</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span>Pedro Pathing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Road Runner</span>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}

function InputGroup({ label, value, onChange, color }: { label: string; value: string; onChange: (v: string) => void; color: 'orange' | 'blue' }) {
  const focusColor = color === 'orange' ? 'focus:border-orange-500/50 focus:ring-orange-500/10' : 'focus:border-blue-500/50 focus:ring-blue-500/10';
  
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 ml-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none ring-4 ring-transparent transition-all ${focusColor}`}
        placeholder="0.00"
      />
    </div>
  );
}

function OutputGroup({ label, value, color, onCopy, isCopied }: { label: string; value: string; color: 'orange' | 'blue'; onCopy: () => void; isCopied: boolean }) {
  const textColor = color === 'orange' ? 'text-orange-400' : 'text-blue-400';
  const bgColor = color === 'orange' ? 'bg-orange-500/5' : 'bg-blue-500/5';
  const hoverColor = color === 'orange' ? 'hover:bg-orange-500/10' : 'hover:bg-blue-500/10';
  
  return (
    <div className="space-y-2 group/output">
      <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 ml-1">{label}</label>
      <div 
        onClick={onCopy}
        className={`w-full ${bgColor} border border-zinc-800/50 rounded-xl px-4 py-3 font-mono text-lg ${textColor} flex items-center justify-between cursor-pointer transition-all ${hoverColor} active:scale-[0.98]`}
      >
        <span>{value}</span>
        <div className="opacity-0 group-hover/output:opacity-100 transition-opacity">
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </div>
      </div>
    </div>
  );
}
