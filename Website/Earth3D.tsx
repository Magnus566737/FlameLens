<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<style>
html,body{margin:0;background:#050711;color:#F5F7FF;font-family:'Geist',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:#F5F7FF;text-decoration:none}
a:hover{color:#35B8FF}
::selection{background:rgba(108,99,255,.45)}
input,select,button{font-family:inherit}
input::placeholder{color:#6B7390}
select option{background:#0A1020;color:#F5F7FF}
@media (prefers-reduced-motion: reduce){*{transition:none!important}}
</style>
</helmet>
<div style="position:relative;min-height:100vh;overflow-x:hidden">
<div style="position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 60% 50% at 15% 5%,rgba(108,99,255,0.13),transparent 70%),radial-gradient(ellipse 50% 40% at 90% 25%,rgba(53,184,255,0.08),transparent 70%),radial-gradient(ellipse 40% 30% at 70% 95%,rgba(255,113,56,0.06),transparent 70%),#050711"></div>
<canvas data-fl-scene="1" ref="{{ canvasRef }}" style="position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none;display:block"></canvas>
<div style="position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 120% 90% at 50% 40%,transparent 55%,rgba(3,4,10,0.75) 100%)"></div>

<header style="position:fixed;top:14px;left:0;right:0;z-index:60;display:flex;justify-content:center;padding:0 16px;pointer-events:none">
  <nav style="pointer-events:auto;width:100%;max-width:1240px;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 8px 8px 18px;border-radius:999px;background:{{ navBg }};backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid {{ navBorder }};transition:background .4s ease,border-color .4s ease">
    <a href="#/" aria-label="FlameLens home" style="display:flex;align-items:center;gap:10px;color:#F5F7FF">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12.5" stroke="rgba(245,247,255,0.28)"></circle><ellipse cx="14" cy="14" rx="12.5" ry="4.2" transform="rotate(-28 14 14)" stroke="#6C63FF"></ellipse><circle cx="14" cy="14" r="7" stroke="#35B8FF" opacity="0.55"></circle><circle cx="14" cy="14" r="3.6" fill="#FF7138"></circle></svg>
      <span style="font-size:17px;font-weight:500;letter-spacing:-0.02em">FlameLens</span>
    </a>
    <sc-if value="{{ notMobile }}" hint-placeholder-val="{{ true }}">
      <div style="display:flex;gap:2px;padding:4px;border-radius:999px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.05)">
        <sc-for list="{{ navItems }}" as="n" hint-placeholder-count="4">
          <a href="{{ n.href }}" aria-current="{{ n.aria }}" style="position:relative;padding:8px 16px;border-radius:999px;font-size:14px;color:{{ n.color }};background:{{ n.bg }};box-shadow:{{ n.shadow }};transition:background .35s ease,color .35s ease" style-hover="color:#F5F7FF">{{ n.label }}</a>
        </sc-for>
      </div>
    </sc-if>
    <div style="display:flex;align-items:center;gap:6px">
      <button onClick="{{ openSearch }}" aria-label="Search research" style="width:40px;height:40px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid transparent;color:#C7CCE0;cursor:pointer;transition:all .25s" style-hover="background:rgba(255,255,255,0.06);color:#F5F7FF">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke-width:1.8;stroke-linecap:round"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
      </button>
      <sc-if value="{{ notMobile }}" hint-placeholder-val="{{ true }}">
        <a href="#/library" style="display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:#F5F7FF;color:#0A1020;font-size:14px;font-weight:500;transition:all .25s" style-hover="background:#ffffff;color:#0A1020;box-shadow:0 0 28px rgba(108,99,255,0.45)">Explore Research
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke-width:2;stroke-linecap:round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg>
        </a>
      </sc-if>
      <sc-if value="{{ isMobile }}" hint-placeholder-val="{{ false }}">
        <button onClick="{{ toggleMenu }}" aria-label="Menu" aria-expanded="{{ menuOpen }}" style="width:40px;height:40px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:#F5F7FF;cursor:pointer">
          <sc-if value="{{ menuOpen }}" hint-placeholder-val="{{ false }}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke-width:1.8;stroke-linecap:round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>
          </sc-if>
          <sc-if value="{{ menuClosed }}" hint-placeholder-val="{{ true }}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke-width:1.8;stroke-linecap:round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg>
          </sc-if>
        </button>
      </sc-if>
    </div>
  </nav>
</header>

<sc-if value="{{ showMobileMenu }}" hint-placeholder-val="{{ false }}">
  <div style="position:fixed;top:76px;left:16px;right:16px;z-index:59;padding:10px;border-radius:24px;background:rgba(8,12,26,0.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(160,176,255,0.14);display:flex;flex-direction:column;gap:2px">
    <sc-for list="{{ navItems }}" as="n" hint-placeholder-count="4">
      <a href="{{ n.href }}" style="display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-radius:16px;font-size:18px;color:{{ n.color }};background:{{ n.bg }}">{{ n.label }}<span style="font-family:'Geist Mono',monospace;font-size:11px;color:#6B7390">{{ n.num }}</span></a>
    </sc-for>
    <a href="#/library" style="margin-top:6px;padding:16px;border-radius:16px;background:#F5F7FF;color:#0A1020;text-align:center;font-weight:500">Explore Research</a>
  </div>
</sc-if>

<main ref="{{ mainRef }}" style="position:relative;z-index:1">

<sc-if value="{{ isHome }}" hint-placeholder-val="{{ true }}">
  <section data-screen-label="Home" style="position:relative;min-height:100vh;display:flex;align-items:center;padding:120px 24px 110px;box-sizing:border-box">
    <div style="width:100%;max-width:1240px;margin:0 auto">
      <div style="max-width:660px;display:flex;flex-direction:column;gap:26px">
        <div style="display:flex;align-items:center;gap:12px;font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:0.18em;color:#FF9461">
          <span style="width:6px;height:6px;border-radius:50%;background:#FF7138;box-shadow:0 0 12px #FF7138"></span>ADVANCED SPACE FIRE SAFETY RESEARCH
        </div>
        <h1 style="margin:0;font-size:clamp(48px,7.4vw,108px);line-height:0.96;letter-spacing:-0.045em;font-weight:500;text-wrap:balance">Understanding Fire.<br><span style="font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-0.02em;color:#C9CBFF">Protecting the Future.</span></h1>
        <p style="margin:0;font-size:clamp(18px,1.6vw,22px);line-height:1.4;color:#F5F7FF;font-weight:400">AI-Powered Fire Safety Research for Space Missions</p>
        <p style="margin:0;font-size:16.5px;line-height:1.65;color:#929BB2;max-width:520px;text-wrap:pretty">Exploring combustion behavior, fire dynamics, and spacecraft safety through scientific research, experimental data, and artificial intelligence.</p>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:6px">
          <a href="#/library" style="display:flex;align-items:center;gap:10px;padding:15px 24px;border-radius:999px;background:#6C63FF;color:#ffffff;font-size:15px;font-weight:500;box-shadow:0 0 0 1px rgba(255,255,255,0.12) inset,0 10px 40px -10px rgba(108,99,255,0.8);transition:all .3s" style-hover="background:#7C74FF;color:#ffffff;box-shadow:0 0 0 1px rgba(255,255,255,0.2) inset,0 12px 50px -8px rgba(108,99,255,0.95)">Explore Research
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke-width:2;stroke-linecap:round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg>
          </a>
          <a href="#/experiments" style="display:flex;align-items:center;gap:10px;padding:15px 24px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.14);color:#F5F7FF;font-size:15px;backdrop-filter:blur(10px);transition:all .3s" style-hover="background:rgba(255,255,255,0.09);color:#F5F7FF;border-color:rgba(255,255,255,0.28)">Discover Experiments</a>
        </div>
      </div>
    </div>
    <sc-if value="{{ showHud }}" hint-placeholder-val="{{ true }}">
      <div style="position:absolute;right:max(24px,calc((100vw - 1240px)/2));bottom:118px;max-width:260px;display:flex;flex-direction:column;gap:6px;font-family:'Geist Mono',monospace;font-size:11px;line-height:1.55;color:#7E88A3;border-left:1px solid rgba(53,184,255,0.35);padding-left:12px">
        <span style="color:#35B8FF;letter-spacing:0.12em">FIG. 01</span>
        <span>Spherical diffusion flame around a fuel droplet, as observed in microgravity. Artistic visualization — not simulation data.</span>
      </div>
    </sc-if>
    <a href="#stats" onClick="{{ scrollToStats }}" style="position:absolute;left:50%;bottom:32px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;color:#7E88A3;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.28em">SCROLL
      <span style="position:relative;width:1px;height:38px;background:rgba(255,255,255,0.12);overflow:hidden"><span ref="{{ scrollDotRef }}" style="position:absolute;left:0;top:0;width:1px;height:12px;background:#35B8FF"></span></span>
    </a>
  </section>

  <section id="stats" data-reveal="1" style="padding:40px 24px 30px">
    <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:18px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px">
        <span style="font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:0.16em;color:#929BB2">01 — LIBRARY INDEX</span>
        <span style="font-size:13px;color:#6B7390">Counts reflect this curated dataset, not all published research.</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));border-radius:24px;background:rgba(10,16,32,0.5);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(160,176,255,0.12);overflow:hidden">
        <sc-for list="{{ stats }}" as="s" hint-placeholder-count="4">
          <div style="padding:30px 28px;display:flex;flex-direction:column;gap:12px;border-right:1px solid rgba(160,176,255,0.08);border-bottom:1px solid rgba(160,176,255,0.08);margin:0 -1px -1px 0">
            <div style="display:flex;align-items:center;gap:8px;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.12em;color:#7E88A3"><span style="width:5px;height:5px;border-radius:50%;background:{{ s.color }}"></span>{{ s.code }}</div>
            <div style="font-size:clamp(44px,4.6vw,64px);font-weight:400;letter-spacing:-0.04em;line-height:1;font-variant-numeric:tabular-nums">{{ s.value }}</div>
            <div style="font-size:15px;color:#F5F7FF">{{ s.label }}</div>
            <div style="font-size:13px;color:#7E88A3;line-height:1.5">{{ s.note }}</div>
          </div>
        </sc-for>
      </div>
    </div>
  </section>

  <section data-reveal="1" style="padding:90px 24px 40px">
    <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:32px">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:20px">
        <div style="display:flex;flex-direction:column;gap:14px">
          <span style="font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:0.16em;color:#929BB2">02 — FEATURED RESEARCH</span>
          <h2 style="margin:0;font-size:clamp(34px,4vw,54px);font-weight:500;letter-spacing:-0.035em;line-height:1.02;max-width:640px">Findings from flames that <span style="font-family:'Instrument Serif',serif;font-style:italic;font-weight:400">never rise.</span></h2>
        </div>
        <a href="#/library" style="display:flex;align-items:center;gap:8px;font-size:14px;color:#C7CCE0;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.2)">View full library →</a>
      </div>
      <div style="display:grid;grid-template-columns:{{ featCols }};gap:18px">
        <article style="position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:28px;padding:34px;border-radius:24px;background:linear-gradient(160deg,rgba(108,99,255,0.14),rgba(10,16,32,0.55) 55%);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(160,176,255,0.16);transition:transform .4s cubic-bezier(.2,.7,.2,1),border-color .4s,box-shadow .4s;min-height:380px" style-hover="transform:translateY(-4px);border-color:rgba(108,99,255,0.45);box-shadow:0 30px 70px -30px rgba(108,99,255,0.55)">
          <div style="display:flex;flex-direction:column;gap:18px">
            <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-family:'Geist Mono',monospace;font-size:12px;color:#929BB2">
              <span style="display:flex;align-items:center;gap:8px;color:{{ featMain.catColor }}"><span style="width:6px;height:6px;border-radius:50%;background:{{ featMain.catColor }}"></span>{{ featMain.catName }}</span>
              <span>{{ featMain.year }}</span>
            </div>
            <h3 style="margin:0;font-size:clamp(26px,2.6vw,36px);font-weight:500;letter-spacing:-0.03em;line-height:1.1;text-wrap:balance">{{ featMain.title }}</h3>
            <p style="margin:0;font-size:16px;line-height:1.65;color:#A9B0C6;max-width:560px;text-wrap:pretty">{{ featMain.abstract }}</p>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08)">
            <div style="display:flex;flex-direction:column;gap:4px;font-size:13px;color:#929BB2"><span style="color:#F5F7FF">{{ featMain.authorsShort }}</span><span style="font-style:italic">{{ featMain.venue }}</span></div>
            <a href="{{ featMain.href }}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;background:#F5F7FF;color:#0A1020;font-size:14px;font-weight:500" style-hover="color:#0A1020;background:#ffffff">Read Research ↗</a>
          </div>
        </article>
        <div style="display:flex;flex-direction:column;gap:18px">
          <sc-for list="{{ featRest }}" as="p" hint-placeholder-count="2">
            <article style="flex:1;display:flex;flex-direction:column;gap:14px;padding:26px;border-radius:24px;background:rgba(10,16,32,0.55);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(160,176,255,0.12);transition:transform .4s cubic-bezier(.2,.7,.2,1),border-color .4s,box-shadow .4s" style-hover="transform:translateY(-4px);border-color:rgba(53,184,255,0.4);box-shadow:0 24px 60px -30px rgba(53,184,255,0.5)">
              <div style="display:flex;justify-content:space-between;gap:12px;font-family:'Geist Mono',monospace;font-size:12px;color:#929BB2">
                <span style="display:flex;align-items:center;gap:8px;color:{{ p.catColor }}"><span style="width:6px;height:6px;border-radius:50%;background:{{ p.catColor }}"></span>{{ p.catName }}</span><span>{{ p.year }}</span>
              </div>
              <h3 style="margin:0;font-size:20px;font-weight:500;letter-spacing:-0.02em;line-height:1.25;text-wrap:balance">{{ p.title }}</h3>
              <p style="margin:0;font-size:14.5px;line-height:1.6;color:#929BB2;text-wrap:pretty">{{ p.abstract }}</p>
              <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;font-size:13px">
                <span style="color:#7E88A3;font-style:italic">{{ p.venue }}</span>
                <a href="{{ p.href }}" target="_blank" rel="noopener" style="color:#35B8FF" style-hover="color:#8FD6FF">Read Research ↗</a>
              </div>
            </article>
          </sc-for>
        </div>
      </div>
    </div>
  </section>
</sc-if>

<sc-if value="{{ isLibrary }}" hint-placeholder-val="{{ false }}">
  <section data-screen-label="Research Library" style="padding:150px 24px 60px">
    <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:36px">
      <div data-reveal="1" style="display:flex;flex-direction:column;gap:20px;max-width:820px">
        <span style="font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:0.16em;color:#35B8FF">RESEARCH LIBRARY · {{ paperCount }} CURATED PAPERS</span>
        <h1 style="margin:0;font-size:clamp(46px,6.4vw,92px);font-weight:500;letter-spacing:-0.045em;line-height:0.98">Research Library</h1>
        <p style="margin:0;font-size:18px;line-height:1.6;color:#929BB2;max-width:560px">Explore scientific discoveries shaping the future of fire safety in space.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px">
        <label style="display:flex;align-items:center;gap:14px;padding:8px 8px 8px 22px;border-radius:20px;background:rgba(10,16,32,0.65);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid {{ searchBorder }};box-shadow:{{ searchShadow }};transition:all .3s">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#929BB2" style="stroke-width:1.8;stroke-linecap:round;flex-shrink:0"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
          <input ref="{{ searchRef }}" value="{{ q }}" onChange="{{ onQ }}" onFocus="{{ onFocus }}" onBlur="{{ onBlur }}" placeholder="Search titles, keywords, topics, authors…" aria-label="Search research" style="flex:1;min-width:0;height:52px;background:transparent;border:none;outline:none;color:#F5F7FF;font-size:17px">
          <sc-if value="{{ hasQ }}" hint-placeholder-val="{{ false }}">
            <button onClick="{{ clearQ }}" style="padding:8px 12px;border-radius:10px;background:rgba(255,255,255,0.06);border:none;color:#C7CCE0;font-size:13px;cursor:pointer">Clear</button>
          </sc-if>
          <span style="padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);font-family:'Geist Mono',monospace;font-size:12px;color:#6B7390">/</span>
        </label>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <sc-for list="{{ catChips }}" as="c" hint-placeholder-count="7">
            <button onClick="{{ c.onClick }}" style="display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:{{ c.bg }};border:1px solid {{ c.border }};color:{{ c.color }};font-size:13.5px;cursor:pointer;transition:all .25s" style-hover="border-color:rgba(255,255,255,0.3)">
              <span style="width:6px;height:6px;border-radius:50%;background:{{ c.dot }}"></span>{{ c.label }}<span style="font-family:'Geist Mono',monospace;font-size:11px;color:#6B7390">{{ c.count }}</span>
            </button>
          </sc-for>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;padding-top:4px">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <select value="{{ year }}" onChange="{{ onYear }}" aria-label="Filter by publication year" style="height:40px;padding:0 14px;border-radius:12px;background:rgba(10,16,32,0.7);border:1px solid rgba(160,176,255,0.14);color:#F5F7FF;font-size:13.5px;cursor:pointer;outline:none">
              <sc-for list="{{ yearOpts }}" as="y" hint-placeholder-count="1"><option value="{{ y.v }}">{{ y.label }}</option></sc-for>
            </select>
            <div style="display:flex;padding:3px;border-radius:12px;background:rgba(10,16,32,0.7);border:1px solid rgba(160,176,255,0.14)">
              <sc-for list="{{ sortOpts }}" as="o" hint-placeholder-count="2">
                <button onClick="{{ o.onClick }}" style="height:32px;padding:0 14px;border-radius:9px;border:none;background:{{ o.bg }};color:{{ o.color }};font-size:13px;cursor:pointer;transition:all .25s">{{ o.label }}</button>
              </sc-for>
            </div>
            <sc-if value="{{ hasFilters }}" hint-placeholder-val="{{ false }}">
              <button onClick="{{ clearFilters }}" style="height:40px;padding:0 14px;border-radius:12px;background:transparent;border:1px dashed rgba(255,113,56,0.45);color:#FF9461;font-size:13px;cursor:pointer">Clear filters ×</button>
            </sc-if>
          </div>
          <span style="font-family:'Geist Mono',monospace;font-size:12px;color:#7E88A3">{{ resultLabel }}</span>
        </div>
      </div>

      <sc-if value="{{ loading }}" hint-placeholder-val="{{ false }}">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));gap:18px">
          <sc-for list="{{ skeletons }}" as="k" hint-placeholder-count="3">
            <div style="height:300px;border-radius:22px;background:linear-gradient(100deg,rgba(255,255,255,0.025) 30%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.025) 70%);background-size:200% 100%;border:1px solid rgba(160,176,255,0.08);padding:26px;box-sizing:border-box;display:flex;flex-direction:column;gap:14px">
              <div style="width:40%;height:10px;border-radius:5px;background:rgba(255,255,255,0.06)"></div>
              <div style="width:90%;height:18px;border-radius:6px;background:rgba(255,255,255,0.07)"></div>
              <div style="width:70%;height:18px;border-radius:6px;background:rgba(255,255,255,0.07)"></div>
              <div style="width:100%;height:60px;border-radius:6px;background:rgba(255,255,255,0.04)"></div>
            </div>
          </sc-for>
        </div>
      </sc-if>

      <sc-if value="{{ showResults }}" hint-placeholder-val="{{ false }}">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));gap:18px">
          <sc-for list="{{ results }}" as="p" hint-placeholder-count="6">
            <article style="display:flex;flex-direction:column;gap:14px;padding:26px;border-radius:22px;background:rgba(10,16,32,0.58);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(160,176,255,0.12);transition:transform .4s cubic-bezier(.2,.7,.2,1),border-color .4s,box-shadow .4s" style-hover="transform:translateY(-4px);border-color:rgba(108,99,255,0.4);box-shadow:0 24px 60px -30px rgba(108,99,255,0.55)">
              <div style="display:flex;justify-content:space-between;gap:12px;font-family:'Geist Mono',monospace;font-size:12px;color:#929BB2">
                <span style="display:flex;align-items:center;gap:8px;color:{{ p.catColor }}"><span style="width:6px;height:6px;border-radius:50%;background:{{ p.catColor }}"></span>{{ p.catName }}</span><span>{{ p.year }}</span>
              </div>
              <h3 style="margin:0;font-size:20px;font-weight:500;letter-spacing:-0.02em;line-height:1.25;text-wrap:balance">{{ p.title }}</h3>
              <div style="font-size:13px;line-height:1.5;color:#C7CCE0">{{ p.authors }}</div>
              <p style="margin:0;font-size:14.5px;line-height:1.6;color:#929BB2;text-wrap:pretty">{{ p.abstract }}</p>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                <sc-for list="{{ p.tags }}" as="t" hint-placeholder-count="3"><span style="padding:4px 9px;border-radius:999px;background:rgba(255,255,255,0.04);font-family:'Geist Mono',monospace;font-size:11px;color:#7E88A3">{{ t }}</span></sc-for>
              </div>
              <div style="margin-top:auto;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
                <div style="display:flex;flex-direction:column;gap:3px;font-size:12.5px;color:#7E88A3"><span style="font-style:italic">{{ p.venue }}</span><span style="font-family:'Geist Mono',monospace;font-size:11px">Published {{ p.year }}</span></div>
                <div style="display:flex;gap:8px;align-items:center">
                  <sc-if value="{{ p.hasExp }}" hint-placeholder-val="{{ false }}">
                    <button onClick="{{ p.openExp }}" style="padding:8px 12px;border-radius:999px;background:rgba(255,113,56,0.1);border:1px solid rgba(255,113,56,0.3);color:#FF9461;font-family:'Geist Mono',monospace;font-size:11px;cursor:pointer">{{ p.expCode }}</button>
                  </sc-if>
                  <a href="{{ p.href }}" target="_blank" rel="noopener" style="padding:8px 14px;border-radius:999px;background:#F5F7FF;color:#0A1020;font-size:13px;font-weight:500" style-hover="color:#0A1020;background:#fff">View Paper ↗</a>
                </div>
              </div>
            </article>
          </sc-for>
        </div>
      </sc-if>

      <sc-if value="{{ isEmpty }}" hint-placeholder-val="{{ false }}">
        <div style="padding:70px 24px;border-radius:24px;border:1px dashed rgba(160,176,255,0.2);display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center">
          <div style="width:56px;height:56px;border-radius:50%;border:1px solid rgba(53,184,255,0.4);display:flex;align-items:center;justify-content:center"><span style="width:10px;height:10px;border-radius:50%;background:#35B8FF;box-shadow:0 0 18px #35B8FF"></span></div>
          <h3 style="margin:0;font-size:22px;font-weight:500">No papers match that search</h3>
          <p style="margin:0;font-size:15px;color:#929BB2;max-width:420px;line-height:1.6">Try broader terms like “flame spread” or “droplet”, or remove a filter.</p>
          <button onClick="{{ clearFilters }}" style="margin-top:6px;padding:11px 20px;border-radius:999px;background:#F5F7FF;color:#0A1020;border:none;font-size:14px;font-weight:500;cursor:pointer">Clear search & filters</button>
        </div>
      </sc-if>

      <sc-if value="{{ hasMore }}" hint-placeholder-val="{{ false }}">
        <div style="display:flex;justify-content:center"><button onClick="{{ loadMore }}" style="padding:13px 26px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.16);color:#F5F7FF;font-size:14px;cursor:pointer" style-hover="background:rgba(255,255,255,0.09)">Load more · {{ remaining }} remaining</button></div>
      </sc-if>

      <p style="margin:0;font-size:12.5px;line-height:1.6;color:#6B7390;max-width:720px">Summaries are written by FlameLens editors. “View Paper” opens a Google Scholar lookup for the exact title — always verify against the original publication before citing.</p>
    </div>
  </section>
