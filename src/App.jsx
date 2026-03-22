import { useState, useEffect, useCallback } from "react";

const PAYSTACK_KEY = "pk_test_REPLACE_WITH_YOUR_KEY";
const WHATSAPP = "2349035504425";

const COMBOS = [
  { id:"chop-life", name:"Chop Life", tagline:"Simple. Filling. No stress.", items:["1 foil cake (flavor of your choice)","1 zobo bottle"], price:2100, saves:100, image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=500&fit=crop&q=85" },
  { id:"sweet-tooth", name:"Sweet Tooth", tagline:"Sweet, cold, sorted.", items:["4 cupcakes (mix of flavors)","1 zobo bottle"], price:1800, saves:100, image:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=500&fit=crop&q=85" },
  { id:"hunger-killer", name:"Hunger Killer", tagline:"Hunger has no chance.", items:["2 meatpies (fresh, golden)","4 cupcakes","1 zobo bottle"], price:4100, saves:200, image:"https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=500&fit=crop&q=85" },
  { id:"correct-chop", name:"Correct Chop", tagline:"For when you want to eat like you mean it.", items:["1 foil cake","2 meatpies","1 zobo bottle"], price:4400, saves:200, featured:true, image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=500&fit=crop&q=85" },
  { id:"bele-full", name:"Bele Full Special", tagline:"Everything on the menu. Bele go full.", items:["1 foil cake","4 cupcakes","2 meatpies","1 zobo bottle"], price:5600, saves:200, image:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop&q=85" },
];

const MENU = [
  { name:"Foil Cake",  price:"₦1,500", note:"per foil" },
  { name:"Cupcakes",   price:"₦1,200", note:"pack of 4" },
  { name:"Meatpie",   price:"₦1,200", note:"per pie · min 2" },
  { name:"Zobo Drink", price:"₦700",   note:"per bottle" },
];

const TICKER = ["Chop Life — ₦2,100","Sweet Tooth — ₦1,800","Hunger Killer — ₦4,100","Correct Chop — ₦4,400","Bele Full Special — ₦5,600","Fresh every Saturday","Order Tue–Fri, closes 10pm","Delivered in Ado Ekiti"];

const fmt = (n) => `₦${n.toLocaleString()}`;

// ── SVG ICON SYSTEM ──────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const icons = {
    clock: <svg style={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5"/><path d="M10 6v4.5l3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    megaphone: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M3 8.5h2l7-4v11l-7-4H3a1 1 0 01-1-1v-2a1 1 0 011-1z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 7.5a4 4 0 010 5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M5 11.5v3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    card: <svg style={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke={color} strokeWidth="1.5"/><path d="M2 9h16" stroke={color} strokeWidth="1.5"/><path d="M5 13h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    oven: <svg style={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke={color} strokeWidth="1.5"/><rect x="5" y="8" width="10" height="6" rx="1" stroke={color} strokeWidth="1.5"/><circle cx="6" cy="5.5" r="1" fill={color}/><circle cx="10" cy="5.5" r="1" fill={color}/><circle cx="14" cy="5.5" r="1" fill={color}/></svg>,
    bike: <svg style={s} viewBox="0 0 20 20" fill="none"><circle cx="4.5" cy="14" r="2.5" stroke={color} strokeWidth="1.5"/><circle cx="15.5" cy="14" r="2.5" stroke={color} strokeWidth="1.5"/><path d="M4.5 14L8 7h4l2 4H10L8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.5 14L13 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    heart: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M10 16s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    drop: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M10 3l5 8a5 5 0 11-10 0l5-8z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    shield: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    leaf: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M4 16c2-8 10-10 14-8-2 8-10 10-14 8z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 16l6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    check: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5L16 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    arrow: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    whatsapp: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 00-6.93 12L2 18l4.09-1.07A8 8 0 1010 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 8.5c.5 1.5 2 3.5 5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    star: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.71L10 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    map: <svg style={s} viewBox="0 0 20 20" fill="none"><path d="M10 2C7.24 2 5 4.24 5 7c0 4 5 11 5 11s5-7 5-11c0-2.76-2.24-5-5-5z" stroke={color} strokeWidth="1.5"/><circle cx="10" cy="7" r="2" stroke={color} strokeWidth="1.5"/></svg>,
  };
  return icons[name] || null;
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Sora:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink:  #0E0B08;
    --clay: #C94B2A;
    --clyl: #DF6A4A;
    --sand: #F5EFE6;
    --warm: #EDE4D6;
    --mut:  #9A8472;
    --sage: #3D6E4E;
    --sagl: #EAF3EE;
    --sagb: #A8CCBA;
    --wht:  #FDFAF6;
    --bdr:  #DDD0BE;
    --ffd:  'Playfair Display', Georgia, serif;
    --ffb:  'Sora', system-ui, sans-serif;
  }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body { background: var(--sand); color: var(--ink); font-family: var(--ffb); -webkit-font-smoothing: antialiased; }
  img { max-width: 100%; display: block; }
  a { text-decoration: none; }
  .jb { min-height: 100vh; }

  /* ── STICKY TOP ── */
  .jb-top { position: sticky; top: 0; z-index: 300; background: var(--wht); border-bottom: 1px solid var(--bdr); }

  /* ── TICKER ── */
  .jb-ticker { background: var(--ink); height: 30px; overflow: hidden; display: flex; align-items: center; }
  .jb-ticker-live { display: flex; align-items: center; gap: 7px; padding: 0 20px; flex-shrink: 0; border-right: 1px solid #2A1A0A; }
  .jb-ticker-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--clay); animation: orangeblink 1.4s ease-in-out infinite; flex-shrink: 0; }
  @keyframes orangeblink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.25;transform:scale(0.75)} }
  .jb-ticker-live-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #4A3020; white-space: nowrap; }
  .jb-ticker-track { display: flex; align-items: center; height: 100%; width: max-content; animation: scrollx 44s linear infinite; }
  @keyframes scrollx { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .jb-ticker-item { display: flex; align-items: center; gap: 14px; padding: 0 22px; white-space: nowrap; font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #4A3020; }
  .jb-ticker-item b { color: #B89060; }
  .jb-ticker-sep { width: 3px; height: 3px; border-radius: 50%; background: #2E1C0C; flex-shrink: 0; }

  /* ── NAV ── */
  .jb-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(16px, 5vw, 80px); height: 58px; }
  .jb-logo { font-family: var(--ffd); font-size: 20px; font-weight: 900; color: var(--ink); letter-spacing: -0.3px; }
  .jb-logo em { color: var(--clay); font-style: italic; }
  .jb-nav-links { display: flex; align-items: center; gap: 24px; }
  .jb-nav-a { font-size: 12px; font-weight: 500; color: var(--mut); transition: color 0.18s; }
  .jb-nav-a:hover { color: var(--ink); }
  .jb-nav-btn { font-family: var(--ffb); font-size: 12px; font-weight: 600; background: var(--clay); color: var(--wht); border: none; cursor: pointer; padding: 9px 20px; border-radius: 7px; transition: background 0.18s; }
  .jb-nav-btn:hover { background: #A83818; }

  /* ── HERO ── */
  .jb-hero { display: grid; grid-template-columns: 54% 46%; min-height: calc(100vh - 88px); }
  .jb-hero-l { background: var(--wht); border-right: 1px solid var(--bdr); display: flex; flex-direction: column; justify-content: flex-end; padding: clamp(40px,8vw,100px) clamp(24px,5vw,80px) clamp(52px,8vw,100px); }



  .jb-h1 { font-family: var(--ffd); font-size: clamp(52px, 7.5vw, 96px); font-weight: 900; line-height: 0.92; letter-spacing: -2px; color: var(--ink); margin-bottom: 22px; }
  .jb-h1 em { color: var(--clay); font-style: italic; display: block; }
  .jb-hero-sub { font-size: 15px; font-weight: 500; color: #4A3820; line-height: 1.75; max-width: 340px; margin-bottom: 32px; }
  .jb-hero-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 48px; }
  .jb-btn-fill { font-family: var(--ffb); font-size: 13px; font-weight: 600; background: var(--ink); color: var(--wht); border: none; cursor: pointer; padding: 13px 28px; border-radius: 8px; transition: background 0.18s; }
  .jb-btn-fill:hover { background: var(--clay); }
  .jb-btn-out { font-family: var(--ffb); font-size: 13px; font-weight: 500; background: transparent; color: var(--mut); border: 1px solid var(--bdr); cursor: pointer; padding: 13px 28px; border-radius: 8px; transition: all 0.18s; display: flex; align-items: center; gap: 8px; }
  .jb-btn-out:hover { border-color: var(--clay); color: var(--clay); }
  .jb-hero-facts { display: flex; gap: 0; padding-top: 28px; border-top: 1px solid var(--bdr); }
  .jb-fact { flex: 1; padding-right: 20px; border-right: 1px solid var(--bdr); margin-right: 20px; }
  .jb-fact:last-child { border-right: none; margin-right: 0; padding-right: 0; }
  .jb-fact-n { font-family: var(--ffd); font-size: 26px; font-weight: 900; color: var(--ink); display: block; line-height: 1; }
  .jb-fact-l { font-size: 10px; color: var(--mut); display: block; margin-top: 4px; letter-spacing: 0.3px; }

  /* HERO RIGHT */
  .jb-hero-r { position: relative; overflow: hidden; }
  .jb-hero-img { width: 100%; height: 100%; object-fit: cover; }
  .jb-hero-ov { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(14,11,8,0.06) 0%, transparent 50%); }
  .jb-hero-tag { position: absolute; top: 20px; right: 16px; background: rgba(14,11,8,0.8); backdrop-filter: blur(8px); color: #C8A070; border-radius: 6px; padding: 7px 14px; font-size: 11px; font-weight: 500; letter-spacing: 0.5px; }
  .jb-float-card { position: absolute; bottom: 28px; left: -20px; background: var(--wht); border: 1px solid var(--bdr); border-radius: 12px; padding: 14px 18px; width: 190px; z-index: 2; box-shadow: 0 10px 32px rgba(14,11,8,0.14); }
  .jb-fc-lbl { font-size: 9px; font-weight: 700; color: var(--clay); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
  .jb-fc-name { font-family: var(--ffd); font-size: 16px; font-weight: 900; color: var(--ink); margin-bottom: 8px; }
  .jb-fc-row { display: flex; align-items: center; justify-content: space-between; font-size: 11px; }
  .jb-fc-time { color: var(--mut); }
  .jb-fc-live { display: flex; align-items: center; gap: 5px; color: var(--sage); font-weight: 600; font-size: 11px; }
  .jb-fc-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); animation: blink 1.6s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  /* ── ANNOUNCE BAR ── */
  .jb-ann { background: var(--clay); color: var(--wht); text-align: center; padding: 10px 20px; font-size: 12px; font-weight: 500; letter-spacing: 0.3px; }
  .jb-ann strong { font-weight: 700; }

  /* ── SECTION SHARED ── */
  .jb-sec { padding: clamp(48px, 8vw, 88px) clamp(16px, 5vw, 80px); }
  .jb-inner { max-width: 1100px; margin: 0 auto; }
  .jb-eye { font-size: 11px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--clay); display: block; margin-bottom: 10px; }
  .jb-sh { font-family: var(--ffd); font-size: clamp(28px, 4vw, 48px); font-weight: 900; color: var(--ink); line-height: 1.05; margin-bottom: 10px; }
  .jb-ss { font-size: 14px; color: var(--mut); line-height: 1.7; max-width: 460px; margin-bottom: 40px; }

  /* ── MENU ── */
  .jb-menu-bg { background: var(--warm); border-top: 1px solid var(--bdr); border-bottom: 1px solid var(--bdr); }
  .jb-menu-grid { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--bdr); border-radius: 12px; overflow: hidden; background: var(--bdr); gap: 1px; }
  .jb-mc { background: var(--wht); padding: 26px 22px; }
  .jb-mc-n { font-family: var(--ffd); font-size: 18px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 3px; }
  .jb-mc-s { font-size: 11px; color: var(--mut); display: block; margin-bottom: 12px; }
  .jb-mc-p { font-size: 20px; font-weight: 600; color: var(--clay); }

  /* ── COMBOS ── */
  .jb-cbg { background: var(--sand); }
  .jb-cgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
  .jb-card { background: var(--wht); border: 1px solid var(--bdr); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.22s, box-shadow 0.22s; }
  .jb-card:hover { transform: translateY(-4px); box-shadow: 0 16px 44px rgba(14,11,8,0.1); }
  .jb-card.feat { border-color: var(--clay); border-width: 2px; }
  .jb-ci { position: relative; aspect-ratio: 16/10; overflow: hidden; }
  .jb-ci img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .jb-card:hover .jb-ci img { transform: scale(1.05); }
  .jb-cbadge { position: absolute; top: 12px; left: 12px; background: var(--clay); color: var(--wht); font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; display: flex; align-items: center; gap: 5px; }
  .jb-csave { position: absolute; top: 12px; right: 12px; background: rgba(14,11,8,0.72); backdrop-filter: blur(4px); color: #D4B07A; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 4px; }
  .jb-cbody { padding: 18px 18px 16px; flex: 1; display: flex; flex-direction: column; }
  .jb-cn { font-family: var(--ffd); font-size: 21px; font-weight: 900; color: var(--ink); margin-bottom: 3px; }
  .jb-ct { font-size: 12px; color: var(--mut); margin-bottom: 14px; }
  .jb-citems { list-style: none; flex: 1; margin-bottom: 16px; }
  .jb-citems li { font-size: 12px; color: #5A4030; padding: 5px 0; border-bottom: 1px solid var(--warm); display: flex; align-items: center; gap: 8px; }
  .jb-citems li:last-child { border-bottom: none; }
  .jb-citems li::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--clay); flex-shrink: 0; }
  .jb-cfoot { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--warm); }
  .jb-cprice { font-family: var(--ffd); font-size: 24px; font-weight: 900; color: var(--ink); }
  .jb-obtn { font-family: var(--ffb); font-size: 12px; font-weight: 600; background: var(--ink); color: var(--wht); border: none; cursor: pointer; padding: 10px 20px; border-radius: 7px; transition: background 0.18s; display: flex; align-items: center; gap: 6px; }
  .jb-obtn:hover { background: var(--clay); }

  /* ── ZOBO SECTION ── */
  .jb-zobo-sec { background: var(--ink); overflow: hidden; }
  .jb-zobo-sec .jb-eye { color: #D4A860; font-size: 11px; font-weight: 800; }
  .jb-zobo-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .jb-zobo-sh { font-family: var(--ffd); font-size: clamp(30px, 4.5vw, 50px); font-weight: 900; color: var(--wht); line-height: 1.05; margin-bottom: 14px; }
  .jb-zobo-sh em { color: #D4A860; font-style: italic; }
  .jb-zobo-sub { font-size: 15px; color: #C0A888; line-height: 1.8; margin-bottom: 32px; font-weight: 400; }
  .jb-zbenefits { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
  .jb-zb { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; border-radius: 10px; background: #160E06; border: 1px solid #2A1A0A; transition: border-color 0.2s; }
  .jb-zb:hover { border-color: #6A5030; }
  .jb-zb-ico { width: 36px; height: 36px; border-radius: 8px; background: #221408; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .jb-zb-title { font-size: 13px; font-weight: 700; color: #EAD8C0; margin-bottom: 3px; }
  .jb-zb-desc { font-size: 12px; color: #9A7858; line-height: 1.6; }
  .jb-zobo-freshbadge { display: inline-flex; align-items: center; gap: 8px; background: #160E06; border: 1px solid #4A3020; border-radius: 100px; padding: 8px 16px; font-size: 11px; font-weight: 600; color: #C8A870; }
  .jb-zobo-bdot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); animation: blink 1.8s infinite; }

  /* ZOBO IMAGE PANEL */
  .jb-zobo-img-col { position: relative; }
  .jb-zobo-img-frame { border-radius: 20px; overflow: hidden; aspect-ratio: 4/5; border: 1px solid #2A1A0A; position: relative; }
  .jb-zobo-img-frame img { width: 100%; height: 100%; object-fit: cover; }
  .jb-zobo-img-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,11,8,0.65) 0%, transparent 55%); }
  .jb-zobo-caption { position: absolute; bottom: 16px; left: 16px; right: 16px; background: rgba(14,11,8,0.82); backdrop-filter: blur(8px); border: 1px solid #2A1A0A; border-radius: 10px; padding: 12px 14px; }
  .jb-zobo-cap-t { font-family: var(--ffd); font-size: 15px; font-weight: 700; color: var(--wht); margin-bottom: 3px; }
  .jb-zobo-cap-s { font-size: 10px; color: #B89060; letter-spacing: 0.3px; }
  .jb-zobo-price-badge { position: absolute; top: -14px; right: -14px; background: var(--clay); color: var(--wht); border-radius: 12px; padding: 12px 16px; text-align: center; box-shadow: 0 8px 24px rgba(201,75,42,0.3); }
  .jb-zobo-price-badge span { font-family: var(--ffd); font-size: 26px; font-weight: 900; display: block; line-height: 1; }
  .jb-zobo-price-badge small { font-size: 10px; font-weight: 500; opacity: 0.85; display: block; margin-top: 2px; }

  /* ── HOW IT WORKS ── */
  .jb-hiw { background: var(--wht); border-top: 1px solid var(--bdr); }
  .jb-hiw .jb-sh { color: var(--ink); }
  .jb-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
  .jb-step { background: var(--wht); border: 1px solid var(--bdr); border-radius: 14px; padding: 28px 24px 24px; cursor: pointer; position: relative; overflow: hidden; transition: border-color 0.25s, transform 0.22s, box-shadow 0.22s; }
  .jb-step:hover { border-color: var(--clay); transform: translateY(-4px); box-shadow: 0 14px 36px rgba(201,75,42,0.09); background: var(--sand); }
  .jb-step-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
  .jb-step-n { font-family: var(--ffd); font-size: 44px; font-weight: 900; color: var(--bdr); line-height: 1; transition: color 0.25s; }
  .jb-step:hover .jb-step-n { color: var(--clay); }
  .jb-step-ico { width: 36px; height: 36px; border-radius: 8px; background: var(--warm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.25s; }
  .jb-step:hover .jb-step-ico { background: var(--clay); }
  .jb-step h4 { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 8px; }
  .jb-step p { font-size: 13px; color: var(--mut); line-height: 1.65; max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease; }
  .jb-step:hover p { max-height: 120px; opacity: 1; }
  .jb-step-arr { position: absolute; bottom: 18px; right: 20px; display: flex; align-items: center; transition: transform 0.22s, color 0.22s; color: var(--bdr); }
  .jb-step:hover .jb-step-arr { color: var(--clay); transform: translateX(4px); }

  /* ── FOOTER ── */
  .jb-footer { background: var(--ink); border-top: 1px solid #1E1208; }
  .jb-footer-top { max-width: 1100px; margin: 0 auto; padding: clamp(48px,8vw,80px) clamp(16px,5vw,80px) 40px; display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 48px; }
  .jb-footer-brand {}
  .jb-flogo { font-family: var(--ffd); font-size: 24px; font-weight: 900; color: var(--wht); display: block; margin-bottom: 12px; }
  .jb-flogo em { color: var(--clay); font-style: italic; }
  .jb-fbrand-sub { font-size: 13px; color: #5A4030; line-height: 1.7; max-width: 240px; margin-bottom: 24px; }
  .jb-wa-btn { font-family: var(--ffb); font-size: 13px; font-weight: 600; background: #163D22; color: #5CDB7A; border: 1px solid #1F5A31; cursor: pointer; padding: 11px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; transition: background 0.18s; }
  .jb-wa-btn:hover { background: #1F5A31; }
  .jb-footer-col-title { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #3A2810; margin-bottom: 20px; display: block; }
  .jb-footer-links { display: flex; flex-direction: column; gap: 12px; }
  .jb-footer-link { font-size: 13px; color: #5A4030; transition: color 0.18s; display: inline-flex; align-items: center; gap: 8px; }
  .jb-footer-link:hover { color: var(--clyl); }
  .jb-footer-bottom { border-top: 1px solid #1E1208; }
  .jb-footer-bottom-inner { max-width: 1100px; margin: 0 auto; padding: 20px clamp(16px,5vw,80px); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .jb-footer-copy { font-size: 11px; color: #3A2810; }
  .jb-footer-tiktok { font-size: 11px; color: #3A2810; display: flex; align-items: center; gap: 6px; transition: color 0.18s; }
  .jb-footer-tiktok:hover { color: var(--clyl); }
  @media (max-width: 768px) {
    .jb-footer-top { grid-template-columns: 1fr; gap: 32px; }
    .jb-footer-bottom-inner { flex-direction: column; align-items: flex-start; }
  }

  /* ── MODAL ── */
  .jb-ov { position: fixed; inset: 0; z-index: 500; background: rgba(14,11,8,0.72); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; animation: fin 0.18s ease; }
  @keyframes fin { from{opacity:0} to{opacity:1} }
  @keyframes sup { from{transform:translateY(14px);opacity:0} to{transform:none;opacity:1} }
  .jb-modal { background: var(--wht); border-radius: 16px; width: 100%; max-width: 400px; max-height: 92vh; overflow-y: auto; animation: sup 0.22s ease; box-shadow: 0 28px 72px rgba(14,11,8,0.28); }
  .jb-mh { padding: 22px 22px 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .jb-mname { font-family: var(--ffd); font-size: 22px; font-weight: 900; color: var(--ink); line-height: 1.1; }
  .jb-mprow { margin-top: 4px; font-size: 13px; color: var(--mut); }
  .jb-mp { font-size: 17px; font-weight: 700; color: var(--clay); }
  .jb-mx { width: 32px; height: 32px; border-radius: 50%; background: var(--warm); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 17px; color: var(--mut); flex-shrink: 0; transition: background 0.15s; }
  .jb-mx:hover { background: var(--bdr); }
  .jb-mil { margin: 12px 22px; padding: 10px 14px; background: var(--sand); border-radius: 8px; list-style: none; }
  .jb-mil li { font-size: 12px; color: var(--mut); padding: 3px 0; display: flex; align-items: center; gap: 8px; }
  .jb-mil li::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: var(--clay); flex-shrink: 0; }
  .jb-mf { padding: 4px 22px 22px; }
  .jb-mfh { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--mut); margin-bottom: 14px; }
  .jb-field { margin-bottom: 10px; }
  .jb-lbl { display: block; font-size: 11px; font-weight: 500; color: var(--mut); margin-bottom: 5px; }
  .jb-inp { width: 100%; font-family: var(--ffb); font-size: 14px; padding: 11px 14px; border: 1px solid var(--bdr); border-radius: 8px; color: var(--ink); background: var(--wht); outline: none; transition: border-color 0.18s; }
  .jb-inp:focus { border-color: var(--clay); }
  .jb-inp::placeholder { color: #C0A890; }
  .jb-err { font-size: 12px; color: #B03818; margin-top: 8px; }
  .jb-paybtn { width: 100%; font-family: var(--ffb); font-size: 14px; font-weight: 600; background: var(--clay); color: var(--wht); border: none; cursor: pointer; padding: 14px; border-radius: 10px; margin-top: 10px; transition: background 0.18s; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .jb-paybtn:hover:not(:disabled) { background: #A83818; }
  .jb-paybtn:disabled { opacity: 0.55; cursor: not-allowed; }
  .jb-paysub { font-size: 11px; opacity: 0.75; font-weight: 400; }
  .jb-ok { padding: 44px 22px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 13px; }
  .jb-ok-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--sagl); color: var(--sage); display: flex; align-items: center; justify-content: center; }
  .jb-ok h3 { font-family: var(--ffd); font-size: 22px; font-weight: 900; color: var(--ink); }
  .jb-ok p { font-size: 13px; color: var(--mut); line-height: 1.6; max-width: 270px; }
  .jb-ok-close { font-family: var(--ffb); font-size: 13px; font-weight: 600; background: var(--ink); color: var(--wht); border: none; cursor: pointer; padding: 11px 28px; border-radius: 8px; margin-top: 6px; transition: background 0.18s; }
  .jb-ok-close:hover { background: var(--clay); }

  /* ── RESPONSIVE ── */

  /* Tablet: 768–1024px */
  @media (max-width: 1024px) {
    .jb-hero { grid-template-columns: 1fr 1fr; min-height: auto; }
    .jb-zobo-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
    .jb-menu-grid { grid-template-columns: 1fr 1fr; }
    .jb-steps { grid-template-columns: repeat(2, 1fr); }
  }

  /* Large mobile / small tablet: 600–768px */
  @media (max-width: 768px) {
    .jb-hero { grid-template-columns: 1fr; min-height: auto; }
    .jb-hero-r { height: 56vw; min-height: 240px; }
    .jb-float-card { display: none; }
    .jb-hero-l { padding: 60px 20px 40px; justify-content: center; }
    .jb-zobo-grid { grid-template-columns: 1fr; gap: 32px; }
    .jb-zobo-img-col { display: none; }
    .jb-nav-links .jb-nav-a { display: none; }
    .jb-footer { flex-direction: column; align-items: flex-start; gap: 16px; }
    .jb-cgrid { grid-template-columns: 1fr; }
    .jb-hero-facts { gap: 12px; }
    .jb-fact { padding-right: 12px; margin-right: 12px; }
  }

  /* Mobile: < 480px */
  @media (max-width: 480px) {
    .jb-menu-grid { grid-template-columns: 1fr; }
    .jb-steps { grid-template-columns: 1fr; }
    .jb-h1 { font-size: clamp(44px, 13vw, 60px); }
    .jb-hero-sub { font-size: 14px; }
    .jb-btn-fill, .jb-btn-out { padding: 12px 20px; font-size: 13px; }
    .jb-hero-facts { flex-wrap: wrap; }
    .jb-fact { min-width: 80px; }
    .jb-zobo-sh { font-size: clamp(26px, 8vw, 36px); }
  }

  /* Very small: < 360px */
  @media (max-width: 360px) {
    .jb-hero-btns { flex-direction: column; }
    .jb-btn-fill, .jb-btn-out { width: 100%; justify-content: center; text-align: center; }
    .jb-hero-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-top: 1px solid var(--bdr); padding-top: 20px; }
    .jb-fact { border-right: none; margin-right: 0; padding-right: 0; }
  }
`;

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function TickerBar() {
  const d = [...TICKER, ...TICKER];
  return (
    <div className="jb-ticker">
      <div className="jb-ticker-live">
        <span className="jb-ticker-live-dot" />
        <span className="jb-ticker-live-label">Live</span>
      </div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div className="jb-ticker-track">
          {d.map((t, i) => (
            <div key={i} className="jb-ticker-item">
              <b>{t}</b><span className="jb-ticker-sep" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="jb-top">
      <TickerBar />
      <nav className="jb-nav">
        <div className="jb-logo">Juliet<em>Bakes</em></div>
        <div className="jb-nav-links">
          <a href="#combos" className="jb-nav-a" onClick={(e) => { e.preventDefault(); scrollTo("combos"); }}>Combos</a>
          <a href="#menu" className="jb-nav-a" onClick={(e) => { e.preventDefault(); scrollTo("menu"); }}>Menu</a>
          <a href="#how" className="jb-nav-a" onClick={(e) => { e.preventDefault(); scrollTo("how"); }}>How it works</a>
          <button className="jb-nav-btn" onClick={() => scrollTo("combos")}>Order Now</button>
        </div>
      </nav>
    </div>
  );
}

function Hero() {
  return (
    <section className="jb-hero">
      <div className="jb-hero-l">
        <h1 className="jb-h1">Fresh<br />Baked.<em>Delivered.</em></h1>
        <p className="jb-hero-sub">Order anytime Tuesday to Friday, get it Saturday. Foil cakes, cupcakes, meatpie and cold zobo — all made fresh on bake day.</p>
        <div className="jb-hero-btns">
          <button className="jb-btn-fill" onClick={() => document.getElementById("combos")?.scrollIntoView({ behavior: "smooth" })}>See Combos</button>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="jb-btn-out">
            <Icon name="whatsapp" size={15} color="currentColor" /> WhatsApp Us
          </a>
        </div>
        <div className="jb-hero-facts">
          <div className="jb-fact"><span className="jb-fact-n">100%</span><span className="jb-fact-l">Same-day fresh</span></div>
          <div className="jb-fact"><span className="jb-fact-n">Sat</span><span className="jb-fact-l">Every week</span></div>
          <div className="jb-fact"><span className="jb-fact-n">5</span><span className="jb-fact-l">Combo deals</span></div>
        </div>
      </div>

      <div className="jb-hero-r">
        <img src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&h=1600&fit=crop&q=90" alt="Fresh baked cupcakes" className="jb-hero-img" />
        <div className="jb-hero-ov" />
        <div className="jb-hero-tag">@juliet_bakes</div>
        <div className="jb-float-card">
          <div className="jb-fc-lbl">This Week</div>
          <div className="jb-fc-name">Preorder Now</div>
          <div className="jb-fc-row">
            <span className="jb-fc-time">Closes Fri 8pm</span>
            <div className="jb-fc-live"><span className="jb-fc-dot" />Open</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnnounceBanner() {
  return (
    <div className="jb-ann">
      <strong>Orders open Tuesday to Friday.</strong> Place yours before 10pm Friday — baked fresh Saturday, delivered to your door.
    </div>
  );
}

function MenuStrip() {
  return (
    <section className="jb-sec jb-menu-bg" id="menu">
      <div className="jb-inner">
        <span className="jb-eye">The Menu</span>
        <h2 className="jb-sh">What we make</h2>
        <p className="jb-ss">Order individual items or pick a combo. Everything made fresh on bake day — nothing is pre-baked.</p>
        <div className="jb-menu-grid">
          {MENU.map((m) => (
            <div key={m.name} className="jb-mc">
              <span className="jb-mc-n">{m.name}</span>
              <span className="jb-mc-s">{m.note}</span>
              <span className="jb-mc-p">{m.price}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 12, color: "var(--mut)" }}>For individual item orders, WhatsApp us. Meatpie minimum order is 2 pieces.</p>
      </div>
    </section>
  );
}

function ComboCard({ combo, onOrder }) {
  return (
    <div className={`jb-card${combo.featured ? " feat" : ""}`}>
      <div className="jb-ci">
        <img src={combo.image} alt={combo.name} loading="lazy" />
        {combo.featured && (
          <span className="jb-cbadge">
            <Icon name="star" size={10} color="#FDFAF6" /> Fan Fave
          </span>
        )}
        <span className="jb-csave">Save {fmt(combo.saves)}</span>
      </div>
      <div className="jb-cbody">
        <div className="jb-cn">{combo.name}</div>
        <div className="jb-ct">{combo.tagline}</div>
        <ul className="jb-citems">
          {combo.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="jb-cfoot">
          <div className="jb-cprice">{fmt(combo.price)}</div>
          <button className="jb-obtn" onClick={() => onOrder(combo)}>
            Order This <Icon name="arrow" size={13} color="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CombosSection({ onOrder }) {
  return (
    <section className="jb-sec jb-cbg" id="combos">
      <div className="jb-inner">
        <span className="jb-eye">Combo Packages</span>
        <h2 className="jb-sh">Pick your combo</h2>
        <p className="jb-ss">Every combo includes our homemade zobo. Order Tuesday to Friday before 10pm, receive Saturday.</p>
        <div className="jb-cgrid">
          {COMBOS.map((c) => <ComboCard key={c.id} combo={c} onOrder={onOrder} />)}
        </div>
      </div>
    </section>
  );
}

function ZoboSection() {
  const benefits = [
    { icon: "heart",  title: "Rich in antioxidants",       desc: "Hibiscus fights free radicals and supports heart health — naturally." },
    { icon: "drop",   title: "Lowers blood pressure",       desc: "Studies confirm hibiscus tea reduces blood pressure without medication." },
    { icon: "shield", title: "Boosts your immune system",   desc: "High in Vitamin C and iron. One cold bottle, real nutritional value." },
    { icon: "leaf",   title: "Zero preservatives",          desc: "Brewed fresh on bake day. No artificial flavours. Nothing fake." },
  ];
  return (
    <section className="jb-sec jb-zobo-sec">
      <div className="jb-zobo-grid">
        <div>
          <span className="jb-eye">Signature Drink</span>
          <h2 className="jb-zobo-sh">Our Zobo is<br /><em>the real deal.</em></h2>
          <p className="jb-zobo-sub">We don't throw zobo in the combo to fill space. Ours is brewed fresh every bake day from dried hibiscus petals, ginger, cloves — and our signature recipe. Cold, slightly tart, slightly sweet. It pairs with everything.</p>
          <div className="jb-zbenefits">
            {benefits.map((b) => (
              <div key={b.title} className="jb-zb">
                <div className="jb-zb-ico"><Icon name={b.icon} size={16} color="#B89060" /></div>
                <div>
                  <div className="jb-zb-title">{b.title}</div>
                  <div className="jb-zb-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="jb-zobo-freshbadge">
            <span className="jb-zobo-bdot" />
            Brewed fresh every Saturday · Not bottled weeks ago
          </div>
        </div>

        <div className="jb-zobo-img-col">
          <div className="jb-zobo-price-badge">
            <span>₦700</span>
            <small>per bottle</small>
          </div>
          <div className="jb-zobo-img-frame">
            <img src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&h=900&fit=crop&q=85" alt="Zobo drink" />
            <div className="jb-zobo-img-ov" />
            <div className="jb-zobo-caption">
              <div className="jb-zobo-cap-t">Juliet Bakes Zobo</div>
              <div className="jb-zobo-cap-s">Hibiscus · Ginger · Cloves · Made fresh Saturday</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [active, setActive] = useState(null);
  const steps = [
    { n:"01", icon:"megaphone", title:"We announce Tuesday",       body:"Every Tuesday we post what's available. Follow @juliet_bakes on TikTok so you never miss a bake day." },
    { n:"02", icon:"card",      title:"Order anytime Tue–Fri",      body:"Orders open Tuesday and close Friday 10pm. Pick your combo, pay via Paystack, and your slot is confirmed." },
    { n:"03", icon:"oven",      title:"We bake Saturday morning",  body:"Everything made fresh on bake day. No leftovers, no shortcuts. Same-day goods only." },
    { n:"04", icon:"bike",      title:"We deliver to your door",   body:"Dispatch rider brings your order to you in Ado Ekiti. Delivery fee added at checkout." },
  ];
  return (
    <section className="jb-sec jb-hiw" id="how">
      <div className="jb-inner">
        <span className="jb-eye">The Process</span>
        <h2 className="jb-sh">How it works</h2>
        <p className="jb-ss">Simple preorder system. No wahala. Hover a card to see more.</p>
        <div className="jb-steps">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="jb-step"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="jb-step-top">
                <div className="jb-step-n">{s.n}</div>
                <div className="jb-step-ico">
                  <Icon name={s.icon} size={17} color={active === i ? "#FDFAF6" : "#9A8472"} />
                </div>
              </div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              <div className="jb-step-arr">
                <Icon name="arrow" size={16} color="currentColor" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <footer className="jb-footer">
      <div className="jb-footer-top">

        {/* BRAND COL */}
        <div className="jb-footer-brand">
          <span className="jb-flogo">Juliet<em>Bakes</em></span>
          <p className="jb-fbrand-sub">Fresh cakes, cupcakes, meatpie and zobo — made every Saturday and delivered in Ado Ekiti. Order Tuesday to Friday before 10pm.</p>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="jb-wa-btn">
            <Icon name="whatsapp" size={15} color="#5CDB7A" /> WhatsApp Us
          </a>
        </div>

        {/* QUICK LINKS */}
        <div>
          <span className="jb-footer-col-title">Quick Links</span>
          <div className="jb-footer-links">
            <a href="#combos" className="jb-footer-link" onClick={(e) => { e.preventDefault(); scrollTo("combos"); }}>
              <Icon name="arrow" size={13} color="currentColor" /> Our Combos
            </a>
            <a href="#menu" className="jb-footer-link" onClick={(e) => { e.preventDefault(); scrollTo("menu"); }}>
              <Icon name="arrow" size={13} color="currentColor" /> The Menu
            </a>
            <a href="#how" className="jb-footer-link" onClick={(e) => { e.preventDefault(); scrollTo("how"); }}>
              <Icon name="arrow" size={13} color="currentColor" /> How it Works
            </a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="jb-footer-link">
              <Icon name="arrow" size={13} color="currentColor" /> Place an Order
            </a>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <span className="jb-footer-col-title">Find Us</span>
          <div className="jb-footer-links">
            <span className="jb-footer-link">
              <Icon name="map" size={13} color="currentColor" /> Ado Ekiti, Ekiti State
            </span>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="jb-footer-link">
              <Icon name="whatsapp" size={13} color="currentColor" /> WhatsApp
            </a>
            <a href="https://tiktok.com/@juliet_bakes" target="_blank" rel="noreferrer" className="jb-footer-link">
              <Icon name="star" size={13} color="currentColor" /> @juliet_bakes on TikTok
            </a>
          </div>
        </div>

      </div>

      <div className="jb-footer-bottom">
        <div className="jb-footer-bottom-inner">
          <span className="jb-footer-copy">© {new Date().getFullYear()} Juliet Bakes · Ado Ekiti · All rights reserved</span>
          <a href="https://tiktok.com/@juliet_bakes" target="_blank" rel="noreferrer" className="jb-footer-tiktok">
            <Icon name="star" size={12} color="currentColor" /> Follow us on TikTok
          </a>
        </div>
      </div>
    </footer>
  );
}

function OrderModal({ combo, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const upd = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (form.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
    if (!form.address.trim()) return "Please enter your delivery address.";
    return null;
  };

  const pay = useCallback(() => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    if (!window.PaystackPop) { setLoading(false); setError("Payment couldn't load. Please refresh or contact us on WhatsApp."); return; }
    window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: `${form.phone.replace(/\D/g, "")}@julietbakes.order`,
      amount: combo.price * 100,
      currency: "NGN",
      ref: `jb-${Date.now()}`,
      metadata: { custom_fields: [
        { display_name:"Name",    variable_name:"name",    value: form.name },
        { display_name:"Phone",   variable_name:"phone",   value: form.phone },
        { display_name:"Combo",   variable_name:"combo",   value: combo.name },
        { display_name:"Address", variable_name:"address", value: form.address },
      ]},
      callback: () => { setSuccess(true); setLoading(false); },
      onClose:  () => setLoading(false),
    }).openIframe();
  }, [form, combo]);

  if (success) return (
    <div className="jb-ov" onClick={onClose}>
      <div className="jb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jb-ok">
          <div className="jb-ok-icon"><Icon name="check" size={24} color="var(--sage)" /></div>
          <h3>Order confirmed!</h3>
          <p>Thank you, {form.name.split(" ")[0]}. Your <strong>{combo.name}</strong> is locked in. Baked fresh Saturday, delivered to you.</p>
          <p style={{ fontSize: 12 }}>Questions? Chat us on WhatsApp anytime.</p>
          <button className="jb-ok-close" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="jb-ov" onClick={onClose}>
      <div className="jb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jb-mh">
          <div>
            <div className="jb-mname">{combo.name}</div>
            <div className="jb-mprow"><span className="jb-mp">{fmt(combo.price)}</span>{" "}<span style={{ fontSize: 11 }}>+ delivery</span></div>
          </div>
          <button className="jb-mx" onClick={onClose}>×</button>
        </div>
        <ul className="jb-mil">{combo.items.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="jb-mf">
          <div className="jb-mfh">Your details</div>
          <div className="jb-field"><label className="jb-lbl">Full Name</label><input className="jb-inp" name="name" value={form.name} onChange={upd} placeholder="e.g. Amaka Adeyemi" /></div>
          <div className="jb-field"><label className="jb-lbl">Phone Number</label><input className="jb-inp" name="phone" type="tel" value={form.phone} onChange={upd} placeholder="080XXXXXXXX" /></div>
          <div className="jb-field"><label className="jb-lbl">Delivery Address</label><input className="jb-inp" name="address" value={form.address} onChange={upd} placeholder="Street, Area, Landmark — Ado Ekiti" /></div>
          {error && <p className="jb-err">{error}</p>}
          <button className="jb-paybtn" onClick={pay} disabled={loading}>
            {loading ? "Opening payment..." : <>Pay {fmt(combo.price)} with Paystack <span className="jb-paysub">(+ delivery)</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sel, setSel] = useState(null);
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js"; s.async = true;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch (_) {} };
  }, []);
  useEffect(() => {
    document.body.style.overflow = sel ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sel]);

  return (
    <>
      <style>{css}</style>
      <div className="jb">
        <Navbar />
        <Hero />
        <AnnounceBanner />
        <MenuStrip />
        <CombosSection onOrder={setSel} />
        <ZoboSection />
        <HowItWorks />
        <Footer />
        {sel && <OrderModal combo={sel} onClose={() => setSel(null)} />}
      </div>
    </>
  );
}
