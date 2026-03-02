"use client";

import { useState } from "react";
import Link from "next/link";

export default function Lottery() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<{type: string; reward: string} | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLantern, setCurrentLantern] = useState("/lantern-main.png");

  const handleLottery = () => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setCurrentLantern("/lantern-main.png");
    
    setTimeout(() => {
      const random = Math.random() * 100;
      let res = { type: "common", reward: "0" };
      let lantern = "/lantern-common.png";
      
      if (random > 90 && random <= 98) {
        res = { type: "rare", reward: "1000" };
        lantern = "/lantern-rare.png";
      } else if (random > 98) {
        res = { type: "legendary", reward: "奖池20%" };
        lantern = "/lantern-legendary.png";
      }
      
      setResult(res);
      setCurrentLantern(lantern);
      setIsShaking(false);
      setTimeout(() => setShowModal(true), 500);
    }, 2000);
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
      </header>

      <main style={{ textAlign: 'center', padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '10px', background: 'linear-gradient(135deg, #e74c3c, #f39c12, #f1c40f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>灯笼祈福</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>点击祈福 · 点亮惊喜</p>

        <div style={{ background: 'linear-gradient(135deg, rgba(231,76,60,0.15), rgba(243,156,18,0.15))', border: '1px solid rgba(231,76,60,0.4)', borderRadius: '20px', padding: '25px 160px', display: 'inline-block', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '5px' }}>奖池金额</div>
          <div style={{ fontSize: '42px', fontWeight: 900, background: 'linear-gradient(135deg, #f1c40f, #f39c12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>0</div>
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

        <button onClick={handleLottery} disabled={isShaking} style={{ display: 'block', width: '100%', maxWidth: '320px', margin: '20px auto', padding: '22px', background: isShaking ? 'rgba(231,76,60,0.5)' : 'linear-gradient(135deg, #e74c3c, #f39c12)', border: 'none', borderRadius: '16px', cursor: isShaking ? 'not-allowed' : 'pointer', boxShadow: isShaking ? 'none' : '0 10px 40px rgba(231,76,60,0.4)', transition: 'all 0.3s' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'white' }}>开始祈福</div>
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