</sc-if>

<sc-if value="{{ isExperiments }}" hint-placeholder-val="{{ false }}">
  <section data-screen-label="Experiments" style="padding:150px 24px 60px">
    <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:44px">
      <div data-reveal="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:24px;align-items:end">
        <div style="display:flex;flex-direction:column;gap:20px">
          <span style="font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:0.16em;color:#FF9461">EXPERIMENTS · 6 PROGRAMS IN ORBIT</span>
          <h1 style="margin:0;font-size:clamp(46px,6.4vw,92px);font-weight:500;letter-spacing:-0.045em;line-height:0.98">Experiments</h1>
        </div>
        <p style="margin:0;font-size:17px;line-height:1.65;color:#929BB2;max-width:500px">Six NASA-led programs that study how fire ignites, spreads and goes out where there is no “up”. Summaries are written from public NASA descriptions — consult NASA for authoritative details.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));gap:18px">
        <sc-for list="{{ exps }}" as="e" hint-placeholder-count="6">
          <article onClick="{{ e.open }}" style="cursor:pointer;display:flex;flex-direction:column;gap:20px;padding:14px 14px 24px;border-radius:26px;background:rgba(10,16,32,0.58);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(160,176,255,0.12);transition:transform .45s cubic-bezier(.2,.7,.2,1),border-color .45s,box-shadow .45s" style-hover="transform:translateY(-6px);border-color:rgba(255,255,255,0.22);box-shadow:0 30px 70px -34px rgba(108,99,255,0.6)">
            <div style="position:relative;aspect-ratio:16/10;border-radius:16px;overflow:hidden;background:repeating-linear-gradient(135deg,rgba(255,255,255,0.035) 0 1px,transparent 1px 11px),#070b18;border:1px solid rgba(255,255,255,0.06)">
              <div style="position:absolute;inset:0;background:{{ e.glow }}"></div>
              <span style="position:absolute;top:14px;left:16px;font-family:'Geist Mono',monospace;font-size:11px;color:#C7CCE0;letter-spacing:0.12em">{{ e.index }}</span>
              <span style="position:absolute;top:14px;right:16px;font-family:'Geist Mono',monospace;font-size:11px;color:#7E88A3">{{ e.platformShort }}</span>
              <span style="position:absolute;left:16px;right:16px;bottom:14px;font-family:'Geist Mono',monospace;font-size:11px;color:#7E88A3;line-height:1.5">[ image: {{ e.image }} ]</span>
            </div>
            <div style="padding:0 12px;display:flex;flex-direction:column;gap:12px;flex:1">
              <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
                <h3 style="margin:0;font-size:34px;font-weight:500;letter-spacing:-0.04em">{{ e.code }}</h3>
                <span style="font-size:14px;color:#929BB2">{{ e.name }}</span>
              </div>
              <div style="font-family:'Geist Mono',monospace;font-size:11.5px;color:{{ e.hue }};letter-spacing:0.04em">{{ e.period }}</div>
              <p style="margin:0;font-size:14.5px;line-height:1.6;color:#C7CCE0;text-wrap:pretty"><span style="color:#7E88A3">Objective — </span>{{ e.objective }}</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#929BB2;text-wrap:pretty">{{ e.desc }}</p>
              <div style="margin-top:auto;padding-top:10px;display:flex;align-items:center;gap:8px;font-size:14px;color:#F5F7FF">Learn more <span style="color:{{ e.hue }}">→</span></div>
            </div>
          </article>
        </sc-for>
      </div>
    </div>
  </section>
