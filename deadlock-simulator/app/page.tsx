import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20 text-xl">
              D
            </div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              DEADLOCK<br /><span className="text-blue-500 text-sm tracking-widest">SIMULATOR</span>
            </h1>
          </div>
          <Link href="/simulator" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            Launch Simulator
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Decorations */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Banker's Algorithm</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            An interactive, visual tool designed to help operating systems students and professionals understand resource allocation, deadlock avoidance, and safe state execution sequences.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/simulator" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 text-lg flex items-center gap-2">
              Start Visualizing
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </Link>
          </div>
        </div>

        {/* Section 1: What is this tool? */}
        <section className="relative py-24 border-t border-slate-800 bg-[#0f172a] z-10 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 -translate-y-1/2 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Interactive Sandbox
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Visualize OS Resource Allocation
              </h2>
              <div className="space-y-6 text-lg text-slate-400">
                <p>
                  The Deadlock Simulator is a powerful educational tool designed specifically for Operating Systems students, educators, and software engineers. It bridges the gap between theoretical textbook concepts and practical, visual understanding.
                </p>
                <p>
                  Instead of manually crunching numbers on paper to find out if a system will deadlock, you can input your own <strong className="text-slate-200 font-semibold">Allocation</strong>, <strong className="text-slate-200 font-semibold">Max Demand</strong>, and <strong className="text-slate-200 font-semibold">Available Resources</strong> matrices.
                </p>
                <p>
                  The tool dynamically generates a Force-Directed Resource Allocation Graph, visually connecting processes to their held and requested resources. It provides a real-time, step-by-step breakdown of how the operating system evaluates resource requests.
                </p>
              </div>
            </div>
            
            {/* Graphic side */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-3xl rounded-full pointer-events-none"></div>
              <div className="relative bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl">
                {/* Mockup of Matrix / Nodes */}
                <div className="flex flex-col gap-6">
                  {/* Nodes mockup */}
                  <div className="flex justify-center items-center gap-8 py-8 border-b border-slate-700 border-dashed">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">P1</div>
                    <div className="flex flex-col gap-2 items-center">
                       <svg className="w-12 h-6 text-slate-500" fill="none" viewBox="0 0 48 24"><path stroke="currentColor" strokeDasharray="4 4" strokeWidth="2" d="M0 12h40m-8-6l8 6-8 6"/></svg>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Requests</span>
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">R1</div>
                  </div>
                  {/* Matrix mockup */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 mb-2 font-semibold">ALLOCATION</div>
                      <div className="text-lg text-white font-mono">0 1 0</div>
                    </div>
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 mb-2 font-semibold">MAX</div>
                      <div className="text-lg text-white font-mono">2 2 2</div>
                    </div>
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-500 mb-2 font-semibold">NEED</div>
                      <div className="text-lg text-blue-400 font-mono">2 1 2</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Banker's Algorithm */}
        <section className="relative py-24 border-t border-slate-800 bg-gradient-to-b from-[#1e293b]/40 to-[#0f172a] z-10 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            {/* Graphic side - Left on large screens */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/10 to-orange-600/10 blur-3xl rounded-full pointer-events-none"></div>
              <div className="relative bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Bank vault graphic */}
                <div className="p-8 bg-slate-800/50 border-b border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-amber-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      Bank Vault (Available)
                    </span>
                    <span className="text-white font-mono text-xl font-black tracking-widest">3 3 2</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
                    <div className="w-1/3 bg-amber-500 border-r border-slate-900"></div>
                    <div className="w-1/3 bg-amber-500 border-r border-slate-900"></div>
                    <div className="w-[20%] bg-amber-500"></div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {/* Customer 1 */}
                  <div className="flex items-center justify-between bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">P0</div>
                      <span className="text-slate-400 text-sm">Needs: <span className="font-mono text-white ml-2 tracking-widest">7 4 3</span></span>
                    </div>
                    <span className="px-3 py-1.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded uppercase tracking-wider border border-red-500/20">Wait</span>
                  </div>
                  {/* Customer 2 */}
                  <div className="flex items-center justify-between bg-slate-800/30 p-4 rounded-xl border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">P1</div>
                      <span className="text-slate-400 text-sm">Needs: <span className="font-mono text-white ml-2 tracking-widest">1 2 2</span></span>
                    </div>
                    <span className="px-3 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase tracking-wider border border-green-500/20">Grant Resources</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                Deadlock Avoidance
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                The Banker's Algorithm Explained
              </h2>
              <div className="space-y-6 text-lg text-slate-400">
                <p>
                  Developed by <strong className="text-slate-200">Edsger Dijkstra</strong> in 1965, the Banker's Algorithm is a strategy used by operating systems to safely allocate resources without falling into a deadlock.
                </p>
                <p>
                  It gets its name from a banking analogy: A bank (the OS) has a finite amount of cash (resources). It has several customers (processes) who have a credit limit (max demand). The bank must ensure that it never lends out money in such a way that it can't satisfy the maximum needs of at least one customer.
                </p>
                <p>
                  Before granting a process's request, the algorithm simulates the allocation and checks if the system remains in a <strong className="text-green-400 font-semibold">Safe State</strong>. A state is safe if there is a sequence of processes where each can receive its required resources, finish its execution, and return the resources to the pool, guaranteeing no deadlocks occur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Why use our simulator?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Dynamic RAG", desc: "Instantly generates a Force-Directed Resource Allocation Graph to visualize system state.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { title: "Step-by-Step Execution", desc: "Watch the algorithm process each step and check needs against available resources.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Safe Sequence Detection", desc: "Automatically calculates and displays valid execution paths to avoid deadlocks.", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" }
            ].map((f, i) => (
              <div key={i} className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors shadow-lg">
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center mb-4 text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                </div>
                <h4 className="text-xl font-bold text-slate-200 mb-2">{f.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#0f172a] py-8 text-center text-slate-500 relative z-10 flex flex-col items-center justify-center gap-2">
        <p className="text-sm">Deadlock Simulator • Operating Systems Lab Visualization Tool</p>
        <p className="text-sm">
          Created by{" "}
          <a 
            href="https://github.com/panderajkiran" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
          >
            panderajkiran
          </a>
        </p>
      </footer>
    </div>
  );
}
