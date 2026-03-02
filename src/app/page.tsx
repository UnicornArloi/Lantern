"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [fireworks, setFireworks] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#ffffff', '#3498db'];
      const newFirework = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 50 + 20,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setFireworks(prev => [...prev.slice(-10), newFirework]);
      setTimeout(() => {
        setFireworks(prev => prev.filter(f => f.id !== newFirework.id));
      }, 1500);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {fireworks.map(f => (
        <div key={f.id} className="firework" style={{ left: f.x + '%', top: f.y + '%', background: f.color, animation: 'firework 1.5s ease-out' }} />
      ))}
      <div style={{ minHeight: '100vh', background: 'url(/home-bg.png) center center / cover no-repeat, #1a0a0a', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(26,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(231,76,60,0.2)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '28px' }}></span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #e74c3c, #f39c12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>元宵祈福</span>
          </Link>
          <nav style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '25px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Link href="/" style={{ padding: '10px 24px', color: 'white', textDecoration: 'none', borderRadius: '20px', background: 'linear-gradient(135deg, #e74c3c, #f39c12)', fontWeight: 500 }}>首页</Link>
            <Link href="/lottery" style={{ padding: '10px 24px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: '20px', fontWeight: 500 }}>祈福</Link>
          </nav>
        </header>

        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '80px' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: '72px', fontWeight: 900, marginBottom: '10px', background: 'linear-gradient(135deg, #e74c3c, #f39c12, #f1c40f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span>元宵祈福</span>
            </h1>
            <p style={{ fontSize: '20px', fontWeight: 700, background: 'linear-gradient(135deg, #e74c3c, #f39c12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '40px' }}>
              BscScan链上元宵主题趣味祈福游戏
            </p>
            
            <Link href="/lottery" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 36px', background: 'linear-gradient(135deg, #e74c3c, #f39c12)', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: 600, boxShadow: '0 10px 30px rgba(231,76,60,0.3)' }}>
              开始灯笼祈福 →
            </Link>
          </div>
        </section>

        <div style={{ width: '100%', height: '80px', position: 'relative', marginTop: '-1px' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path fill="#F5EFD7" d="M0,40 Q180,80 360,40 T720,40 T1080,40 T1440,40 L1440,80 L0,80 Z"/>
          </svg>
        </div>

        <section style={{ padding: '80px 20px', background: '#F5EFD7', color: '#1a0a0a' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>奖项说明</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '20px', padding: '30px', textAlign: 'center', width: '250px' }}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><img src="/lantern-common.png" alt="普通灯笼" style={{ width: '80px', height: '80px', marginBottom: '15px' }} /></div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#e74c3c' }}>普通灯笼</h3>
                <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', marginBottom: '10px' }}>90% 概率</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#e74c3c' }}>无奖励</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(52,152,219,0.3)', borderRadius: '20px', padding: '30px', textAlign: 'center', width: '250px' }}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><img src="/lantern-rare.png" alt="稀有灯笼" style={{ width: '80px', height: '80px', marginBottom: '15px' }} /></div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#3498db' }}>稀有灯笼</h3>
                <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', marginBottom: '10px' }}>8% 概率</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#3498db' }}>代币红包</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(241,196,15,0.3)', borderRadius: '20px', padding: '30px', textAlign: 'center', width: '250px' }}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><img src="/lantern-legendary.png" alt="传奇灯笼" style={{ width: '80px', height: '80px', marginBottom: '15px' }} /></div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#d4a00a' }}>传奇灯笼</h3>
                <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', marginBottom: '10px' }}>2% 概率</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#d4a00a' }}>奖池 20%</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 20px', background: '#F5EFD7' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '30px', color: '#000000' }}>活动规则</h2>
            <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: '14px' }}>01</span>
                <span style={{ color: '#000000' }}>每次祈福投入 <strong style={{ color: '#1a0a0a' }}>0.01 BNB</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '15px', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: '14px' }}>02</span>
                <span style={{ color: '#000000' }}>50% 进入营销钱包，50% 回购代币加入奖池</span>
              </div>
              <div style={{ display: 'flex', gap: '15px', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: '14px' }}>03</span>
                <span style={{ color: '#000000' }}>抽中稀有灯笼获得 <strong style={{ color: '#3498db' }}>代币红包</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '15px', padding: '15px 0' }}>
                <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: '14px' }}>04</span>
                <span style={{ color: '#000000' }}>抽中传奇灯笼获得 <strong style={{ color: '#d4a00a' }}>奖池 20%</strong> 代币</span>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ textAlign: 'center', padding: '30px', color: 'rgba(0,0,0,0.5)', fontSize: '14px', background: '#F5EFD7' }}>
          <p>© 2026 元宵祈福. All rights reserved.</p>
        </footer>
      </div>
      <style>{`
        @keyframes firework {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        .firework {
          position: fixed;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 999;
        }
      `}</style>
    </div>
  );
}