</sc-if>

<sc-if value="{{ isInsights }}" hint-placeholder-val="{{ false }}">
  <section data-screen-label="Insights" style="padding:150px 24px 60px">
    <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:40px">
      <div data-reveal="1" style="display:flex;flex-direction:column;gap:20px;max-width:820px">
        <span style="font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:0.16em;color:#A9A3FF">INSIGHTS · EDITORIAL</span>
        <h1 style="margin:0;font-size:clamp(46px,6.4vw,92px);font-weight:500;letter-spacing:-0.045em;line-height:0.98">Scientific <span style="font-family:'Instrument Serif',serif;font-style:italic;font-weight:400">Insights</span></h1>
        <p style="margin:0;font-size:18px;line-height:1.6;color:#929BB2;max-width:600px">Discover what space-based combustion research reveals about fire safety beyond Earth.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:1px;border-radius:18px;overflow:hidden;border:1px solid rgba(160,176,255,0.12);background:rgba(160,176,255,0.1)">
        <sc-for list="{{ legend }}" as="l" hint-placeholder-count="3">
          <div style="padding:18px 20px;background:rgba(8,12,26,0.85);display:flex;flex-direction:column;gap:8px">
            <span style="align-self:flex-start;padding:4px 10px;border-radius:999px;background:{{ l.bg }};color:{{ l.color }};font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.06em">{{ l.label }}</span>
            <span style="font-size:13.5px;line-height:1.55;color:#929BB2">{{ l.desc }}</span>
          </div>
        </sc-for>
      </div>

      <article data-reveal="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:0;border-radius:28px;overflow:hidden;background:linear-gradient(135deg,rgba(53,184,255,0.1),rgba(10,16,32,0.6) 60%);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(53,184,255,0.22)">
        <div style="padding:clamp(28px,4vw,48px);display:flex;flex-direction:column;gap:20px">
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <span style="padding:5px 11px;border-radius:999px;background:rgba(53,184,255,0.14);color:#35B8FF;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.06em">HIGHLIGHTED · ESTABLISHED FINDING</span>
            <span style="font-family:'Geist Mono',monospace;font-size:11px;color:#7E88A3">{{ feat.catName }}</span>
          </div>
          <h2 style="margin:0;font-size:clamp(30px,3.4vw,46px);font-weight:500;letter-spacing:-0.035em;line-height:1.05;text-wrap:balance">{{ feat.title }}</h2>
          <p style="margin:0;font-size:16.5px;line-height:1.7;color:#B5BBD0;text-wrap:pretty">{{ feat.text }}</p>
          <div style="display:flex;flex-direction:column;gap:12px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08)">
            <a href="{{ feat.refHref }}" target="_blank" rel="noopener" style="font-size:13.5px;line-height:1.5;color:#C7CCE0" style-hover="color:#35B8FF"><span style="font-family:'Geist Mono',monospace;font-size:11px;color:#7E88A3">SOURCE&nbsp;&nbsp;</span>{{ feat.refLabel }} ↗</a>
            <button onClick="{{ feat.openExp }}" style="align-self:flex-start;padding:9px 14px;border-radius:999px;background:rgba(255,113,56,0.1);border:1px solid rgba(255,113,56,0.3);color:#FF9461;font-size:13px;cursor:pointer">Related experiment · {{ feat.expCode }} →</button>
          </div>
        </div>
        <div style="position:relative;min-height:320px;background:repeating-linear-gradient(135deg,rgba(255,255,255,0.03) 0 1px,transparent 1px 11px),#060a16;border-left:1px solid rgba(255,255,255,0.06)">
          <div style="position:absolute;left:50%;top:46%;width:180px;height:180px;margin:-90px 0 0 -90px;border-radius:50%;background:radial-gradient(circle,rgba(255,150,90,0.0) 38%,rgba(53,140,255,0.35) 52%,rgba(53,184,255,0.0) 70%)"></div>
          <div style="position:absolute;left:50%;top:46%;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;border:1px dashed rgba(169,163,255,0.3)"></div>
          <div style="position:absolute;left:50%;top:46%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#FFB27A;box-shadow:0 0 20px rgba(255,140,80,0.7)"></div>
          <span style="position:absolute;left:20px;right:20px;bottom:18px;font-family:'Geist Mono',monospace;font-size:11px;color:#7E88A3;line-height:1.5">Schematic only: droplet, visible hot-flame zone, and the wider region of low-temperature reactions. Drop FLEX imagery here.</span>
        </div>
      </article>

      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <sc-for list="{{ icatChips }}" as="c" hint-placeholder-count="7">
            <button onClick="{{ c.onClick }}" style="display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:{{ c.bg }};border:1px solid {{ c.border }};color:{{ c.color }};font-size:13.5px;cursor:pointer;transition:all .25s"><span style="width:6px;height:6px;border-radius:50%;background:{{ c.dot }}"></span>{{ c.label }}</button>
          </sc-for>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          <span style="font-family:'Geist Mono',monospace;font-size:11px;color:#6B7390;letter-spacing:0.1em;margin-right:6px">EVIDENCE</span>
          <sc-for list="{{ statusChips }}" as="c" hint-placeholder-count="4">
            <button onClick="{{ c.onClick }}" style="padding:7px 12px;border-radius:10px;background:{{ c.bg }};border:1px solid {{ c.border }};color:{{ c.color }};font-family:'Geist Mono',monospace;font-size:11.5px;cursor:pointer">{{ c.label }}</button>
          </sc-for>
        </div>
      </div>

      <sc-if value="{{ hasInsights }}" hint-placeholder-val="{{ true }}">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:18px">
          <sc-for list="{{ insights }}" as="i" hint-placeholder-count="6">
            <article style="display:flex;flex-direction:column;border-radius:22px;overflow:hidden;background:rgba(10,16,32,0.58);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(160,176,255,0.12);transition:transform .4s cubic-bezier(.2,.7,.2,1),border-color .4s" style-hover="transform:translateY(-4px);border-color:rgba(255,255,255,0.22)">
              <div style="position:relative;height:110px;background:repeating-linear-gradient(135deg,rgba(255,255,255,0.03) 0 1px,transparent 1px 10px),#070b18;border-bottom:1px solid rgba(255,255,255,0.06)">
                <div style="position:absolute;inset:0;background:{{ i.glow }}"></div>
                <span style="position:absolute;left:16px;bottom:12px;right:16px;font-family:'Geist Mono',monospace;font-size:10.5px;color:#7E88A3">[ viz: {{ i.viz }} ]</span>
              </div>
              <div style="padding:22px;display:flex;flex-direction:column;gap:12px;flex:1">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
                  <span style="padding:4px 10px;border-radius:999px;background:{{ i.statusBg }};color:{{ i.statusColor }};font-family:'Geist Mono',monospace;font-size:10.5px;letter-spacing:0.06em">{{ i.status }}</span>
                  <span style="font-family:'Geist Mono',monospace;font-size:11px;color:{{ i.catColor }}">{{ i.catName }}</span>
                </div>
                <h3 style="margin:0;font-size:19px;font-weight:500;letter-spacing:-0.02em;line-height:1.3;text-wrap:balance">{{ i.title }}</h3>
                <p style="margin:0;font-size:14.5px;line-height:1.6;color:#929BB2;text-wrap:pretty">{{ i.text }}</p>
                <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;gap:10px">
                  <sc-if value="{{ i.hasRef }}" hint-placeholder-val="{{ true }}">
                    <a href="{{ i.refHref }}" target="_blank" rel="noopener" style="font-size:12.5px;line-height:1.5;color:#C7CCE0" style-hover="color:#35B8FF"><span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:#6B7390">SOURCE&nbsp;&nbsp;</span>{{ i.refLabel }} ↗</a>
                  </sc-if>
                  <sc-if value="{{ i.noRef }}" hint-placeholder-val="{{ false }}">
                    <span style="font-size:12.5px;line-height:1.5;color:#7E88A3"><span style="font-family:'Geist Mono',monospace;font-size:10.5px;color:#6B7390">SOURCE&nbsp;&nbsp;</span>No direct citation — not a verified finding</span>
                  </sc-if>
                  <sc-if value="{{ i.hasExp }}" hint-placeholder-val="{{ true }}">
                    <button onClick="{{ i.openExp }}" style="align-self:flex-start;padding:6px 11px;border-radius:999px;background:rgba(255,113,56,0.08);border:1px solid rgba(255,113,56,0.28);color:#FF9461;font-family:'Geist Mono',monospace;font-size:11px;cursor:pointer">Related · {{ i.expCode }} →</button>
                  </sc-if>
                </div>
              </div>
            </article>
          </sc-for>
        </div>
      </sc-if>
      <sc-if value="{{ noInsights }}" hint-placeholder-val="{{ false }}">
        <div style="padding:60px 24px;border-radius:24px;border:1px dashed rgba(160,176,255,0.2);text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center">
          <h3 style="margin:0;font-size:20px;font-weight:500">No insights for this combination</h3>
          <button onClick="{{ clearInsightFilters }}" style="padding:10px 18px;border-radius:999px;background:#F5F7FF;color:#0A1020;border:none;font-size:14px;cursor:pointer">Show all insights</button>
        </div>
      </sc-if>
    </div>
  </section>
