"use client";

import { useEffect, useState } from "react";

const prayers = [
  { name: "Fajr", icon: "sunrise", begins: "5:01 AM", iqamah: "5:30 AM" },
  { name: "Dhuhr", icon: "sun", begins: "1:12 PM", iqamah: "1:30 PM" },
  { name: "Asr", icon: "cloud", begins: "5:01 PM", iqamah: "5:30 PM" },
  { name: "Maghrib", icon: "sunset", begins: "8:16 PM", iqamah: "8:26 PM", active: true },
  { name: "Isha", icon: "moon", begins: "9:42 PM", iqamah: "10:00 PM" },
];

const nav = [
  ["home", "Home"], ["mosque", "My Masjid"], ["clock", "Timings"], ["radio", "Live"], ["dots", "More"],
];

function Icon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "home") return <svg viewBox="0 0 24 24" {...common}><path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>;
  if (name === "mosque") return <svg viewBox="0 0 24 24" {...common}><path d="M4 20h16M6 20v-8h12v8M9 12V8h6v4M8 8c0-2 4-4 4-4s4 2 4 4M12 4V2M5 12V8M19 12V8"/><path d="M3.5 8h3M17.5 8h3"/></svg>;
  if (name === "clock") return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  if (name === "radio") return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="2"/><path d="M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
}

function PrayerIcon({ type }: { type: string }) {
  return <span className={`prayer-symbol ${type}`} aria-hidden="true"><span/></span>;
}

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [favorite, setFavorite] = useState(false);
  const [activeNav, setActiveNav] = useState("My Masjid");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const date = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric" }).format(now);

  return <main className="masjid-app">
    <header className="app-header">
      <div className="brand-mark" aria-hidden="true"><span>☾</span></div>
      <div><p>Elkton, Maryland</p><h1>Masjid Aisha</h1></div>
      <button className={`heart ${favorite ? "selected" : ""}`} onClick={() => setFavorite(!favorite)} aria-label="Favorite Masjid Aisha">♡</button>
      <button className="menu-button" aria-label="Open menu">•••</button>
    </header>

    <section className="welcome-card">
      <div><span>Assalamu Alaikum</span><h2>Your daily connection<br/>to the masjid.</h2></div>
      <div className="arch-art" aria-hidden="true"><i/><i/><i/></div>
    </section>

    <section className="prayer-card" aria-labelledby="prayer-heading">
      <div className="date-row"><div><span>Today</span><h2 id="prayer-heading">{date}</h2><p>8 Safar 1448</p></div><div className="next-prayer"><small>Next prayer</small><strong>Maghrib</strong><span>in 2 hrs 16 min</span></div></div>
      <div className="prayer-head"><span>Prayer</span><span>Begins</span><span>Iqamah</span></div>
      <div className="prayer-list">{prayers.map((prayer) => <div className={`prayer-row ${prayer.active ? "active" : ""}`} key={prayer.name}>
        <div><PrayerIcon type={prayer.icon}/><strong>{prayer.name}</strong></div><span>{prayer.begins}</span><b>{prayer.iqamah}</b>
      </div>)}</div>
      <div className="jumuah"><div><span>☾</span><strong>Jumu&apos;ah</strong></div><div className="jumuah-times"><p><b>1:15 PM</b><span>First Khutbah</span></p><p><b>2:15 PM</b><span>Second Khutbah</span></p></div></div>
    </section>

    <section className="sun-cards">
      <article><PrayerIcon type="sunrise"/><div><span>Sunrise</span><strong>6:04 AM</strong></div></article>
      <article><PrayerIcon type="sunset"/><div><span>Sunset</span><strong>8:16 PM</strong></div></article>
    </section>

    <section className="community-card"><span className="community-icon">✦</span><div><small>Community reminder</small><h2>Friday family halaqa</h2><p>Join us after Maghrib this Friday. Dinner and childcare will be provided.</p></div><button aria-label="View event">→</button></section>

    <nav className="bottom-nav" aria-label="App navigation">{nav.map(([icon, label]) => <button className={activeNav === label ? "active" : ""} key={label} onClick={() => setActiveNav(label)}><Icon name={icon}/><span>{label}</span></button>)}</nav>
  </main>;
}
