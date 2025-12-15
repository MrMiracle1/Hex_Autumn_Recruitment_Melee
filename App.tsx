
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
  
  // Track seen IDs to avoid duplicates in a single game
  const [seenItemIds, setSeenItemIds] = useState<Set<string>>(new Set());

  const processingRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject styles
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

    // Orientation Check
    const checkOrientation = () => {
      // Treat as mobile if width < 768 and height > width (portrait)
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

  /**
   * Helper: Get unique random items of a specific Tier from a Pool
   */
  const getUniqueRandomItems = (pool: GameItem[], count: number, tier: Tier, currentSessionSeenIds: Set<string>): { items: GameItem[], newSeenIds: Set<string> } => {
    const newSeenIds = new Set(currentSessionSeenIds);
    
    // Filter by Tier and Unseen
    let candidates = pool.filter(item => item.tier === tier && !newSeenIds.has(item.id));
    
    // Fallback if not enough cards
    if (candidates.length < count) {
        candidates = pool.filter(item => item.tier === tier); // Reset seen filter
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

  // 1. Trigger Event (AI Generated)
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

  // 2. Deal Cards (Local)
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
        
        setTimeout(() => {
            setPhase('SELECTION');
        }, 500);
    }, 1000);
  };

  // 3. Reroll (Local)
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
        newSlots[index] = {
            item: newItem,
            hasRerolled: true,
            isLocked: false
        };
        setCurrentSlots(newSlots);
        if (selectedItemId === slot.item.id) setSelectedItemId(null);
    }
  };

  // 4. Finish Game (AI Generated)
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

  // 5. Save/Share Result
  const handleSaveResult = async () => {
    if (!resultRef.current) return;
    setLoadingText("正在生成简历图片...");
    
    try {
        // Wait for fonts/layout
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(resultRef.current, {
            backgroundColor: '#010a13',
            scale: 2, // High quality
            useCORS: true,
            logging: false
        });

        const image = canvas.toDataURL("image/png");

        // Try Web Share API (Mobile)
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
                     setLoadingText("");
                     return;
                 }
             } catch (err) {
                 console.log("Web Share API skipped", err);
             }
        }

        // Fallback: Download
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
        setLoadingText("");
    }
  };

  const initiateGame = () => {
    setInventory([]);
    setSeenItemIds(new Set());
    setFinalOutcome(null);
    triggerRoundEvent(1);
  };

  const handleEventConfirm = () => {
    dealCards();
  };

  const handleSelect = (item: GameItem) => {
    if (phase !== 'SELECTION') return;
    setSelectedItemId(prev => prev === item.id ? null : item.id);
  };

  const handleConfirmSelection = () => {
    const selectedSlot = currentSlots.find(s => s.item.id === selectedItemId);
    if (!selectedSlot) return;

    const newInventory = [...inventory, selectedSlot.item];
    setInventory(newInventory);
    setPhase('ROUND_TRANSITION');

    if (round < 4) {
      setTimeout(() => triggerRoundEvent(round + 1), 500);
    } else {
      finishGame(newInventory);
    }
  };

  // Pool Modal Helpers
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

  // Mobile Landscape Rotation Style
  // If Portrait Mobile: Rotate 90deg, width becomes height (100vh), height becomes width (100vw).
  // Position absolutely left: 100vw (so it starts at the right edge and rotates down-left)
  // Origin top-left.
  const containerClass = isMobilePortrait 
    ? "fixed inset-0 w-[100vh] h-[100vw] rotate-90 origin-top-left left-[100vw] overflow-hidden bg-[#010a13] font-sans"
    : "relative w-full h-screen overflow-hidden flex bg-[#010a13] font-sans";

  return (
    <div className={containerClass}>
      <HexBackground />

      {/* Loading Overlay */}
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

      {/* Pool Modal */}
      {showPoolModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="w-[90%] max-w-5xl bg-[#010a13] border border-[#C89B3C] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-[#C89B3C]/30 flex justify-between items-center bg-[#091428]">
                 <h2 className="text-[#C89B3C] text-lg font-bold uppercase tracking-widest">全卡池图鉴</h2>
                 <button onClick={() => setShowPoolModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex border-b border-[#C89B3C]/30">
                 {[1, 2, 3, 4].map(r => (
                    <button 
                      key={r} 
                      onClick={() => setPoolModalTab(r)}
                      className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${poolModalTab === r ? 'bg-[#C89B3C] text-black' : 'bg-transparent text-gray-400 hover:text-[#C89B3C]'}`}
                    >
                      {ROUND_NAMES[r-1].split('：')[1]}
                    </button>
                 ))}
              </div>
              {renderPoolItems()}
           </div>
        </div>
      )}

      {/* View Pool Button */}
      <div className="absolute top-4 right-4 z-40">
        <button 
          onClick={() => setShowPoolModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#091428]/80 border border-[#0AC8B9]/30 rounded text-[#0AC8B9] hover:bg-[#0AC8B9]/10 transition-colors text-xs uppercase tracking-widest"
        >
          <Grid className="w-4 h-4" />
          <span>查看图鉴</span>
        </button>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        
        {/* Sidebar: Inventory */}
        <div className="w-full md:w-72 h-36 md:h-full bg-[#010a13]/90 border-r border-[#C89B3C]/30 flex flex-col p-4 relative shrink-0 z-30 transition-all duration-500">
             <div className="absolute inset-0 bg-gradient-to-b from-[#0AC8B9]/10 to-transparent pointer-events-none" />
             
             <div className="flex items-center gap-2 mb-4 text-[#C89B3C]">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-bold uppercase tracking-widest">
                    我的简历
                </h2>
             </div>

             <div className="flex-1 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible items-center md:items-start hide-scrollbar pr-4">
                {inventory.map((item, idx) => (
                    <div key={item.id} className="animate-[float-in_0.5s_ease-out] relative group shrink-0">
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
                        <div className="absolute -left-2 top-4 text-white/10 font-bold text-4xl select-none z-0">
                            {idx + 1}
                        </div>
                    </div>
                ))}
                
                {Array.from({ length: 4 - inventory.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-[110px] h-[160px] border border-dashed border-[#C89B3C]/30 bg-[#000]/20 flex flex-col gap-2 items-center justify-center clip-path-hextech-sm opacity-40 shrink-0">
                        <div className="text-[#C89B3C]/50 font-bold text-sm">
                           {ROUND_NAMES[inventory.length + i].split('：')[1]}
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* Main Stage */}
        <div className="flex-1 flex flex-col items-center justify-start md:justify-center relative p-4 overflow-y-auto">
            
            {/* Header */}
            <div className={`transition-all duration-700 mt-8 mb-8 text-center z-20 shrink-0 ${phase === 'IDLE' ? 'scale-125 mt-20' : 'scale-100'}`}>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F0E6D2] to-[#C89B3C] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    秋招海克斯大乱斗
                </h1>
                <p className="text-[#0AC8B9] tracking-[0.3em] text-xs uppercase font-semibold mt-2">
                    {phase === 'IDLE' ? '模拟启动中...' : phase === 'FINISHED' ? '最终Offer判定' : ROUND_NAMES[round - 1]}
                </p>
                {phase === 'SELECTION' && (
                  <div className={`text-xs mt-2 font-bold tracking-widest uppercase opacity-80 ${roundTier === Tier.PRISMATIC ? 'text-teal-400' : roundTier === Tier.GOLD ? 'text-[#C89B3C]' : 'text-slate-400'}`}>
                    当前回合品质: {roundTier}
                  </div>
                )}
            </div>

            {/* Content Container */}
            <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[400px]">
            
                {/* IDLE STATE */}
                {phase === 'IDLE' && (
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="text-gray-400 text-sm max-w-md text-center mb-8 px-4 leading-relaxed">
                            选择你的出身、专业、职业与命运。<br/>
                            命运事件与最终Offer由 AI 实时生成。<br/>
                            <span className="text-[#C89B3C]">祝你好运，打工人。</span>
                        </div>
                        <HexButton onClick={initiateGame} className="text-xl px-12 py-4">
                            开启秋招
                        </HexButton>
                    </div>
                )}

                {/* EVENT REVEAL STATE */}
                {phase === 'EVENT_REVEAL' && currentEvent && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
                        <div className="relative w-full max-w-lg mx-4">
                             {/* Mystery Frame */}
                             <div className="absolute inset-0 bg-[#091428] clip-path-hextech opacity-95 border border-[#0AC8B9]/50" />
                             <div className="relative z-10 p-8 flex flex-col items-center text-center clip-path-hextech bg-gradient-to-b from-[#1a2c42] to-[#091428] border-2 border-[#0AC8B9]/30 box-shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                                  <div className="mb-4 p-3 rounded-full border-2 border-[#0AC8B9]/30 bg-[#0AC8B9]/10">
                                      <BookOpen className="w-8 h-8 text-[#0AC8B9]" />
                                  </div>
                                  <h3 className="text-[#0AC8B9] text-sm uppercase tracking-[0.2em] mb-4 opacity-80">命运事件</h3>
                                  <div className="text-xl md:text-2xl font-bold mb-8 text-white/90 leading-relaxed font-serif">
                                      "{currentEvent.text}"
                                  </div>
                                  <HexButton onClick={handleEventConfirm} className="w-full">
                                      接受命运
                                  </HexButton>
                             </div>
                        </div>
                    </div>
                )}

                {/* CARDS STATE (DEALING or SELECTION) */}
                {(phase === 'SELECTION' || phase === 'DEALING') && (
                    <div className="flex flex-col items-center w-full max-w-6xl">
                        <div className="flex flex-col md:flex-row gap-4 lg:gap-8 items-center justify-center perspective-1000 scale-90 md:scale-100">
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

                        {/* Controls */}
                        <div className="mt-8 h-32 w-full flex flex-col items-center justify-start relative shrink-0">
                            {/* Confirm Button */}
                            <div className={`absolute top-0 transition-all duration-500 transform ${selectedItemId ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                                <HexButton onClick={handleConfirmSelection} disabled={!selectedItemId} className="min-w-[200px]">
                                    <div className="flex items-center gap-2">
                                        <span>确认选择</span>
                                        <Check className="w-5 h-5" />
                                    </div>
                                </HexButton>
                            </div>
                            
                            {/* Instruction */}
                            <div className={`absolute top-4 pointer-events-none transition-all duration-500 transform ${!selectedItemId && phase === 'SELECTION' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                                <div className="text-[#0AC8B9] animate-bounce text-sm tracking-widest uppercase flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-[#0AC8B9]/30">
                                    <AlertCircle className="w-4 h-4" />
                                    请选择一个{ROUND_NAMES[round - 1].split('：')[1]}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FINISHED STATE */}
                {phase === 'FINISHED' && finalOutcome && (
                    <div className="animate-[fadeIn_1s_ease-in] text-center flex flex-col items-center w-full max-w-4xl px-4 pb-12">
                        
                        {/* Capture Area */}
                        <div ref={resultRef} className="w-full flex flex-col items-center p-8 rounded-xl bg-[#010a13] relative overflow-hidden">
                            {/* Decorative Background for Capture */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#091428] to-[#010a13] opacity-100 z-0 pointer-events-none" />
                            <div className="absolute inset-0 z-0 bg-[url('https://raw.githubusercontent.com/yomotsu/camera-controls/master/examples/textures/smoke.png')] bg-cover opacity-10" />

                            <div className="relative z-10 w-full flex flex-col items-center">
                                {/* Header Logo for Image */}
                                <div className="mb-8 text-center">
                                    <h1 className="text-2xl font-bold tracking-tighter text-[#C89B3C] uppercase">
                                        秋招海克斯大乱斗
                                    </h1>
                                    <div className="text-[#0AC8B9] text-[10px] tracking-[0.3em] uppercase">
                                        Hextech Career Simulation
                                    </div>
                                </div>

                                <div className="mb-6 bg-black/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full max-w-3xl shadow-2xl relative">
                                        <div className="text-gray-400 text-sm tracking-widest uppercase mb-4">最终去向 (AI Judge)</div>
                                        <div className={`text-4xl md:text-6xl font-black ${finalOutcome.tierClass} drop-shadow-2xl mb-2 font-serif`}>
                                            {finalOutcome.company}
                                        </div>
                                        <div className="text-xl md:text-2xl text-white font-bold mb-4">
                                            {finalOutcome.position}
                                        </div>
                                        <div className="inline-block px-4 py-1 bg-[#C89B3C]/20 border border-[#C89B3C] text-[#C89B3C] rounded mb-6 font-mono">
                                            {finalOutcome.salary}
                                        </div>
                                        <div className="text-lg text-gray-300 font-light italic max-w-2xl mx-auto">
                                            "{finalOutcome.desc}"
                                        </div>
                                </div>

                                {/* Resume Path */}
                                <div className="w-full max-w-3xl mb-4 bg-black/40 p-6 rounded-xl border border-[#C89B3C]/20 relative">
                                    <h3 className="text-[#C89B3C] font-bold mb-4 uppercase text-sm tracking-widest text-left">履历复盘</h3>
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center text-left">
                                        {inventory.map((item, idx) => (
                                            <React.Fragment key={item.id}>
                                                <div className="flex flex-col gap-1 items-center md:items-start p-3 rounded bg-white/5 w-full md:w-auto border border-white/5">
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                        {ROUND_NAMES[idx].split('：')[1]}
                                                    </div>
                                                    <div className={`font-bold text-sm ${item.tier === Tier.PRISMATIC ? 'text-teal-400' : item.tier === Tier.GOLD ? 'text-[#C89B3C]' : 'text-gray-300'}`}>
                                                        {item.name}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">
                                                        {item.subTitle}
                                                    </div>
                                                </div>
                                                {idx < inventory.length - 1 && (
                                                    <ArrowRight className="text-gray-600 rotate-90 md:rotate-0 w-4 h-4" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mt-4 text-gray-600 text-xs tracking-widest uppercase">
                                    Created with Hextech Destiny Engine
                                </div>
                            </div>
                        </div>

                        {/* Buttons (Outside Capture) */}
                        <div className="flex gap-4 mt-8">
                            <HexButton onClick={initiateGame} variant="primary">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    <span>再来一局</span>
                                </div>
                            </HexButton>
                            
                            <HexButton onClick={handleSaveResult} variant="secondary">
                                <div className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    <span>保存 / 分享</span>
                                </div>
                            </HexButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