</sc-if>

<footer style="position:relative;margin-top:80px;padding:70px 24px 36px;border-top:1px solid rgba(160,176,255,0.1);background:linear-gradient(180deg,rgba(5,7,17,0.2),rgba(5,7,17,0.92) 40%)">
  <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:56px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:36px">
      <div style="grid-column:span 2;min-width:0;display:flex;flex-direction:column;gap:16px;max-width:340px">
        <a href="#/" style="display:flex;align-items:center;gap:10px">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12.5" stroke="rgba(245,247,255,0.28)"></circle><ellipse cx="14" cy="14" rx="12.5" ry="4.2" transform="rotate(-28 14 14)" stroke="#6C63FF"></ellipse><circle cx="14" cy="14" r="7" stroke="#35B8FF" opacity="0.55"></circle><circle cx="14" cy="14" r="3.6" fill="#FF7138"></circle></svg>
          <span style="font-size:18px;font-weight:500;letter-spacing:-0.02em">FlameLens</span>
        </a>
        <p style="margin:0;font-size:14px;line-height:1.65;color:#929BB2">Advancing our understanding of fire behavior and spacecraft safety through scientific research and AI.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <span style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7390">NAVIGATE</span>
        <sc-for list="{{ navItems }}" as="n" hint-placeholder-count="4"><a href="{{ n.href }}" style="font-size:14px;color:#C7CCE0">{{ n.label }}</a></sc-for>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <span style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7390">CATEGORIES</span>
        <sc-for list="{{ footCats }}" as="c" hint-placeholder-count="6"><button onClick="{{ c.onClick }}" style="padding:0;text-align:left;background:none;border:none;font-size:14px;color:#C7CCE0;cursor:pointer" style-hover="color:#35B8FF">{{ c.label }}</button></sc-for>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <span style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7390">EXPERIMENTS</span>
        <sc-for list="{{ exps }}" as="e" hint-placeholder-count="6"><button onClick="{{ e.open }}" style="padding:0;text-align:left;background:none;border:none;font-size:14px;color:#C7CCE0;cursor:pointer" style-hover="color:#35B8FF">{{ e.code }}</button></sc-for>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <span style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7390">SOURCES</span>
        <a href="https://www.nasa.gov/glenn/" target="_blank" rel="noopener" style="font-size:14px;color:#C7CCE0">NASA Glenn ↗</a>
        <a href="https://ntrs.nasa.gov/" target="_blank" rel="noopener" style="font-size:14px;color:#C7CCE0">NASA NTRS ↗</a>
        <a href="https://www.combustioninstitute.org/" target="_blank" rel="noopener" style="font-size:14px;color:#C7CCE0">Combustion Institute ↗</a>
        <a href="https://scholar.google.com/" target="_blank" rel="noopener" style="font-size:14px;color:#C7CCE0">Google Scholar ↗</a>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);font-size:12.5px;color:#6B7390">
      <span>© 2026 FlameLens. Research summaries for education; not affiliated with NASA.</span>
      <span style="font-family:'Geist Mono',monospace">Earth orbit · ~400 km</span>
    </div>
  </div>
</footer>
</main>

<sc-if value="{{ showModal }}" hint-placeholder-val="{{ false }}">
  <div onClick="{{ closeExp }}" style="position:fixed;inset:0;z-index:100;background:rgba(3,5,12,0.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px">
    <div ref="{{ modalRef }}" role="dialog" aria-modal="true" aria-label="{{ m.name }}" onClick="{{ stop }}" style="position:relative;width:100%;max-width:960px;max-height:90vh;overflow:auto;border-radius:28px;background:rgba(9,13,28,0.96);border:1px solid rgba(160,176,255,0.16);box-shadow:0 40px 120px -30px rgba(0,0,0,0.8)">
      <div style="position:relative;height:clamp(180px,30vw,280px);background:repeating-linear-gradient(135deg,rgba(255,255,255,0.035) 0 1px,transparent 1px 11px),#070b18;border-bottom:1px solid rgba(255,255,255,0.06)">
        <div style="position:absolute;inset:0;background:{{ m.glow }}"></div>
        <span style="position:absolute;left:24px;bottom:18px;right:120px;font-family:'Geist Mono',monospace;font-size:11px;color:#7E88A3">[ image: {{ m.image }} ]</span>
        <button onClick="{{ closeExp }}" aria-label="Close" style="position:absolute;top:16px;right:16px;width:42px;height:42px;border-radius:50%;background:rgba(5,7,17,0.7);border:1px solid rgba(255,255,255,0.14);color:#F5F7FF;cursor:pointer;display:flex;align-items:center;justify-content:center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke-width:1.8;stroke-linecap:round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>
        </button>
      </div>
      <div style="padding:clamp(24px,4vw,44px);display:flex;flex-direction:column;gap:30px">
        <div style="display:flex;flex-direction:column;gap:10px">
          <span style="font-family:'Geist Mono',monospace;font-size:11.5px;letter-spacing:0.12em;color:{{ m.hue }}">{{ m.index }} · {{ m.period }}</span>
          <h2 style="margin:0;font-size:clamp(40px,5vw,64px);font-weight:500;letter-spacing:-0.045em;line-height:1">{{ m.code }}</h2>
          <span style="font-size:18px;color:#C7CCE0">{{ m.name }}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:1px;border-radius:16px;overflow:hidden;background:rgba(160,176,255,0.1);border:1px solid rgba(160,176,255,0.1)">
          <sc-for list="{{ m.facts }}" as="f" hint-placeholder-count="3">
            <div style="padding:16px 18px;background:#0A1020;display:flex;flex-direction:column;gap:6px"><span style="font-family:'Geist Mono',monospace;font-size:10.5px;letter-spacing:0.12em;color:#6B7390">{{ f.k }}</span><span style="font-size:14px;line-height:1.45;color:#F5F7FF">{{ f.v }}</span></div>
          </sc-for>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:30px">
          <div style="display:flex;flex-direction:column;gap:14px">
            <span style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7390">SCIENTIFIC OBJECTIVE</span>
            <p style="margin:0;font-size:18px;line-height:1.55;color:#F5F7FF;text-wrap:pretty">{{ m.objective }}</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#A9B0C6;text-wrap:pretty">{{ m.detail }}</p>
            <sc-if value="{{ m.hasNote }}" hint-placeholder-val="{{ false }}">
              <p style="margin:0;padding:12px 14px;border-radius:12px;background:rgba(255,113,56,0.08);border:1px solid rgba(255,113,56,0.22);font-size:13px;line-height:1.55;color:#FFB892">{{ m.note }}</p>
            </sc-if>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <span style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7390">RESEARCH QUESTIONS</span>
            <sc-for list="{{ m.questions }}" as="qq" hint-placeholder-count="3">
              <div style="display:flex;gap:12px;font-size:14.5px;line-height:1.55;color:#C7CCE0"><span style="flex-shrink:0;margin-top:8px;width:5px;height:5px;border-radius:50%;background:{{ m.hue }}"></span>{{ qq }}</div>
            </sc-for>
          </div>
        </div>
        <sc-if value="{{ m.hasPapers }}" hint-placeholder-val="{{ false }}">
          <div style="display:flex;flex-direction:column;gap:12px">
            <span style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7390">RELATED PAPERS IN THE LIBRARY</span>
            <sc-for list="{{ m.papers }}" as="p" hint-placeholder-count="2">
              <a href="{{ p.href }}" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;gap:16px;align-items:center;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#F5F7FF" style-hover="border-color:rgba(53,184,255,0.4);color:#F5F7FF">
                <span style="display:flex;flex-direction:column;gap:4px"><span style="font-size:14.5px;line-height:1.4">{{ p.title }}</span><span style="font-size:12.5px;color:#7E88A3">{{ p.authorsShort }} · {{ p.year }} · {{ p.venue }}</span></span><span style="color:#35B8FF">↗</span>
              </a>
            </sc-for>
          </div>
        </sc-if>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07)">
          <a href="{{ m.ntrs }}" target="_blank" rel="noopener" style="padding:11px 18px;border-radius:999px;background:#F5F7FF;color:#0A1020;font-size:14px;font-weight:500" style-hover="color:#0A1020;background:#fff">Search NASA Technical Reports ↗</a>
          <div style="display:flex;gap:8px">
            <button onClick="{{ prevExp }}" style="padding:10px 16px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.14);color:#F5F7FF;font-size:13px;cursor:pointer">← {{ m.prevCode }}</button>
            <button onClick="{{ nextExp }}" style="padding:10px 16px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.14);color:#F5F7FF;font-size:13px;cursor:pointer">{{ m.nextCode }} →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</sc-if>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;heroMotion&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;Cinematic&quot;,&quot;Calm&quot;,&quot;Still&quot;],&quot;default&quot;:&quot;Cinematic&quot;,&quot;tsType&quot;:&quot;'Cinematic'|'Calm'|'Still'&quot;,&quot;section&quot;:&quot;3D scene&quot;},&quot;showEarth&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true,&quot;tsType&quot;:&quot;boolean&quot;,&quot;section&quot;:&quot;3D scene&quot;},&quot;showHud&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true,&quot;tsType&quot;:&quot;boolean&quot;,&quot;section&quot;:&quot;3D scene&quot;}}">
