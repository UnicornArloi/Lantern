"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WagmiProvider, useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useWaitForTransactionReceipt, createConfig, http, usePublicClient } from "wagmi";
import { bsc } from "wagmi/chains";

const CONTRACT_ADDRESS = "0xFecdb0B87B721960Caf654edC983892111948AE5";

const CONTRACT_ABI = [
  {"inputs":[],"name":"buyLottery","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"getPoolBalance","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getMyResult","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
];

const config = createConfig({
  chains: [bsc],
  transports: { [bsc.id]: http() },
});

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  if (isConnected) {
    return <button onClick={() => disconnect()} style={{ background: 'linear-gradient(135deg, #e74c3c, #f39c12)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>{address?.slice(0, 6)}...{address?.slice(-4)}</button>;
  }
  return <button onClick={() => connect({ connector: connectors[0] })} style={{ background: 'linear-gradient(135deg, #e74c3c, #f39c12)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>连接钱包</button>;
}

function useLottery() {
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash: hash 
  });
  const buy = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "buyLottery",
      value: BigInt(0.01 * 1e18),
    });
  };
  return { hash, buy, isPending, isConfirming };
}

function usePrizePool() {
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPoolBalance",
  });
  return { pool: data ? Number(data) / 1e18 : 0, refetch };
}



