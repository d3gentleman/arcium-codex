"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NetworkTopologyDemo() {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const nodes = [
    { id: 1, cx: "50%", cy: "15%", label: "Coordinator" },
    { id: 2, cx: "20%", cy: "50%", label: "Compute Node A" },
    { id: 3, cx: "80%", cy: "50%", label: "Compute Node B" },
    { id: 4, cx: "35%", cy: "85%", label: "Verifier 1" },
    { id: 5, cx: "65%", cy: "85%", label: "Verifier 2" },
  ];

  return (
    <div className="w-full rounded-[1.6rem] border border-outline-variant/25 bg-surface-container-lowest overflow-hidden flex flex-col">
      <div className="border-b border-outline-variant/25 bg-surface-container-low p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Interactive: Network Topology
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Click a node to see what it knows and what it verifies.
          </p>
        </div>
        <button
          onClick={() => setActiveNode(null)}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
        >
          Reset View
        </button>
      </div>

      <div className="relative min-h-[450px] p-8 flex flex-col items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-black to-black">
        {/* Connection Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="50%" y1="15%" x2="20%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="50%" y1="15%" x2="80%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="20%" y1="50%" x2="35%" y2="85%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="80%" y1="50%" x2="65%" y2="85%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
            <line x1="35%" y1="85%" x2="65%" y2="85%" stroke="currentColor" className="text-primary" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          const isFaded = activeNode !== null && !isActive;

          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
              style={{ left: node.cx, top: node.cy }}
              onClick={() => setActiveNode(node.id)}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  opacity: isFaded ? 0.4 : 1,
                  borderColor: isActive ? "rgba(105, 218, 255, 0.8)" : "rgba(255, 255, 255, 0.2)",
                  backgroundColor: isActive ? "rgba(105, 218, 255, 0.15)" : "rgba(0, 0, 0, 0.7)",
                }}
                className="w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center transition-colors shadow-lg backdrop-blur-md hover:border-primary/50"
              >
                <div className="text-[10px] font-bold text-center text-white uppercase tracking-wider">{node.label}</div>
              </motion.div>
            </div>
          );
        })}

        {/* Info Panel */}
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: activeNode ? 1 : 0, y: activeNode ? 0 : 10 }}
            className="bg-surface-container/90 backdrop-blur-md border border-primary/30 rounded-xl p-4 shadow-xl"
          >
            {activeNode === 1 && (
              <div>
                <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Coordinator Node</h4>
                <p className="text-sm text-white/90">Routes execution requests and aggregates proofs. It <strong className="text-red-400">does not know</strong> the secret inputs or the raw execution memory.</p>
              </div>
            )}
            {(activeNode === 2 || activeNode === 3) && (
              <div>
                <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Compute Node</h4>
                <p className="text-sm text-white/90">Performs MPC operations on encrypted shares. It <strong className="text-green-400">knows</strong> its own local share but <strong className="text-red-400">does not know</strong> the global secret or other nodes' shares.</p>
              </div>
            )}
            {(activeNode === 4 || activeNode === 5) && (
              <div>
                <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Verifier Node</h4>
                <p className="text-sm text-white/90">Checks cryptographic evidence (ZK proofs). It <strong className="text-green-400">can verify</strong> that computation was done correctly but <strong className="text-red-400">does not know</strong> what the computation data was.</p>
              </div>
            )}
            {activeNode === null && (
              <div>
                <h4 className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-1">Select a Node</h4>
                <p className="text-sm text-on-surface-variant/70">Click on any node in the topology to see its specific responsibilities and knowledge constraints.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className="border-t border-outline-variant/25 bg-surface-container-lowest p-5 text-sm text-on-surface-variant leading-relaxed">
        <strong>Takeaway:</strong> In a confidential network, trust is minimized by distributing knowledge. No single node has the full picture—compute nodes only see fragments of encrypted data, while verifier nodes only see mathematical proofs.
      </div>
    </div>
  );
}