class Component extends DCLogic {
  CATS = [
    { id: 'micro', name: 'Microgravity Combustion', color: '#8C85FF' },
    { id: 'flame', name: 'Flame Behavior', color: '#FF8A57' },
    { id: 'supp', name: 'Fire Suppression', color: '#35B8FF' },
    { id: 'mat', name: 'Material Flammability', color: '#E9B26B' },
    { id: 'craft', name: 'Spacecraft Safety', color: '#7FD6C2' },
    { id: 'oxy', name: 'Oxygen & Atmosphere', color: '#C3A8FF' },
  ];
  PAPERS = [
    { id: 'p1', title: 'Opportunities and challenges of combustion in microgravity', authors: 'C. K. Law, G. M. Faeth', year: 1994, venue: 'Progress in Energy and Combustion Science', cat: 'micro', exp: null, keywords: ['review', 'buoyancy', 'diffusion flames', 'droplets'],
      abstract: 'A broad review of how removing buoyancy exposes combustion phenomena that gravity obscures on Earth, and of the open problems microgravity research could address.' },
    { id: 'p2', title: 'Microgravity Combustion: Fire in Free Fall', authors: 'H. D. Ross (ed.)', year: 2001, venue: 'Academic Press', cat: 'micro', exp: null, keywords: ['textbook', 'flame spread', 'smoldering', 'droplets', 'fire safety'],
      abstract: 'Edited reference volume covering the fundamentals of reduced-gravity combustion — gas jets, droplets, flame spread over solids, smoldering — and their implications for spacecraft fire safety.' },
    { id: 'p3', title: 'Mechanisms of microgravity flame spread over a thin solid fuel: oxygen and opposed flow effects', authors: 'S. L. Olson', year: 1991, venue: 'Combustion Science and Technology', cat: 'oxy', exp: null, keywords: ['flame spread', 'oxygen concentration', 'opposed flow', 'thin fuel', 'extinction'],
      abstract: 'Examines how ambient oxygen and the speed of an opposing flow govern flame spread and extinction over thin solid fuels when buoyant flow is absent.' },
    { id: 'p4', title: 'Can cool flames support quasi-steady alkane droplet burning?', authors: 'V. Nayagam, D. L. Dietrich, P. V. Ferkul, M. C. Hicks, F. A. Williams', year: 2012, venue: 'Combustion and Flame', cat: 'flame', exp: 'flex', keywords: ['cool flames', 'droplet', 'n-heptane', 'low-temperature chemistry', 'ISS'],
      abstract: 'Reports observations from the ISS in which n-alkane droplets continued burning after visible flame extinction, sustained by low-temperature “cool flame” chemistry.' },
    { id: 'p5', title: 'Droplet combustion experiments aboard the International Space Station', authors: 'D. L. Dietrich, V. Nayagam, M. C. Hicks, P. V. Ferkul, F. L. Dryer, T. Farouk, B. D. Shaw, H. K. Suh, M. Y. Choi, Y. C. Liu, C. T. Avedisian, F. A. Williams', year: 2014, venue: 'Microgravity Science and Technology', cat: 'supp', exp: 'flex', keywords: ['droplet', 'extinction', 'diluents', 'radiative extinction', 'FLEX'],
      abstract: 'Overview of the FLEX droplet combustion campaign in the Combustion Integrated Rack: hardware, fuels and atmospheres tested, and key observations on extinction behavior.' },
    { id: 'p6', title: 'Cool-flame extinction during n-alkane droplet combustion in microgravity', authors: 'V. Nayagam, D. L. Dietrich, M. C. Hicks, F. A. Williams', year: 2015, venue: 'Combustion and Flame', cat: 'flame', exp: 'flex', keywords: ['cool flames', 'extinction', 'droplet', 'n-alkane'],
      abstract: 'Analyzes the conditions under which the low-temperature, cool-flame burning stage of n-alkane droplets itself extinguishes in microgravity.' },
    { id: 'p7', title: 'Pyrolysis smoke generated under low-gravity conditions', authors: 'G. W. Mulholland, M. Meyer, D. L. Urban, G. A. Ruff, Z. Yuan, V. Bryg, T. Cleary, J. Yang', year: 2015, venue: 'Aerosol Science and Technology', cat: 'craft', exp: 'same', keywords: ['smoke', 'aerosol', 'particle size', 'smoke detection', 'pyrolysis'],
      abstract: 'Characterizes smoke particles produced by heating common spacecraft materials in low gravity aboard the ISS, with implications for spacecraft smoke detector design.' },
    { id: 'p8', title: 'The effect of gravity on flame spread over PMMA cylinders', authors: 'S. Link, X. Huang, C. Fernandez-Pello, S. Olson, P. Ferkul', year: 2018, venue: 'Scientific Reports', cat: 'mat', exp: 'bass', keywords: ['PMMA', 'flame spread', 'cylinders', 'buoyancy', 'forced flow'],
      abstract: 'Compares flame spread over acrylic cylinders in normal gravity and in microgravity, separating the influence of buoyant flow from imposed flow on spread behavior.' },
    { id: 'p9', title: 'Microgravity flammability boundary for PMMA rods in axial stagnation flow: experimental results and energy balance analyses', authors: 'S. L. Olson, P. V. Ferkul', year: 2017, venue: 'Combustion and Flame', cat: 'mat', exp: 'bass', keywords: ['flammability limit', 'PMMA', 'stagnation flow', 'oxygen', 'BASS-II'],
      abstract: 'Maps where acrylic rods can and cannot sustain a flame in microgravity as flow and oxygen vary, using orbital test data and an energy-balance analysis.' },
    { id: 'p10', title: 'Flame spread: effects of microgravity and scale', authors: 'D. L. Urban, P. Ferkul, S. Olson, G. A. Ruff, J. Easton, J. S. T’ien, et al.', year: 2019, venue: 'Combustion and Flame', cat: 'craft', exp: 'saffire', keywords: ['Saffire', 'scale', 'flame spread', 'spacecraft fire', 'Cygnus'],
      abstract: 'Brings together large-scale Saffire burns and smaller orbital tests to examine how flame spread in microgravity depends on sample size and flow.' },
  ];
  EXPS = [
    { id: 'saffire', code: 'Saffire', name: 'Spacecraft Fire Experiment', hue: '#FF8A57', platformShort: 'CYGNUS', platform: 'Uncrewed Northrop Grumman Cygnus vehicles, after departing the ISS', period: '2016–2021 · Saffire-I to VI',
      objective: 'Observe how large fires grow and spread in a spacecraft-scale volume, and how they change the cabin atmosphere.',
      desc: 'Burns run inside cargo vehicles after they leave the station — allowing flames far larger than could ever be tested near a crew.',
      detail: 'Earlier orbital flame-spread tests used small samples. Saffire moved the question to realistic scale: a flow duct holding large material samples, instrumented with cameras and sensors to record flame spread and changes in pressure, oxygen and combustion products. Data were downlinked before the vehicle re-entered.',
      questions: ['How does flame spread scale from lab samples to spacecraft-size materials?', 'How quickly does a fire alter cabin pressure and atmosphere?', 'Which measurements matter most for detection and response?'],
      image: 'Saffire flame-spread footage aboard Cygnus' },
    { id: 'flex', code: 'FLEX', name: 'Flame Extinguishment Experiment', hue: '#35B8FF', platformShort: 'ISS · CIR', platform: 'ISS · Combustion Integrated Rack', period: 'Began 2009 · FLEX, FLEX-2',
      objective: 'Understand how fuel droplets burn and extinguish in microgravity, informing spacecraft fire suppression.',
      desc: 'Free-floating fuel droplets are ignited and burn as near-perfect spheres, isolating combustion chemistry from buoyancy.',
      detail: 'Without buoyant convection, a burning droplet forms a spherically symmetric flame — an ideal test case for combustion models. FLEX tested fuels and diluted atmospheres to find extinction limits, and produced the unexpected observation of droplets that kept burning after the visible flame went out.',
      questions: ['Under which conditions do droplet flames extinguish?', 'How do inert diluents change suppression effectiveness?', 'What sustains burning after visible extinction?'],
      image: 'FLEX burning droplet, Combustion Integrated Rack' },
    { id: 'bass', code: 'BASS', name: 'Burning and Suppression of Solids', hue: '#E9B26B', platformShort: 'ISS · MSG', platform: 'ISS · Microgravity Science Glovebox', period: 'Early 2010s · BASS, BASS-II',
      objective: 'Examine how solid materials ignite, burn and extinguish across a range of flow speeds and oxygen levels.',
      desc: 'Solid samples — including acrylic (PMMA) and fabric-like sheets — burned in a controlled low-speed flow inside the glovebox.',
      detail: 'Spacecraft materials are screened for flammability on Earth, where buoyancy feeds flames. BASS studied flames over solids when the only flow is a slow imposed airflow, similar to cabin ventilation, and whether reducing flow or adding a suppressant could put them out.',
      questions: ['Do Earth-based flammability tests remain conservative in orbit?', 'How does sample geometry affect spread?', 'How effective is flow reduction as a suppression strategy?'],
      image: 'BASS flame over PMMA sample in glovebox' },
    { id: 'acme', code: 'ACME', name: 'Advanced Combustion via Microgravity Experiments', hue: '#8C85FF', platformShort: 'ISS · CIR', platform: 'ISS · Combustion Integrated Rack', period: 'Late 2010s · suite of independent studies',
      objective: 'Study gaseous flames to improve combustion efficiency, reduce pollutants, and inform fire safety.',
      desc: 'A suite of independent investigations sharing one hardware insert to study gaseous flames without buoyant distortion.',
      detail: 'Topics across the ACME suite include flame extinction limits, soot formation and “flame design” — tuning conditions to control soot. It also included the Burning Rate Emulator, which uses gaseous fuels to emulate burning solids for fire-safety research.',
      questions: ['How can flames be designed to produce less soot?', 'What sets extinction limits of gaseous diffusion flames?', 'Can gaseous burners emulate how solids burn?'],
      image: 'ACME gaseous flame, Combustion Integrated Rack' },
    { id: 'same', code: 'SAME', name: 'Smoke Aerosol Measurement Experiment', hue: '#7FD6C2', platformShort: 'ISS · MSG', platform: 'ISS · Microgravity Science Glovebox', period: 'Late 2000s',
      objective: 'Measure the smoke particles produced by spacecraft materials in low gravity to improve smoke detector design.',
      desc: 'Common spacecraft materials were heated to produce smoke, which was then characterized by particle size.',
      detail: 'Spacecraft smoke detectors were historically designed with smoke data gathered on Earth. Because particle growth depends on flows that gravity drives, smoke in orbit can differ. SAME measured smoke from several materials under controlled heating to provide in-orbit data.',
      questions: ['How does low-gravity smoke differ from smoke on Earth?', 'Are current detector designs sensitive to it?', 'How does particle size vary by material?'],
      note: 'Naming note: the brief described SAME as “Spacecraft Atmosphere Monitoring”. The NASA program with this acronym is the Smoke Aerosol Measurement Experiment — confirm against NASA sources before publishing.',
      image: 'SAME smoke sample hardware in glovebox' },
    { id: 'sofie', code: 'SoFIE', name: 'Solid Fuel Ignition and Extinction', hue: '#C3A8FF', platformShort: 'ISS · CIR', platform: 'ISS · Combustion Integrated Rack', period: '2020s · multiple investigations',
      objective: 'Determine how solid materials ignite and how flames over them grow or go out across pressures, oxygen levels and flow speeds.',
      desc: 'A modular insert supporting several investigations into material flammability, spanning current and future exploration atmospheres.',
      detail: 'Future vehicles and habitats may use lower cabin pressure and higher oxygen fractions than the ISS. SoFIE supports investigations measuring ignition, flame spread and extinction across those conditions, testing whether Earth-based material screening remains conservative.',
      questions: ['How do reduced pressure and elevated oxygen change ignition?', 'What governs extinction over solid fuels?', 'How should materials be screened for exploration habitats?'],
      image: 'SoFIE sample flame, Combustion Integrated Rack' },
  ];
  INSIGHTS = [
    { id: 'i1', featured: true, title: 'Droplets can keep burning after the flame goes dark', status: 'est', cat: 'flame', ref: 'p4', exp: 'flex', viz: 'two-stage droplet burning',
      text: 'During FLEX, some n-alkane droplets continued to vaporize and react after their visible hot flame extinguished, sustained by low-temperature “cool flame” chemistry — a burning regime that is very difficult to observe this way on Earth.' },
    { id: 'i2', title: 'Without buoyancy, diffusion shapes the flame', status: 'est', cat: 'micro', ref: 'p1', exp: null, viz: 'teardrop vs spherical flame',
      text: 'On Earth, hot gases rise and draw in fresh air, giving flames their teardrop shape. In microgravity that convection disappears; fuel and oxygen meet by diffusion, producing slower, often spherical flames.' },
    { id: 'i3', title: 'Large droplet flames can go out through radiative heat loss', status: 'est', cat: 'flame', ref: 'p5', exp: 'flex', viz: 'flame radius over time',
      text: 'Droplet flames in microgravity can grow large and slow, losing a greater share of heat by radiation — which can itself cause extinction.' },
    { id: 'i4', title: 'Suppression validated on Earth may need re-validation in orbit', status: 'hyp', cat: 'supp', ref: 'p5', exp: 'flex', viz: 'diluent concentration map',
      text: 'Because extinction mechanisms in microgravity differ from those in normal gravity, suppressant concentrations proven on the ground may not transfer directly to spacecraft. This motivates research rather than settling it.' },
    { id: 'i5', title: 'Flow speed decides whether a flame spreads or dies', status: 'est', cat: 'oxy', ref: 'p3', exp: null, viz: 'flammability map: oxygen × flow',
      text: 'For thin solid fuels in microgravity, spread or extinction depends on both ambient oxygen and the speed of the surrounding flow. At very low flow, flames can extinguish because oxygen is not supplied fast enough.' },
    { id: 'i6', title: 'Gravity changes how flames spread over acrylic', status: 'est', cat: 'mat', ref: 'p8', exp: 'bass', viz: 'flame profile on PMMA rod',
      text: 'Comparisons of flame spread over PMMA cylinders show buoyant flow on Earth and imposed flow in orbit produce different spread behavior — ground tests do not fully represent orbital conditions.' },
    { id: 'i7', title: 'Smoke measured in orbit informs detector design', status: 'est', cat: 'craft', ref: 'p7', exp: 'same', viz: 'particle size distribution',
      text: 'Smoke from heated spacecraft materials was characterized directly in low gravity, giving particle data for designing and evaluating spacecraft smoke detectors.' },
    { id: 'i8', title: 'Scale changes the picture of spacecraft fire', status: 'est', cat: 'craft', ref: 'p10', exp: 'saffire', viz: 'sample size comparison',
      text: 'Large-scale Saffire burns allowed flame spread to be studied over samples far larger than earlier orbital tests, linking small experiments to spacecraft-scale fire risk.' },
    { id: 'i9', title: 'Exploration atmospheres need new flammability data', status: 'hyp', cat: 'oxy', ref: null, exp: 'sofie', viz: 'pressure × oxygen envelope',
      text: 'Habitats with reduced pressure and elevated oxygen may change how materials ignite and burn. This is an open question that SoFIE investigations are designed to address.' },
    { id: 'i10', title: 'Starving the flame: ventilation as a suppression lever', status: 'ai', cat: 'supp', ref: 'p3', exp: null, viz: 'flow shut-off scenario',
      text: 'FlameLens synthesis: if microgravity flames weaken when flow drops, stopping cabin ventilation could aid suppression — consistent with common spacecraft fire response, but not a conclusion drawn by the cited paper.' },
    { id: 'i11', title: 'Learning early fire signatures from orbital burn data', status: 'ai', cat: 'craft', ref: null, exp: 'saffire', viz: 'sensor time series',
      text: 'FlameLens synthesis: video and sensor records from orbital burns could train models to recognize early fire signatures in cabins. Untested — no cited study evaluates this.' },
  ];
  STATUS = {
    est: { label: 'ESTABLISHED', color: '#35B8FF', bg: 'rgba(53,184,255,0.12)', desc: 'Published, peer-reviewed result. Linked to a traceable source.' },
    hyp: { label: 'HYPOTHESIS', color: '#FF9461', bg: 'rgba(255,113,56,0.12)', desc: 'Open research question motivating current work. Not yet settled.' },
    ai: { label: 'AI INTERPRETATION', color: '#A9A3FF', bg: 'rgba(108,99,255,0.16)', desc: 'Synthesis generated by FlameLens. Not a scientific claim.' },
  };