function LotteryContent() {
  const { isConnected } = useAccount();
  const { buy, isPending, isConfirming } = useLottery();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  
  const { pool: prizePool, refetch: refetchPool } = usePrizePool();
  
  useEffect(() => {
    if (!refetchPool) return;
    const interval = setInterval(() => {
      refetchPool();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetchPool]);

  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<{type: string; reward: string} | null>(null);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [currentLantern, setCurrentLantern] = useState("/lantern-main.png");

  const handleLottery = async () => {
    if (isShaking || !isConnected) return;
    setIsShaking(true);
    setResult(null);
    setCurrentLantern("/lantern-main.png");
    
    buy();
    
    // Wait for transaction to be confirmed, then get result
    setTimeout(async () => {
      try {
        if (!publicClient) return;
        const resultData = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'getMyResult',
          account: address,
        });
        
        let res = { type: "common", reward: "0" };
        let lantern = "/lantern-common.png";
        
        if (resultData === 2n) {
          res = { type: "rare", reward: "代币红包" };
          lantern = "/lantern-rare.png";
        } else if (resultData === 3n) {
          res = { type: "legendary", reward: "奖池20%" };
          lantern = "/lantern-legendary.png";
        }
        
        setResult(res);
        setCurrentLantern(lantern);
        setIsShaking(false);
        setTimeout(() => setShowModal(true), 500);
      } catch (e) {
        console.error(e);
        setIsShaking(false);
      }
    }, 8000);
  };

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
    setCurrentLantern("/lantern-main.png");
  };

  const getBlessing = (type: string) => {
    switch(type) {
      case 'common': return '愿你元宵节团团圆圆，好运连连！';
      case 'rare': return '喜迎元宵，财源广进！';
      case 'legendary': return '元宵佳节，灯灯相映！';
      default: return '';
    }
  };

  const getRewardText = (type: string, reward: string) => {
    if (type === 'common') return '';
    if (type === 'rare') return `获得 ${reward} 代币！`;
    return `获得奖池 ${reward}！`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(/bg-lottery.png) center center / cover no-repeat fixed', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(26,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(231,76,60,0.2)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '28px' }}></span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #e74c3c, #f39c12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>元宵祈福</span>
        </Link>
        <nav style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '25px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="/" style={{ padding: '10px 24px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: '20px', fontWeight: 500 }}>首页</Link>
          <Link href="/lottery" style={{ padding: '10px 24px', color: 'white', textDecoration: 'none', borderRadius: '20px', background: 'linear-gradient(135deg, #e74c3c, #f39c12)', fontWeight: 500 }}>祈福</Link>
        </nav>
        <WalletButton />
      </header>

      <main style={{ textAlign: 'center', padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '10px', background: 'linear-gradient(135deg, #e74c3c, #f39c12, #f1c40f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>灯笼祈福</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>点击祈福 · 点亮惊喜</p>

        <div style={{ background: 'linear-gradient(135deg, rgba(231,76,60,0.15), rgba(243,156,18,0.15))', border: '1px solid rgba(231,76,60,0.4)', borderRadius: '20px', padding: '25px 160px', display: 'inline-block', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '5px' }}>奖池金额</div>
          <div style={{ fontSize: '42px', fontWeight: 900, background: 'linear-gradient(135deg, #f1c40f, #f39c12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{prizePool ? prizePool.toFixed(2) : '0'}</div>
        </div>

        <div style={{ margin: '40px 0', position: 'relative' }}>
          <div onClick={handleLottery} style={{ display: 'inline-block', cursor: isShaking ? 'wait' : 'pointer', animation: isShaking ? 'shake 0.1s infinite' : 'float 3s ease-in-out infinite', transition: 'transform 0.3s' }}>
            <img src={currentLantern} alt="灯笼" style={{ width: '150px', height: 'auto' }} />
          </div>
          
          {isShaking && (
            <div style={{ marginTop: '20px', color: '#f39c12' }}>
              <span style={{ fontSize: '24px' }}>✨</span>
              <span style={{ marginLeft: '10px' }}>祈福中...</span>
            </div>
          )}
        </div>

        <button onClick={handleLottery} disabled={isShaking || !isConnected} style={{ display: 'block', width: '100%', maxWidth: '320px', margin: '20px auto', padding: '22px', background: isShaking ? 'rgba(231,76,60,0.5)' : 'linear-gradient(135deg, #e74c3c, #f39c12)', border: 'none', borderRadius: '16px', cursor: isShaking ? 'not-allowed' : 'pointer', boxShadow: isShaking ? 'none' : '0 10px 40px rgba(231,76,60,0.4)', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'white' }}>{isPending || isConfirming ? '等待确认...' : '开始祈福'}</div>
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '50px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '16px', padding: '20px', textAlign: 'center', width: '200px' }}>
              <img src="/lantern-common.png" alt="普通" style={{ width: '90px', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '18px', color: '#e74c3c', fontWeight: 600 }}>普通灯笼</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '5px 0' }}>90%</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#e74c3c' }}>无奖励</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '16px', padding: '15px', textAlign: 'center', width: '200px', marginTop: '10px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: '1.6' }}>元宵节赏灯习俗始于东汉，人们点亮灯笼祈求来年风调雨顺、国泰民安。</div>
            </div>
          </div>
          
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(52,152,219,0.3)', borderRadius: '16px', padding: '20px', textAlign: 'center', width: '200px' }}>
              <img src="/lantern-rare.png" alt="稀有" style={{ width: '90px', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '18px', color: '#3498db', fontWeight: 600 }}>稀有灯笼</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '5px 0' }}>8%</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#3498db' }}>代币红包</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(52,152,219,0.3)', borderRadius: '16px', padding: '15px', textAlign: 'center', width: '200px', marginTop: '10px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: '1.6' }}>正月十五吃元宵，寓意团圆美满。元宵由糯米制成，圆圆的外形象征着团圆与和谐。</div>
            </div>
          </div>
          
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(241,196,15,0.3)', borderRadius: '16px', padding: '20px', textAlign: 'center', width: '200px' }}>
              <img src="/lantern-legendary.png" alt="传奇" style={{ width: '90px', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '18px', color: '#f1c40f', fontWeight: 600 }}>传奇灯笼</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '5px 0' }}>2%</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1c40f' }}>奖池 20%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(241,196,15,0.3)', borderRadius: '16px', padding: '15px', textAlign: 'center', width: '200px', marginTop: '10px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: '1.6' }}>舞龙舞狮是元宵节的重要习俗，人们通过热闹的表演驱邪避灾，迎接新的一年。</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '60px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(231,76,60,0.3)', maxWidth: '2000px', margin: '60px auto 30px' }}>
          <h3 style={{ fontSize: '22px', color: '#e74c3c', marginBottom: '15px', fontWeight: 700 }}></h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', textAlign: 'justify' }}>元宵节，又称上元节、小正月、元夕或灯节，是中国的传统节日之一，时间为每年农历正月十五。正月是农历的元月，古人称"夜"为"宵"，正月十五是一年中第一个月圆之夜，所以称正月十五为"元宵节"。元宵节习俗自古以来就十分热闹，人们通过赏灯、猜灯谜、吃元宵、舞龙舞狮等活动来庆祝这一节日，祈求新的一年平安顺遂、团圆美满。元宵赏灯的习俗始于东汉时期，至今已有一千多年的历史。</p>
        </div>
      </main>

      {showModal && result && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s ease' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(180deg, #2a1010, #1a0a0a)', border: `2px solid ${result.type === 'common' ? '#e74c3c' : result.type === 'rare' ? '#3498db' : '#f1c40f'}`, borderRadius: '24px', padding: '40px', textAlign: 'center', maxWidth: '400px', animation: 'bounceIn 0.5s ease' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '15px', width: '30px', height: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', fontSize: '18px', cursor: 'pointer' }}>×</button>
            
            <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '15px', color: result.type === 'common' ? '#e74c3c' : result.type === 'rare' ? '#3498db' : '#f1c40f' }}>{result.type === 'common' ? '普通灯笼' : result.type === 'rare' ? '稀有灯笼!' : '传奇灯笼!'}</h2>
            
            <p style={{ fontSize: '20px', color: '#fff', marginBottom: '10px', fontWeight: 600 }}>{getBlessing(result.type)}</p>
            
            {result.type !== 'common' && (
              <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '25px' }}>{getRewardText(result.type, result.reward)}</p>
            )}
            
            {result.type === 'common' && (
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '25px' }}>很遗憾，未中奖</p>
            )}
            
            <button onClick={closeModal} style={{ padding: '16px 40px', background: `linear-gradient(135deg, ${result.type === 'common' ? '#e74c3c' : result.type === 'rare' ? '#3498db' : '#f1c40f'}, ${result.type === 'common' ? '#f39c12' : result.type === 'rare' ? '#2980b9' : '#f39c12'})`, border: 'none', borderRadius: '30px', color: 'white', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}>再来一次</button>
          </div>
        </div>
      )}

      <footer style={{ display: 'none' }}></footer>

      <style jsx global>{`
        @keyframes shake { 0%, 100% { transform: translateX(-5px) rotate(-2deg); } 50% { transform: translateX(5px) rotate(2deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounceIn { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default function Lottery() {
  return (
    <WagmiProvider config={config}>
      <LotteryContent />
    </WagmiProvider>
  );
}
