"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "input" | "shares" | "computing" | "result";

export default function MpcMxeDemo() {
  const [step, setStep] = useState<Step>("input");
  const [inputValue, setInputValue] = useState(42);
  const [mpcFunction, setMpcFunction] = useState<"multiply" | "square" | "add">("multiply");

  const reset = () => setStep("input");

  const calculateResult = () => {
    switch (mpcFunction) {
      case "multiply": return inputValue * 2;
      case "square": return inputValue * inputValue;
      case "add": return inputValue + 100;
      default: return inputValue;
    }
  };

  const getFunctionLabel = () => {
    switch (mpcFunction) {
      case "multiply": return "f(x) = x * 2";
      case "square": return "f(x) = x²";
      case "add": return "f(x) = x + 100";
      default: return "f(x)";
    }
  };

  return (
    <div className="w-full rounded-[1.6rem] border border-outline-variant/25 bg-surface-container-lowest overflow-hidden flex flex-col">
      <div className="border-b border-outline-variant/25 bg-surface-container-low p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Interactive: MPC & MXE Pipeline
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Observe how data is encrypted, split into shares, and computed upon.
          </p>
        </div>
        <button
          onClick={reset}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
        >
          Reset Demo
        </button>
      </div>

      <div className="relative min-h-[550px] p-8 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-black to-black">
        {/* Connection Lines (decorative) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="50%" y1="20%" x2="10%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="50%" y1="20%" x2="30%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="50%" y1="20%" x2="70%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="50%" y1="20%" x2="90%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            
            <line x1="10%" y1="50%" x2="50%" y2="80%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="30%" y1="50%" x2="50%" y2="80%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="70%" y1="50%" x2="50%" y2="80%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="90%" y1="50%" x2="50%" y2="80%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Top: Secret Input */}
        <div className="absolute top-[10%] flex flex-col items-center z-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2 font-bold">User Input (Secret)</div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2">
              <span className="text-primary">x = </span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value) || 0)}
                disabled={step !== "input"}
                className="bg-transparent text-white w-24 outline-none font-mono"
              />
            </div>
            
            <select
              value={mpcFunction}
              onChange={(e) => setMpcFunction(e.target.value as any)}
              disabled={step !== "input"}
              className="bg-surface-container border border-outline-variant/30 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
            >
              <option value="multiply">f(x) = x * 2</option>
              <option value="square">f(x) = x²</option>
              <option value="add">f(x) = x + 100</option>
            </select>
          </div>
          {step === "input" && (
            <button
              onClick={() => setStep("shares")}
              className="mt-4 border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/20 rounded-lg"
            >
              Split into Shares
            </button>
          )}
        </div>

        {/* Middle: Network Nodes holding shares */}
        <div className="absolute top-[45%] w-full flex justify-center gap-4 sm:gap-10 z-10">
          {[1, 2, 3, 4, 5].map((nodeIndex) => (
            <div key={nodeIndex} className="flex flex-col items-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 mb-2 font-bold hidden sm:block">Node {nodeIndex}</div>
              <motion.div
                initial={false}
                animate={{
                  borderColor: step === "shares" || step === "computing" ? "rgba(105, 218, 255, 0.4)" : "rgba(255, 255, 255, 0.1)",
                  backgroundColor: step === "shares" || step === "computing" ? "rgba(105, 218, 255, 0.05)" : "rgba(0, 0, 0, 0.5)",
                }}
                className="w-16 h-16 rounded-xl border border-outline-variant/20 flex items-center justify-center relative overflow-hidden"
              >
                <AnimatePresence>
                  {(step === "shares" || step === "computing") && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-xs font-mono text-primary font-bold"
                    >
                      Share {nodeIndex}
                    </motion.div>
                  )}
                </AnimatePresence>
                {step === "computing" && (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-2 border-transparent border-t-primary/30 rounded-xl"
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>
        
        {step === "shares" && (
          <div className="absolute top-[65%] z-20">
            <button
              onClick={() => {
                setStep("computing");
                setTimeout(() => setStep("result"), 2500);
              }}
              className="border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/20 rounded-lg shadow-[0_0_20px_rgba(105,218,255,0.2)]"
            >
              Compute in MXE
            </button>
          </div>
        )}

        {/* Bottom: MXE / Output */}
        <div className="absolute bottom-[10%] flex flex-col items-center z-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2 font-bold">MXE Result</div>
          <motion.div
            animate={{
              boxShadow: step === "computing" ? "0 0 30px rgba(105, 218, 255, 0.4)" : "0 0 0px rgba(105, 218, 255, 0)",
              borderColor: step === "result" ? "rgba(105, 218, 255, 0.6)" : "rgba(255, 255, 255, 0.2)",
            }}
            className="flex flex-col items-center justify-center bg-surface-container border border-outline-variant/30 rounded-xl px-8 py-4 min-w-[160px] min-h-[80px]"
          >
            {step === "computing" ? (
              <span className="text-primary text-xs font-mono uppercase tracking-widest animate-pulse">Computing...</span>
            ) : step === "result" ? (
              <div className="flex flex-col items-center">
                <span className="text-xs text-on-surface-variant font-mono">{getFunctionLabel()}</span>
                <span className="text-2xl text-white font-bold font-mono mt-1">{calculateResult()}</span>
              </div>
            ) : (
              <span className="text-on-surface-variant/30 text-xs font-mono">Awaiting Input</span>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className="border-t border-outline-variant/25 bg-surface-container-lowest p-5 text-sm text-on-surface-variant leading-relaxed">
        <strong>Takeaway:</strong> The MXE processes the computation blindly. It receives shares from multiple nodes, computes the function (<code className="text-primary bg-primary/10 px-1 rounded mx-1">{getFunctionLabel()}</code>), and returns the result without ever reconstructing the original secret input <code className="text-primary bg-primary/10 px-1 rounded mx-1">x = {inputValue}</code>.
      </div>
    </div>
  );
}