  state = { page: 'home', scrollY: 0, w: typeof window !== 'undefined' ? window.innerWidth : 1280, menuOpen: false,
    q: '', cat: 'all', year: 'all', sort: 'relevance', loading: false, visible: 6, focus: false,
    exp: null, icat: 'all', istatus: 'all', countT: 0 };

  canvasRef = React.createRef(); mainRef = React.createRef(); searchRef = React.createRef(); scrollDotRef = React.createRef(); modalRef = React.createRef();

  componentDidMount() {
    this.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.onHash = () => this.route();
    this.onScroll = () => { const y = window.scrollY; if ((y > 30) !== (this.state.scrollY > 30)) this.setState({ scrollY: y }); else this.state.scrollY = y; };
    this.onResize = () => { this.setState({ w: window.innerWidth }); this.layoutScene && this.layoutScene(); };
    this.onKey = (e) => {
      if (e.key === 'Escape') { if (this.state.exp) this.closeExp(); else if (this.state.menuOpen) this.setState({ menuOpen: false }); }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); this.openSearch(); }
    };
    this.onMouse = (e) => { this.mx = e.clientX / window.innerWidth - 0.5; this.my = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener('hashchange', this.onHash);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('mousemove', this.onMouse, { passive: true });
    this.route(true);
    let tries = 0;
    const wait = () => {
      const cv = this.canvasRef.current || document.querySelector('canvas[data-fl-scene]');
      if (window.THREE && cv && !this.renderer) { try { this.initScene(cv); } catch (e) { console.error('FlameLens scene init failed:', e && e.message, e); } }
      else if (!this.renderer && tries++ < 150) this.waitT = setTimeout(wait, 100);
    };
    wait();
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHash); window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize); window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('mousemove', this.onMouse);
    cancelAnimationFrame(this.raf); clearTimeout(this.waitT); clearTimeout(this.loadT);
    if (this.renderer) this.renderer.dispose();
    this.io && this.io.disconnect();
  }
  componentDidUpdate() {
    const prev = this._prev || { page: this.state.page, exp: null }; this._prev = { page: this.state.page, exp: this.state.exp };
    if (prev.page !== this.state.page) this.afterPage();
    if (!prev.exp && this.state.exp) { document.body.style.overflow = 'hidden'; }
    if (prev.exp && !this.state.exp) { document.body.style.overflow = ''; }
    if (prev.exp !== this.state.exp && this.state.exp && this.modalRef.current) {
      this.modalRef.current.scrollTop = 0;
      if (!this.reduced) this.modalRef.current.animate([{ opacity: 0, transform: 'translateY(16px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }

  route(initial) {
    const h = (location.hash || '').replace(/^#\/?/, '');
    const [seg, sub] = h.split('/');
    const page = ['library', 'experiments', 'insights'].includes(seg) ? seg : (seg === '' || seg === undefined ? 'home' : null);
    if (!page) return; // in-page anchors like #stats
    const next = { page, menuOpen: false };
    if (seg === 'experiments' && sub && this.EXPS.find(e => e.id === sub)) next.exp = sub;
    if (page !== this.state.page || initial) window.scrollTo(0, 0);
    this.setState(next, () => { if (initial) this.afterPage(); });
  }
  afterPage() {
    const main = this.mainRef.current;
    if (main && !this.reduced) main.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)' });
    if (this.state.page === 'home') this.runCount();
    const dot = this.scrollDotRef.current;
    if (dot && !this.reduced) dot.animate([{ transform: 'translateY(-12px)' }, { transform: 'translateY(40px)' }], { duration: 1800, iterations: Infinity, easing: 'cubic-bezier(.6,0,.4,1)' });
    this.io && this.io.disconnect();
    if (this.reduced || !main || !window.IntersectionObserver) return;
    this.io = new IntersectionObserver((entries) => entries.forEach(en => {
      if (en.isIntersecting) { en.target.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 800, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }); this.io.unobserve(en.target); }
    }), { threshold: 0.12 });
    main.querySelectorAll('[data-reveal]').forEach(el => { const r = el.getBoundingClientRect(); if (r.top > window.innerHeight * 0.9) this.io.observe(el); });
  }
  runCount() {
    if (this.reduced) { this.setState({ countT: 1 }); return; }
    const t0 = performance.now() + 300;
    const step = (t) => { const k = Math.min(1, Math.max(0, (t - t0) / 1600)); this.setState({ countT: k }); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  go = (h) => { location.hash = h; };
  openSearch = () => {
    if (this.state.page !== 'library') this.go('#/library');
    setTimeout(() => this.searchRef.current && this.searchRef.current.focus(), 120);
  };
  setFilter(patch) {
    clearTimeout(this.loadT);
    this.setState({ ...patch, loading: true, visible: 6 });
    this.loadT = setTimeout(() => this.setState({ loading: false }), 320);
  }
  openExp = (id) => this.setState({ exp: id, menuOpen: false });
  closeExp = () => { this.setState({ exp: null }); if (/^#\/experiments\//.test(location.hash)) history.replaceState(null, '', '#/experiments'); };
  catOf(id) { return this.CATS.find(c => c.id === id); }
  expOf(id) { return this.EXPS.find(e => e.id === id); }
  scholar(p) { return 'https://scholar.google.com/scholar?q=' + encodeURIComponent('"' + p.title + '"'); }
  shortAuthors(a) { const parts = a.split(','); return parts.length > 2 ? parts[0].trim() + ' et al.' : a; }
  paperVM = (p) => { const c = this.catOf(p.cat); const e = p.exp && this.expOf(p.exp);
    return { ...p, catName: c.name, catColor: c.color, href: this.scholar(p), authorsShort: this.shortAuthors(p.authors), tags: p.keywords.slice(0, 3),
      hasExp: !!e, expCode: e ? e.code + ' →' : '', openExp: () => e && this.openExp(e.id) }; };
  refLabel(p) { return this.shortAuthors(p.authors).replace(' et al.', ' et al.') + ' (' + p.year + ') · ' + p.venue; }

  filtered() {
    const { q, cat, year, sort } = this.state;
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    let list = this.PAPERS.map(p => {
      let score = 0;
      if (terms.length) {
        const t = p.title.toLowerCase(), k = p.keywords.join(' ').toLowerCase();
        const rest = (p.abstract + ' ' + p.authors + ' ' + p.venue + ' ' + this.catOf(p.cat).name + ' ' + (p.exp || '')).toLowerCase();
        for (const term of terms) { let m = 0; if (t.includes(term)) m += 3; if (k.includes(term)) m += 2; if (rest.includes(term)) m += 1; if (!m) return null; score += m; }
      }
      return { p, score };
    }).filter(Boolean);
    const base = list;
    if (cat !== 'all') list = list.filter(x => x.p.cat === cat);
    if (year !== 'all') list = list.filter(x => String(x.p.year) === year);
    list.sort(sort === 'newest' ? (a, b) => b.p.year - a.p.year : (a, b) => (b.score - a.score) || (b.p.year - a.p.year));
    return { list: list.map(x => x.p), base: base.map(x => x.p) };
  }

  initScene(cv) {
    const T = window.THREE; if (!cv) return;
    let r;
    try { r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { console.warn('FlameLens: WebGL unavailable, using fallback background'); return; }
    this.renderer = r;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    r.setSize(window.innerWidth, window.innerHeight, false);
    r.setClearColor(0x000000, 0);
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    cam.position.set(0, 0, 9);
    const mob = window.innerWidth < 880;
    const U = { uTime: { value: 0 }, uAlpha: { value: 1 }, uPR: { value: r.getPixelRatio() } };

    // stars
    const N = mob ? 1600 : 3200, sp = new Float32Array(N * 3), sc = new Float32Array(N * 3), ss = new Float32Array(N), sph = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, rr = 70 + Math.random() * 90, s = Math.sqrt(1 - u * u);
      sp.set([rr * s * Math.cos(th), rr * u, rr * s * Math.sin(th) - 20], i * 3);
      const tint = Math.random(); const c = tint < 0.15 ? [1, 0.82, 0.68] : tint < 0.45 ? [0.72, 0.8, 1] : [1, 1, 1];
      sc.set(c, i * 3); ss[i] = Math.pow(Math.random(), 3) * 3.2 + 0.6; sph[i] = Math.random() * 6.28;
    }
    const sg = new T.BufferGeometry();
    sg.setAttribute('position', new T.BufferAttribute(sp, 3)); sg.setAttribute('aColor', new T.BufferAttribute(sc, 3));
    sg.setAttribute('size', new T.BufferAttribute(ss, 1)); sg.setAttribute('phase', new T.BufferAttribute(sph, 1));
    const stars = new T.Points(sg, new T.ShaderMaterial({ uniforms: { uTime: U.uTime, uPR: U.uPR }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: 'attribute vec3 aColor;attribute float size;attribute float phase;uniform float uTime;uniform float uPR;varying vec3 vC;varying float vA;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;float tw=0.6+0.4*sin(uTime*(0.6+fract(phase)*1.4)+phase*3.0);vA=tw;vC=aColor;gl_PointSize=size*uPR*(0.75+0.25*tw);}',
      fragmentShader: 'varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.0,d);a*=a;gl_FragColor=vec4(vC,a*vA);}' }));
    scene.add(stars);

    const cloudTex = (blobs, soft) => {
      const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
      for (let i = 0; i < blobs; i++) {
        const x = 128 + (Math.random() - 0.5) * 120 * soft, y = 128 + (Math.random() - 0.5) * 120 * soft, rad = 30 + Math.random() * 70;
        const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, 'rgba(255,255,255,' + (0.5 / Math.sqrt(blobs)) + ')'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
      }
      const t = new T.CanvasTexture(c); return t;
    };
    const glowTex = cloudTex(1, 0);
    const neb = [[0x6C63FF, -55, 22, -120, 150, 0.22], [0x35B8FF, 60, -6, -140, 160, 0.12], [0xFF7138, 35, 34, -160, 120, 0.08], [0x4B3FD1, -70, -38, -130, 150, 0.16], [0x2a5fd0, 10, 50, -150, 170, 0.08]];
    neb.forEach(([col, x, y, z, s, o]) => {
      const m = new T.Sprite(new T.SpriteMaterial({ map: cloudTex(24, 1), color: col, transparent: true, opacity: o, blending: T.AdditiveBlending, depthWrite: false }));
      m.position.set(x, y, z); m.scale.set(s, s * 0.7, 1); m.material.rotation = Math.random() * 6; scene.add(m);
    });

    // Earth
    const noise = 'float hash(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}float noise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1.,0.,0.)),f.x),mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)),f.x),f.y),mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)),f.x),mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}float fbm(vec3 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return v;}';
    const earthG = new T.Group(); scene.add(earthG);
    const lightDir = new T.Vector3(-0.9, 0.55, 0.35).normalize();
    const earthMat = new T.ShaderMaterial({ transparent: true, uniforms: { uTime: U.uTime, uAlpha: U.uAlpha, uLight: { value: lightDir } },
      vertexShader: 'varying vec3 vN;varying vec3 vP;varying vec3 vWN;void main(){vP=position;vN=normalize(normalMatrix*normal);vWN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float uTime;uniform float uAlpha;uniform vec3 uLight;varying vec3 vN;varying vec3 vP;varying vec3 vWN;' + noise +
        'void main(){vec3 p=normalize(vP);float n=fbm(p*2.2);float land=smoothstep(0.52,0.55,n);vec3 ocean=mix(vec3(0.01,0.03,0.09),vec3(0.03,0.09,0.2),fbm(p*5.0));vec3 ground=mix(vec3(0.09,0.11,0.08),vec3(0.22,0.18,0.12),fbm(p*9.0));vec3 col=mix(ocean,ground,land);float cl=smoothstep(0.52,0.78,fbm(p*3.6+vec3(uTime*0.006,0.0,uTime*0.003)));float diff=dot(normalize(vWN),uLight);float day=smoothstep(-0.2,0.4,diff);col=mix(col,vec3(0.82,0.87,0.97),cl*0.8);vec3 lit=col*(0.02+1.15*day);float city=step(0.78,noise(p*90.0))*land*(1.0-smoothstep(-0.3,0.05,diff))*(1.0-cl);lit+=vec3(1.0,0.55,0.25)*city*0.55;float fr=pow(1.0-max(dot(vN,vec3(0.0,0.0,1.0)),0.0),2.6);lit+=vec3(0.25,0.55,1.0)*fr*(0.15+0.9*day);gl_FragColor=vec4(lit,uAlpha);}' });
    const earth = new T.Mesh(new T.SphereGeometry(1, mob ? 64 : 112, mob ? 64 : 112), earthMat);
    earthG.add(earth);
    const atm = new T.Mesh(new T.SphereGeometry(1.14, 64, 64), new T.ShaderMaterial({ side: T.BackSide, transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uAlpha: U.uAlpha },
      vertexShader: 'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float uAlpha;varying vec3 vN;void main(){float i=pow(max(0.0,0.72-dot(vN,vec3(0.0,0.0,1.0))),2.4);gl_FragColor=vec4(vec3(0.3,0.58,1.0)*i*0.7,i*uAlpha);}' }));
    earthG.add(atm);
    const ringPts = (R, n = 256) => { const a = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; a.push(new T.Vector3(Math.cos(t) * R, 0, Math.sin(t) * R)); } return new T.BufferGeometry().setFromPoints(a); };
    const orbitMat = new T.LineBasicMaterial({ color: 0x8fa6ff, transparent: true, opacity: 0.18, depthWrite: false });
    const orbit = new T.LineLoop(ringPts(1.32), orbitMat); orbit.rotation.set(0.35, 0, 0.18); earthG.add(orbit);
    const sat = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: 0xcfe6ff, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    sat.scale.set(0.05, 0.05, 1); orbit.add(sat);

    // Flame
    const flameG = new T.Group(); scene.add(flameG);
    const FN = mob ? 1400 : 2600, fd = new Float32Array(FN * 3), fr = new Float32Array(FN), fp = new Float32Array(FN), fk = new Float32Array(FN);
    for (let i = 0; i < FN; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      fd.set([s * Math.cos(th), u, s * Math.sin(th)], i * 3);
      const core = Math.random() < 0.22; fk[i] = core ? 1 : 0;
      const g = (Math.random() + Math.random() + Math.random() - 1.5) * 0.06;
      fr[i] = core ? 0.42 + Math.random() * 0.22 : 1.0 + g; fp[i] = Math.random();
    }
    const fg = new T.BufferGeometry();
    fg.setAttribute('position', new T.BufferAttribute(new Float32Array(FN * 3), 3));
    fg.setAttribute('dir', new T.BufferAttribute(fd, 3)); fg.setAttribute('rad', new T.BufferAttribute(fr, 1));
    fg.setAttribute('ph', new T.BufferAttribute(fp, 1)); fg.setAttribute('kind', new T.BufferAttribute(fk, 1));
    fg.boundingSphere = new T.Sphere(new T.Vector3(), 3);
    const flame = new T.Points(fg, new T.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: 'attribute vec3 dir;attribute float rad;attribute float ph;attribute float kind;uniform float uTime;uniform float uPR;uniform float uAlpha;varying vec3 vC;varying float vA;void main(){float br=1.0+0.035*sin(uTime*0.9+ph*6.28)+0.018*sin(uTime*2.1+ph*31.0)+0.03*sin(uTime*0.7+dir.y*3.0+dir.x*2.0);vec3 p=dir*rad*br;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float flick=0.65+0.35*sin(uTime*(2.0+ph*3.0)+ph*40.0);vec3 blue=vec3(0.15,0.42,1.0);vec3 vio=vec3(0.45,0.32,1.0);vec3 org=vec3(1.0,0.45,0.16);vec3 yel=vec3(1.0,0.76,0.42);vC=kind<0.5?mix(blue,vio,fract(ph*7.0)):mix(org,yel,fract(ph*5.0));float rim=kind<0.5?0.6:0.9;vA=flick*uAlpha*rim;gl_PointSize=(kind<0.5?3.4:4.2)*uPR*(9.0/-mv.z)*(0.55+0.9*fract(ph*13.0));}',
      fragmentShader: 'varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.0,d);gl_FragColor=vec4(vC,a*a*vA);}' }));
    flameG.add(flame);
    const SN = mob ? 160 : 320, sd = new Float32Array(SN * 3), sphs = new Float32Array(SN), spd = new Float32Array(SN);
    for (let i = 0; i < SN; i++) { const u = Math.random() * 2 - 1, th = Math.random() * 6.28, s = Math.sqrt(1 - u * u); sd.set([s * Math.cos(th), u, s * Math.sin(th)], i * 3); sphs[i] = Math.random(); spd[i] = 0.04 + Math.random() * 0.08; }
    const sgeo = new T.BufferGeometry();
    sgeo.setAttribute('position', new T.BufferAttribute(new Float32Array(SN * 3), 3));
    sgeo.setAttribute('dir', new T.BufferAttribute(sd, 3)); sgeo.setAttribute('ph', new T.BufferAttribute(sphs, 1)); sgeo.setAttribute('spd', new T.BufferAttribute(spd, 1));
    sgeo.boundingSphere = new T.Sphere(new T.Vector3(), 4);
    flameG.add(new T.Points(sgeo, new T.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: 'attribute vec3 dir;attribute float ph;attribute float spd;uniform float uTime;uniform float uPR;uniform float uAlpha;varying float vA;varying vec3 vC;void main(){float life=fract(uTime*spd+ph);vec3 p=dir*(1.0+life*1.8);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vA=life*(1.0-life)*3.2*uAlpha;vC=mix(vec3(1.0,0.55,0.25),vec3(0.45,0.6,1.0),life);gl_PointSize=2.2*uPR*(9.0/-mv.z);}',
      fragmentShader: 'varying float vA;varying vec3 vC;void main(){float d=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.0,d);gl_FragColor=vec4(vC,a*vA*0.6);}' })));
    const mkGlow = (col, s, o) => { const m = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: col, transparent: true, opacity: o, blending: T.AdditiveBlending, depthWrite: false })); m.scale.set(s, s, 1); m.userData.o = o; flameG.add(m); return m; };
    const glows = [mkGlow(0x3d6dff, 5.6, 0.5), mkGlow(0x6C63FF, 3.2, 0.4), mkGlow(0xff7a3d, 1.7, 0.75), mkGlow(0xfff1e0, 0.4, 1.0)];
    const rings = [];
    const mkRing = (R, rx, rz, col, o) => { const m = new T.LineLoop(ringPts(R), new T.LineBasicMaterial({ color: col, transparent: true, opacity: o, depthWrite: false })); m.rotation.set(rx, 0, rz); m.userData.o = o; flameG.add(m);
      const d = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: col, transparent: true, blending: T.AdditiveBlending, depthWrite: false })); d.scale.set(0.12, 0.12, 1); m.add(d); m.userData.dot = d; m.userData.R = R; rings.push(m); };
    mkRing(1.75, 1.2, 0.35, 0x8c85ff, 0.28); mkRing(2.35, 1.38, -0.5, 0x35b8ff, 0.16);

    this.layoutScene = () => {
      const w = window.innerWidth, h = window.innerHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      const m = w < 880;
      this.flameBase = m ? { x: 0, y: 1.7, s: 0.55 } : { x: Math.min(3.4, 1.9 * (w / h)), y: 0.35, s: 0.95 };
      this.earthBase = m ? { x: 1.2, y: -7.6, s: 4.6 } : { x: 5.2, y: -8.6, s: 6.2 };
    };
    this.layoutScene();
    earthG.rotation.z = 0.32;
    const clock = new T.Clock(); let t = 0, heroA = 1, cx = 0, cy = 0;
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      if (document.hidden) { clock.getDelta(); return; }
      const mode = this.props.heroMotion || 'Cinematic';
      const k = this.reduced || mode === 'Still' ? 0 : mode === 'Calm' ? 0.4 : 1;
      const dt = Math.min(clock.getDelta(), 0.05) * (k === 0 ? 0.08 : k); t += dt; U.uTime.value = t;
      const sy = window.scrollY || 0, vh = window.innerHeight;
      const target = this.state.page === 'home' ? Math.max(0, 1 - sy / (vh * 0.95)) : 0;
      heroA += (target - heroA) * 0.06; U.uAlpha.value = heroA;
      const showEarth = this.props.showEarth !== false;
      earthG.visible = heroA > 0.01 && showEarth; flameG.visible = heroA > 0.01;
      glows.forEach(g => g.material.opacity = g.userData.o * heroA * (0.9 + 0.1 * Math.sin(t * 2.3)));
      rings.forEach((g, i) => { g.material.opacity = g.userData.o * heroA; const a = t * (0.35 - i * 0.12); g.userData.dot.position.set(Math.cos(a) * g.userData.R, 0, Math.sin(a) * g.userData.R); g.userData.dot.material.opacity = heroA; });
      orbitMat.opacity = 0.18 * heroA; sat.material.opacity = heroA;
      const sa = t * 0.5; sat.position.set(Math.cos(sa) * 1.32, 0, Math.sin(sa) * 1.32);
      const fb = this.flameBase, eb = this.earthBase;
      flameG.position.set(fb.x, fb.y + sy * 0.0032, 0); flameG.scale.setScalar(fb.s);
      flameG.rotation.y += dt * 0.12; flameG.rotation.x = Math.sin(t * 0.2) * 0.08;
      earthG.position.set(eb.x, eb.y + sy * 0.0018, -4); earthG.scale.setScalar(eb.s);
      earth.rotation.y += dt * 0.018;
      stars.rotation.y += dt * 0.004; stars.rotation.x = -sy * 0.00004;
      const px = k ? (this.mx || 0) * 0.5 : 0, py = k ? (this.my || 0) * 0.3 : 0;
      cx += (px - cx) * 0.04; cy += (py - cy) * 0.04;
      cam.position.set(cx, -cy, 9); cam.lookAt(0, 0, 0);
      r.render(scene, cam);
    };
    loop();
  }

  renderVals() {
    const s = this.state, mob = s.w < 880;
    const pages = [['home', 'Home', '#/'], ['library', 'Research Library', '#/library'], ['experiments', 'Experiments', '#/experiments'], ['insights', 'Insights', '#/insights']];
    const navItems = pages.map(([id, label, href], i) => { const a = s.page === id;
      return { label, href, num: '0' + (i + 1), aria: a ? 'page' : undefined, color: a ? '#F5F7FF' : '#A3AAC0', bg: a ? 'rgba(108,99,255,0.22)' : 'transparent', shadow: a ? 'inset 0 0 0 1px rgba(140,133,255,0.35)' : 'none' }; });
    const ease = 1 - Math.pow(1 - s.countT, 3);
    const est = this.INSIGHTS.filter(i => i.status === 'est').length;
    const stats = [
      { code: 'PAPERS', label: 'Research papers', value: Math.round(this.PAPERS.length * ease), note: 'Peer-reviewed papers and reference texts', color: '#6C63FF' },
      { code: 'PROGRAMS', label: 'Space experiments', value: Math.round(this.EXPS.length * ease), note: 'NASA fire research programs in orbit', color: '#FF7138' },
      { code: 'FINDINGS', label: 'Established findings', value: Math.round(est * ease), note: 'Each linked to a traceable source', color: '#35B8FF' },
      { code: 'CATEGORIES', label: 'Research categories', value: Math.round(this.CATS.length * ease), note: 'From microgravity combustion to atmosphere', color: '#C3A8FF' },
    ];
    const pv = this.paperVM;
    const featMain = pv(this.PAPERS.find(p => p.id === 'p4'));
    const featRest = ['p10', 'p7'].map(id => pv(this.PAPERS.find(p => p.id === id)));

    const { list, base } = this.filtered();
    const results = list.slice(0, s.visible).map(pv);
    const catChips = [{ id: 'all', name: 'All categories', color: '#F5F7FF' }, ...this.CATS].map(c => { const a = s.cat === c.id;
      return { label: c.name, count: c.id === 'all' ? base.length : base.filter(p => p.cat === c.id).length, dot: c.color, bg: a ? 'rgba(255,255,255,0.1)' : 'rgba(10,16,32,0.5)', border: a ? 'rgba(255,255,255,0.35)' : 'rgba(160,176,255,0.12)', color: a ? '#F5F7FF' : '#A3AAC0', onClick: () => this.setFilter({ cat: c.id }) }; });
    const years = [...new Set(this.PAPERS.map(p => p.year))].sort((a, b) => b - a);
    const yearOpts = [{ v: 'all', label: 'All years' }, ...years.map(y => ({ v: String(y), label: String(y) }))];
    const sortOpts = [['relevance', 'Relevance'], ['newest', 'Newest']].map(([v, label]) => ({ label, bg: s.sort === v ? 'rgba(108,99,255,0.3)' : 'transparent', color: s.sort === v ? '#F5F7FF' : '#929BB2', onClick: () => this.setFilter({ sort: v }) }));
    const hasFilters = s.q !== '' || s.cat !== 'all' || s.year !== 'all' || s.sort !== 'relevance';

    const statusChips = [['all', 'ALL'], ['est', 'ESTABLISHED'], ['hyp', 'HYPOTHESIS'], ['ai', 'AI INTERPRETATION']].map(([v, label]) => { const a = s.istatus === v; const st = this.STATUS[v];
      return { label, bg: a ? (st ? st.bg : 'rgba(255,255,255,0.1)') : 'transparent', border: a ? (st ? st.color : 'rgba(255,255,255,0.35)') : 'rgba(160,176,255,0.14)', color: a ? (st ? st.color : '#F5F7FF') : '#929BB2', onClick: () => this.setState({ istatus: v }) }; });
    const icatChips = [{ id: 'all', name: 'All topics', color: '#F5F7FF' }, ...this.CATS].map(c => { const a = s.icat === c.id;
      return { label: c.name, dot: c.color, bg: a ? 'rgba(255,255,255,0.1)' : 'rgba(10,16,32,0.5)', border: a ? 'rgba(255,255,255,0.35)' : 'rgba(160,176,255,0.12)', color: a ? '#F5F7FF' : '#A3AAC0', onClick: () => this.setState({ icat: c.id }) }; });
    const insVM = (i) => { const c = this.catOf(i.cat), st = this.STATUS[i.status], p = i.ref && this.PAPERS.find(x => x.id === i.ref), e = i.exp && this.expOf(i.exp);
      return { ...i, catName: c.name, catColor: c.color, status: st.label, statusColor: st.color, statusBg: st.bg, hasRef: !!p, noRef: !p, refLabel: p ? this.refLabel(p) : '', refHref: p ? this.scholar(p) : '#',
        hasExp: !!e, expCode: e ? e.code : '', openExp: () => e && this.openExp(e.id), glow: 'radial-gradient(ellipse 60% 120% at 75% 50%,' + c.color + '33,transparent 70%)' }; };
    const insights = this.INSIGHTS.filter(i => !i.featured && (s.icat === 'all' || i.cat === s.icat) && (s.istatus === 'all' || i.status === s.istatus)).map(insVM);
    const feat = insVM(this.INSIGHTS.find(i => i.featured));
    const legend = ['est', 'hyp', 'ai'].map(k => this.STATUS[k]);

    const exps = this.EXPS.map((e, i) => ({ ...e, index: 'EXP · 0' + (i + 1), open: () => this.openExp(e.id), glow: 'radial-gradient(circle at 68% 42%,' + e.hue + '40,transparent 55%),radial-gradient(circle at 30% 80%,rgba(108,99,255,0.12),transparent 50%)' }));
    let m = {}; const mi = this.EXPS.findIndex(e => e.id === s.exp);
    if (mi >= 0) { const e = exps[mi], prev = this.EXPS[(mi + 5) % 6], next = this.EXPS[(mi + 1) % 6];
      const papers = this.PAPERS.filter(p => p.exp === e.id).map(pv);
      m = { ...e, facts: [{ k: 'PLATFORM', v: e.platform }, { k: 'PERIOD', v: e.period }, { k: 'MANAGING CENTER', v: 'NASA Glenn Research Center' }],
        hasNote: !!e.note, papers, hasPapers: papers.length > 0, prevCode: prev.code, nextCode: next.code,
        ntrs: 'https://ntrs.nasa.gov/search?q=' + encodeURIComponent(e.name) };
    }
    const stepExp = (d) => () => { const i = this.EXPS.findIndex(e => e.id === s.exp); this.openExp(this.EXPS[(i + d + 6) % 6].id); };

    return {
      canvasRef: this.canvasRef, mainRef: this.mainRef, searchRef: this.searchRef, scrollDotRef: this.scrollDotRef, modalRef: this.modalRef,
      navBg: s.scrollY > 30 || s.page !== 'home' ? 'rgba(8,12,26,0.72)' : 'rgba(8,12,26,0.28)',
      navBorder: s.scrollY > 30 ? 'rgba(160,176,255,0.16)' : 'rgba(160,176,255,0.09)',
      navItems, isMobile: mob, notMobile: !mob, menuOpen: s.menuOpen, menuClosed: !s.menuOpen, showMobileMenu: mob && s.menuOpen,
      toggleMenu: () => this.setState({ menuOpen: !s.menuOpen }), openSearch: this.openSearch,
      isHome: s.page === 'home', isLibrary: s.page === 'library', isExperiments: s.page === 'experiments', isInsights: s.page === 'insights',
      showHud: !mob && this.props.showHud !== false,
      scrollToStats: (e) => { e.preventDefault(); const el = document.getElementById('stats'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: this.reduced ? 'auto' : 'smooth' }); },
      stats, featMain, featRest, featCols: mob ? 'minmax(0,1fr)' : 'minmax(0,1.35fr) minmax(0,1fr)',
      paperCount: this.PAPERS.length, q: s.q, hasQ: s.q !== '',
      onQ: (e) => this.setFilter({ q: e.target.value }), clearQ: () => this.setFilter({ q: '' }),
      onFocus: () => this.setState({ focus: true }), onBlur: () => this.setState({ focus: false }),
      searchBorder: s.focus ? 'rgba(108,99,255,0.6)' : 'rgba(160,176,255,0.16)', searchShadow: s.focus ? '0 0 0 4px rgba(108,99,255,0.15),0 20px 60px -30px rgba(108,99,255,0.7)' : 'none',
      catChips, year: s.year, yearOpts, onYear: (e) => this.setFilter({ year: e.target.value }), sortOpts, hasFilters,
      clearFilters: () => this.setFilter({ q: '', cat: 'all', year: 'all', sort: 'relevance' }),
      resultLabel: s.loading ? 'Searching…' : (list.length ? 'Showing ' + Math.min(s.visible, list.length) + ' of ' + list.length + ' papers' : '0 results'),
      loading: s.loading, skeletons: [1, 2, 3], showResults: !s.loading && list.length > 0, isEmpty: !s.loading && list.length === 0,
      results, hasMore: !s.loading && list.length > s.visible, remaining: list.length - s.visible, loadMore: () => this.setState({ visible: s.visible + 6 }),
      exps, legend, feat, icatChips, statusChips, insights, hasInsights: insights.length > 0, noInsights: insights.length === 0,
      clearInsightFilters: () => this.setState({ icat: 'all', istatus: 'all' }),
      footCats: this.CATS.map(c => ({ label: c.name, onClick: () => { this.setFilter({ cat: c.id, q: '', year: 'all' }); this.go('#/library'); } })),
      showModal: !!s.exp, m, closeExp: this.closeExp, stop: (e) => e.stopPropagation(), prevExp: stepExp(-1), nextExp: stepExp(1),
    };
  }
}
</script>
</body>
</html>
