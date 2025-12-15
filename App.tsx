
import React, { useState, useEffect, useRef } from 'react';
import HexBackground from './components/HexBackground';
import HexCard from './components/HexCard';
import HexButton from './components/HexButton';
import { TIER_PROBABILITIES, ROUND_NAMES, POOLS } from './constants';
import { generateEventNarrative, generateFinalOutcome } from './ai';
import { GameItem, GamePhase, CardSlot, Tier, EventItem, FinalOutcome } from './types';
import { Check, Sparkles, AlertCircle, RefreshCw, ArrowRight, BookOpen, Loader2, Grid, X, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const CARDS_PER_ROUND = 3;

const REPLAY_CONFIG = [
  { label: "选择院校", inventoryIndex: 0 },
  { label: "选择专业", inventoryIndex: 1 },
  { label: "意向岗位", inventoryIndex: 3 }, 
  { label: "实习/业务线", inventoryIndex: 2 } 
];

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('IDLE');
  const [currentSlots, setCurrentSlots] = useState<CardSlot[]>([]);
  const [inventory, setInventory] = useState<GameItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [finalOutcome, setFinalOutcome] = useState<FinalOutcome | null>(null);
  const [roundTier, setRoundTier] = useState<Tier>(Tier.SILVER); 
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null);
  const [loadingText, setLoadingText] = useState<string>("");
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [poolModalTab, setPoolModalTab] = useState<number>(1);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // New state for capture mode
  
  const [seenItemIds, setSeenItemIds] = useState<Set<string>>(new Set());

  const processingRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .clip-path-hextech {
        clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px);
      }
      .clip-path-hextech-sm {
        clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
      }
      .clip-path-button {
        clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      @keyframes float-in {
        0% { transform: translateX(-50px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobileSize = window.innerWidth < 768;
      setIsMobilePortrait(isPortrait && isMobileSize);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  const rollTier = (): Tier => {
    const rand = Math.random();
    if (rand < TIER_PROBABILITIES[Tier.PRISMATIC]) return Tier.PRISMATIC;
    else if (rand < TIER_PROBABILITIES[Tier.PRISMATIC] + TIER_PROBABILITIES[Tier.GOLD]) return Tier.GOLD;
    else return Tier.SILVER;
  };

  const getUniqueRandomItems = (pool: GameItem[], count: number, tier: Tier, currentSessionSeenIds: Set<string>): { items: GameItem[], newSeenIds: Set<string> } => {
    const newSeenIds = new Set(currentSessionSeenIds);
    let candidates = pool.filter(item => item.tier === tier && !newSeenIds.has(item.id));
    if (candidates.length < count) {
        candidates = pool.filter(item => item.tier === tier);
    }
    const selected: GameItem[] = [];
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    for (const item of shuffled) {
        if (selected.length >= count) break;
        selected.push(item);
        newSeenIds.add(item.id);
    }
    return { items: selected, newSeenIds };
  };

  const triggerRoundEvent = async (nextRound: number) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setLoadingText("正在编织命运线...");
    const tier = rollTier();
    setRoundTier(tier);
    setRound(nextRound);
    try {
      const narrative = await generateEventNarrative(nextRound, tier, inventory);
      setCurrentEvent({ text: narrative, tier });
      setPhase('EVENT_REVEAL');
    } catch (error) {
      console.error(error);
      setCurrentEvent({ text: "虚空干扰了命运...", tier });
      setPhase('EVENT_REVEAL');
    } finally {
      setLoadingText("");
      processingRef.current = false;
    }
  };

  const dealCards = () => {
    setPhase('SHUFFLING');
    setSelectedItemId(null);
    setTimeout(() => {
        let currentPool = POOLS[round] || [];
        const result = getUniqueRandomItems(currentPool, CARDS_PER_ROUND, roundTier, seenItemIds);
        setSeenItemIds(prev => new Set([...prev, ...Array.from(result.newSeenIds)]));
        const newSlots: CardSlot[] = result.items.map(item => ({
            item: item,
            hasRerolled: false,
            isLocked: false
        }));
        setCurrentSlots(newSlots);
        setPhase('DEALING');
        setTimeout(() => setPhase('SELECTION'), 500);
    }, 1000);
  };

  const handleRerollCard = (index: number) => {
    if (phase !== 'SELECTION') return;
    const slot = currentSlots[index];
    if (slot.hasRerolled) return;
    const currentPool = POOLS[round] || [];
    const result = getUniqueRandomItems(currentPool, 1, roundTier, seenItemIds);
    const newItem = result.items[0];
    if (newItem) {
        setSeenItemIds(prev => new Set([...prev, newItem.id]));
        const newSlots = [...currentSlots];
        newSlots[index] = { item: newItem, hasRerolled: true, isLocked: false };
        setCurrentSlots(newSlots);
        if (selectedItemId === slot.item.id) setSelectedItemId(null);
    }
  };

  const finishGame = async (finalInventory: GameItem[]) => {
    setPhase('ANALYZING');
    setLoadingText("HR 正在根据大数据演算您的最终去向...");
    try {
      const result = await generateFinalOutcome(finalInventory);
      setFinalOutcome(result);
      setPhase('FINISHED');
    } catch (error) {
       console.error(error);
       setFinalOutcome({
           company: "AI 计算超时",
           position: "未知",
           salary: "???",
           desc: "请重试...",
           tierClass: "text-gray-400"
       });
       setPhase('FINISHED');
    } finally {
      setLoadingText("");
    }
  };

  const handleSaveResult = async () => {
    if (!resultRef.current) return;
    setLoadingText("正在生成简历图片...");
    setIsExporting(true); // Enable export mode (clean CSS)
    
    // Scroll to top to prevent html2canvas offset issues
    window.scrollTo(0, 0);

    try {
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for render
        
        const canvas = await html2canvas(resultRef.current, {
            backgroundColor: '#010a13',
            scale: 2,
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            ignoreElements: (element) => element.classList.contains('no-export')
        });

        const image = canvas.toDataURL("image/png");

        if (navigator.share) {
             try {
                 const blob = await (await fetch(image)).blob();
                 const file = new File([blob], "hextech-offer.png", { type: "image/png" });
                 if (navigator.canShare && navigator.canShare({ files: [file] })) {
                     await navigator.share({
                         title: '我的秋招海克斯Offer',
                         text: `在海克斯大乱斗中，我拿到了 ${finalOutcome?.company} 的Offer！`,
                         files: [file],
                     });
                     return;
                 }
             } catch (err) {
                 console.log("Web Share API skipped", err);
             }
        }
        const link = document.createElement('a');
        link.href = image;
        link.download = `hextech-offer-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Save failed", error);
        alert("图片生成失败，请截图保存");
    } finally {
        setIsExporting(false); // Restore Normal CSS
        setLoadingText("");
    }
  };

  const initiateGame = () => {
    setInventory([]);
    setSeenItemIds(new Set());
    setFinalOutcome(null);
    triggerRoundEvent(1);
  };

  const handleEventConfirm = () => { dealCards(); };
  const handleSelect = (item: GameItem) => { if (phase === 'SELECTION') setSelectedItemId(prev => prev === item.id ? null : item.id); };
  
  const handleConfirmSelection = () => {
    const selectedSlot = currentSlots.find(s => s.item.id === selectedItemId);
    if (!selectedSlot) return;
    const newInventory = [...inventory, selectedSlot.item];
    setInventory(newInventory);
    setPhase('ROUND_TRANSITION');
    if (round < 4) setTimeout(() => triggerRoundEvent(round + 1), 500);
    else finishGame(newInventory);
  };

  const renderPoolItems = () => {
    const pool = POOLS[poolModalTab] || [];
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto h-[60vh] hide-scrollbar">
        {pool.map((item) => (
           <div key={item.id} className={`relative p-1 rounded bg-[#091428] border ${item.tier === Tier.PRISMATIC ? 'border-teal-400' : item.tier === Tier.GOLD ? 'border-[#C89B3C]' : 'border-gray-500'}`}>
              <img src={item.imageUrl} className="w-full h-24 object-cover mb-2 rounded-sm" />
              <div className={`text-xs font-bold ${item.tier === Tier.PRISMATIC ? 'text-teal-400' : item.tier === Tier.GOLD ? 'text-[#C89B3C]' : 'text-gray-300'}`}>{item.name}</div>
              <div className="text-[10px] text-gray-500">{item.tier} - {item.subTitle}</div>
           </div>
        ))}
      </div>
    );
  };

  const containerClass = isMobilePortrait 
    ? "fixed inset-0 w-[100vh] h-[100vw] rotate-90 origin-top-left left-[100vw] overflow-hidden bg-[#010a13] font-sans flex"
    : "relative w-full h-screen overflow-hidden flex bg-[#010a13] font-sans";

  return (
    <div className={containerClass}>
      <HexBackground />

      {loadingText && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative">
             <div className="w-24 h-24 border-4 border-[#C89B3C]/30 border-t-[#C89B3C] rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#0AC8B9] animate-pulse" />
             </div>
          </div>
          <div className="mt-6 text-[#F0E6D2] font-mono tracking-widest uppercase text-sm animate-pulse">
            {loadingText}
          </div>
        </div>
      )}

      {showPoolModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="w-[90%] max-w-5xl bg-[#010a13] border border-[#C89B3C] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-[#C89B3C]/30 flex justify-between items-center bg-[#091428]">
                 <h2 className="text-[#C89B3C] text-lg font-bold uppercase tracking-widest">全卡池图鉴</h2>
                 <button onClick={() => setShowPoolModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex border-b border-[#C89B3C]/30">
                 {[1, 2, 3, 4].map(r => (
                    <button key={r} onClick={() => setPoolModalTab(r)} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${poolModalTab === r ? 'bg-[#C89B3C] text-black' : 'bg-transparent text-gray-400 hover:text-[#C89B3C]'}`}>
                      {ROUND_NAMES[r-1].split('：')[1]}
                    </button>
                 ))}
              </div>
              {renderPoolItems()}
           </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-40">
        <button onClick={() => setShowPoolModal(true)} className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 bg-[#091428]/80 border border-[#0AC8B9]/30 rounded text-[#0AC8B9] hover:bg-[#0AC8B9]/10 transition-colors text-[10px] md:text-xs uppercase tracking-widest">
          <Grid className="w-3 h-3 md:w-4 md:h-4" />
          <span>图鉴</span>
        </button>
      </div>

      {/* 
        SIDEBAR LEFT 
        Narrower on mobile (w-24) to keep unobtrusive.
        Cards are kept small.
      */}
      <div className="h-full w-24 md:w-56 bg-[#010a13]/90 border-r border-[#C89B3C]/30 flex flex-col relative shrink-0 z-30 transition-all">
           <div className="absolute inset-0 bg-gradient-to-b from-[#0AC8B9]/10 to-transparent pointer-events-none" />
           <div className="p-2 md:p-4 flex items-center gap-2 text-[#C89B3C] border-b border-white/5 justify-center md:justify-start">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest">我的简历</h2>
           </div>
           <div className="flex-1 flex flex-col gap-2 md:gap-3 p-2 md:p-3 overflow-y-auto hide-scrollbar items-center md:items-stretch">
              {inventory.map((item, idx) => (
                  <div key={item.id} className="relative animate-[float-in_0.5s_ease-out] w-full flex justify-center md:block">
                      <HexCard 
                         item={item} 
                         index={idx} 
                         isSelected={false} 
                         canReroll={false} 
                         onSelect={() => {}} 
                         onReroll={() => {}} 
                         disabled={true} 
                         isSmall={true} 
                      />
                      <div className="absolute top-0 left-0 md:left-0 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[8px] text-gray-400 font-mono pointer-events-none">
                        {idx + 1}
                      </div>
                  </div>
              ))}
              {Array.from({ length: 4 - inventory.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-[60px] h-[90px] md:w-full md:aspect-[3/4] md:h-auto rounded-lg border border-dashed border-[#C89B3C]/20 bg-white/5 flex flex-col items-center justify-center opacity-50 shrink-0">
                      <div className="text-[#C89B3C]/50 font-bold text-[8px] md:text-[10px] text-center px-1">
                         {ROUND_NAMES[inventory.length + i].split('：')[1]}
                      </div>
                  </div>
              ))}
           </div>
      </div>

      {/* MAIN STAGE */}
      <div className="flex-1 h-full flex flex-col relative z-20 overflow-hidden">
          <div className="flex-1 flex flex-col w-full h-full relative">
              {phase !== 'FINISHED' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4">
                      <div className={`text-center mb-2 md:mb-8 transition-all duration-700 ${phase === 'IDLE' ? 'scale-125' : 'scale-100'}`}>
                          <h1 className="text-xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F0E6D2] to-[#C89B3C] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                              秋招海克斯大乱斗
                          </h1>
                          <p className="text-[#0AC8B9] tracking-[0.3em] text-[10px] md:text-xs uppercase font-semibold mt-1 md:mt-2">
                              {phase === 'IDLE' ? '模拟启动中...' : ROUND_NAMES[round - 1]}
                          </p>
                          {phase === 'SELECTION' && (
                            <div className={`text-[10px] md:text-xs mt-1 font-bold tracking-widest uppercase opacity-80 ${roundTier === Tier.PRISMATIC ? 'text-teal-400' : roundTier === Tier.GOLD ? 'text-[#C89B3C]' : 'text-slate-400'}`}>
                              当前回合品质: {roundTier}
                            </div>
                          )}
                      </div>

                      {phase === 'IDLE' && (
                          <div className="animate-pulse flex flex-col items-center gap-4 md:gap-8">
                              <div className="text-gray-400 text-xs md:text-lg max-w-xl text-center leading-relaxed px-4">
                                  选择你的出身、专业、职业与命运。<br/>
                                  命运事件与最终Offer由 AI 实时生成。<br/>
                                  <span className="text-[#C89B3C]">祝你好运，打工人。</span>
                              </div>
                              <HexButton onClick={initiateGame} className="text-base md:text-xl px-10 py-3">开启秋招</HexButton>
                          </div>
                      )}

                      {phase === 'EVENT_REVEAL' && currentEvent && (
                          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out] p-4">
                              <div className="relative w-full max-w-xl">
                                  <div className="relative z-10 p-6 md:p-10 flex flex-col items-center text-center clip-path-hextech bg-gradient-to-b from-[#1a2c42] to-[#091428] border-2 border-[#0AC8B9]/30 box-shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                                      <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-[#0AC8B9] mb-4" />
                                      <h3 className="text-[#0AC8B9] text-xs uppercase tracking-[0.2em] mb-2 opacity-80">命运事件</h3>
                                      <div className="text-lg md:text-2xl font-bold mb-6 text-white/90 leading-relaxed font-serif">"{currentEvent.text}"</div>
                                      <HexButton onClick={handleEventConfirm}>接受命运</HexButton>
                                  </div>
                              </div>
                          </div>
                      )}

                      {(phase === 'SELECTION' || phase === 'DEALING') && (
                          <div className="flex flex-col items-center w-full max-w-6xl gap-4 md:gap-8">
                              <div className="flex flex-row gap-4 md:gap-8 items-center justify-center w-full">
                                  {currentSlots.map((slot, index) => (
                                      <HexCard 
                                          key={`${slot.item.id}-${index}`}
                                          item={slot.item}
                                          index={index}
                                          isSelected={selectedItemId === slot.item.id}
                                          canReroll={!slot.hasRerolled}
                                          onSelect={handleSelect}
                                          onReroll={handleRerollCard}
                                          disabled={phase !== 'SELECTION'}
                                      />
                                  ))}
                              </div>

                              <div className="h-16 w-full flex flex-col items-center justify-start relative">
                                  <div className={`absolute top-0 transition-all duration-500 transform ${selectedItemId ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                                      <HexButton onClick={handleConfirmSelection} disabled={!selectedItemId} className="min-w-[150px] md:min-w-[180px] text-sm md:text-base px-6 md:px-8 py-2">
                                          <div className="flex items-center gap-2"><span>确认选择</span><Check className="w-4 h-4" /></div>
                                      </HexButton>
                                  </div>
                                  <div className={`absolute top-2 md:top-4 pointer-events-none transition-all duration-500 transform ${!selectedItemId && phase === 'SELECTION' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                                      <div className="text-[#0AC8B9] animate-bounce text-[10px] md:text-sm tracking-widest uppercase flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-full border border-[#0AC8B9]/30">
                                          <AlertCircle className="w-3 h-3" />
                                          请选择一个{ROUND_NAMES[round - 1].split('：')[1]}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {/* FINISHED STATE */}
              {phase === 'FINISHED' && finalOutcome && (
                  <div className="flex-1 flex flex-col items-center h-full w-full p-2 md:p-6 animate-[fadeIn_0.8s_ease-out] overflow-hidden">
                      
                      {/* Capture Area */}
                      <div 
                         ref={resultRef} 
                         className={`
                           flex-1 w-full max-w-5xl flex flex-col items-center justify-center 
                           gap-1 md:gap-8 rounded-xl relative p-2 md:p-8 
                           ${isExporting ? 'bg-[#010a13] border-none' : ''}
                           /* IMPORTANT: Remove flex centering for export to prevent offset */
                           ${isExporting ? 'block' : 'flex'}
                         `}
                         style={isExporting ? { width: '800px', height: '600px', margin: '0 auto', padding: '40px', display: 'flex' } : {}}
                      >
                            <div className="text-center shrink-0 mb-1 md:mb-4 w-full">
                                <h1 className="text-xl md:text-4xl font-bold tracking-tighter text-[#C89B3C] mb-0.5">秋招海克斯大乱斗</h1>
                                <p className="text-[#0AC8B9] text-[8px] md:text-xs tracking-[0.4em] font-bold uppercase">最终OFFER判定</p>
                            </div>

                            {/* Result Card */}
                            <div className={`w-full max-w-2xl border border-white/10 rounded-xl p-3 md:p-8 flex flex-col items-center text-center shadow-2xl ${isExporting ? 'bg-[#0f172a]' : 'bg-[#0f172a]/80 backdrop-blur-md'}`}>
                                <div className="text-gray-400 text-[8px] md:text-xs tracking-[0.2em] uppercase mb-1 md:mb-4">最终去向 (AI JUDGE)</div>
                                
                                {/* Company Name: Fallback to solid color on export to fix html2canvas glitch */}
                                <div className={`text-2xl md:text-6xl font-black mb-1 md:mb-3 leading-tight ${
                                    isExporting 
                                      ? finalOutcome.tierClass.includes('teal') ? 'text-teal-400' : 'text-purple-400'
                                      : finalOutcome.tierClass === 'text-teal-400' ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-white to-teal-300 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]' : finalOutcome.tierClass
                                }`}>
                                    {finalOutcome.company}
                                </div>
                                
                                <div className="text-lg md:text-2xl text-white font-bold mb-1 md:mb-6 tracking-wide leading-tight">
                                    {finalOutcome.position}
                                </div>
                                
                                <div className="inline-block px-2 py-0.5 md:px-4 md:py-1.5 border border-[#C89B3C] text-[#C89B3C] rounded text-[10px] md:text-base font-bold mb-1 md:mb-6 bg-[#C89B3C]/10">
                                    {finalOutcome.salary.includes('总包') ? finalOutcome.salary : `总包：${finalOutcome.salary}`}
                                </div>
                                
                                <div className="text-gray-300 italic text-[10px] md:text-base font-serif max-w-lg leading-relaxed px-2 line-clamp-3 md:line-clamp-none">
                                    "{finalOutcome.desc}"
                                </div>
                            </div>

                            {/* Resume Replay */}
                            <div className={`w-full max-w-4xl border border-[#C89B3C]/20 rounded-xl p-2 md:p-6 relative mt-1 md:mt-0 ${isExporting ? 'bg-[#000]' : 'bg-[#000]/40'}`}>
                                <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 px-4 bg-[#010a13] text-[#C89B3C] text-[8px] md:text-xs font-bold tracking-widest uppercase">
                                    履历复盘
                                </div>
                                <div className="w-full grid grid-cols-4 gap-1 md:gap-4 mt-1 md:mt-2">
                                    {REPLAY_CONFIG.map((config, idx) => {
                                        const item = inventory[config.inventoryIndex];
                                        if (!item) return null;
                                        return (
                                            <div key={idx} className="relative flex items-center">
                                                <div className={`flex-1 border border-white/5 rounded p-1 md:p-3 flex flex-col gap-0.5 md:gap-1 min-w-0 h-full justify-center ${isExporting ? 'bg-[#1e293b]' : 'bg-[#1e293b]/60'}`}>
                                                    <div className="text-[6px] md:text-[10px] text-gray-500 uppercase tracking-wider truncate">{config.label}</div>
                                                    <div className={`font-bold text-[8px] md:text-sm leading-tight truncate ${item.tier === Tier.PRISMATIC ? 'text-teal-400' : item.tier === Tier.GOLD ? 'text-[#C89B3C]' : 'text-gray-300'}`}>{item.name}</div>
                                                    <div className="text-[6px] md:text-[10px] text-gray-500 truncate">{item.subTitle}</div>
                                                </div>
                                                {idx < REPLAY_CONFIG.length - 1 && (
                                                    <div className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 text-gray-600">
                                                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {isExporting && <div className="absolute bottom-2 right-2 text-[8px] text-gray-700">Generated by Hextech Destiny</div>}
                      </div>

                      {/* Action Buttons (Hidden during export) */}
                      <div className="mt-1 md:mt-4 shrink-0 flex gap-4 no-export">
                           <HexButton onClick={initiateGame} className="px-4 py-1.5 md:px-8 md:py-3 text-xs md:text-base">
                               <div className="flex items-center gap-2">
                                   <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                                   <span>再来一局</span>
                               </div>
                           </HexButton>
                           <HexButton onClick={handleSaveResult} variant="secondary" className="px-4 py-1.5 md:px-8 md:py-3 text-xs md:text-base">
                               <div className="flex items-center gap-2">
                                   <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                                   <span>保存 / 分享</span>
                               </div>
                           </HexButton>
                      </div>

                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default App;
