'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const MuscleExperience = dynamic(() => import('../components/MuscleExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[330px] sm:h-[380px] lg:h-[410px] flex flex-col items-center justify-center bg-transparent">
      <div className="w-8 h-8 rounded-full border-2 border-[#1B4329] border-t-transparent animate-spin mb-3" />
      <span className="text-[11px] font-mono tracking-widest text-[#1B4329] uppercase">
        Loading 3D Anatomy...
      </span>
    </div>
  ),
});

const CellResponseExperience = dynamic(() => import('../components/CellResponseExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[330px] sm:h-[380px] lg:h-[410px] flex flex-col items-center justify-center bg-transparent">
      <div className="w-8 h-8 rounded-full border-2 border-[#1B4329] border-t-transparent animate-spin mb-3" />
      <span className="text-[11px] font-mono tracking-widest text-[#1B4329] uppercase">
        Loading Cell Response...
      </span>
    </div>
  ),
});

const BoneFoundationExperience = dynamic(() => import('../components/bone/BoneFoundationExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[450px] flex flex-col items-center justify-center bg-transparent">
      <div className="w-8 h-8 rounded-full border-2 border-[#8A2855] border-t-transparent animate-spin mb-3" />
      <span className="text-[11px] font-mono tracking-widest text-[#8A2855] uppercase">
        Loading Bone Education...
      </span>
    </div>
  ),
});

import AfternoonCrashSection from '../components/sections/AfternoonCrashSection';

const Product3DStoryExperience = dynamic(
  () => import('../components/sections/Product3DStoryExperience'),
  { ssr: false }
);

export default function GoProteenPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const armContainerRef = useRef<HTMLDivElement>(null);
  const [orderModal, setOrderModal] = useState<{ open: boolean; plan: string; price: string } | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [userAge, setUserAge] = useState(30);
  const [cellAge, setCellAge] = useState(30);
  const [isProteinBound, setIsProteinBound] = useState(false);
  const [cellAudioPlaying, setCellAudioPlaying] = useState(false);
  const [muscleMode, setMuscleMode] = useState<'loss' | 'gain'>('loss');
  const [splitPos, setSplitPos] = useState(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  const updateSplit = (clientX: number) => {
    if (!armContainerRef.current) return;
    const rect = armContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSplitPos(pct);
  };

  const triggerMuscleLoss = () => {
    setMuscleMode('loss');
    const start = 30;
    const end = 60;
    const dur = 1000;
    const t0 = performance.now();
    const animate = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setUserAge(Math.round(start + (end - start) * p));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const triggerMuscleGain = () => {
    setMuscleMode('gain');
    const start = 60;
    const end = 35;
    const dur = 1000;
    const t0 = performance.now();
    const animate = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setUserAge(Math.round(start - (start - end) * p));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const toggleNarration = () => {
    if (typeof window === 'undefined') return;
    if (audioPlaying) {
      window.speechSynthesis?.cancel();
      setAudioPlaying(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text =
          "The silent loss of independence. Sarcopenia. From around age thirty, we quietly lose roughly one percent of our muscle every year. By age fifty, that rate often doubles, leading to a potential forty percent loss of strength and freedom.";
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.92;
        utt.pitch = 0.98;
        utt.onend = () => setAudioPlaying(false);
        utt.onerror = () => setAudioPlaying(false);
        window.speechSynthesis.speak(utt);
      }
      setAudioPlaying(true);
    }
  };

  const toggleCellNarration = () => {
    if (typeof window === 'undefined') return;
    if (cellAudioPlaying) {
      window.speechSynthesis?.cancel();
      setCellAudioPlaying(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text =
          "The hard-of-hearing cells. Anabolic resistance. As we age, our muscle cells become less responsive to protein signals, especially leucine. They don’t respond as strongly, so muscle rebuilding becomes less efficient. High-density leucine helps overcome this resistance and wake up protein synthesis.";
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.92;
        utt.pitch = 0.98;
        utt.onend = () => setCellAudioPlaying(false);
        utt.onerror = () => setCellAudioPlaying(false);
        window.speechSynthesis.speak(utt);
      }
      setCellAudioPlaying(true);
    }
  };

  useEffect(() => {
    // Helper selectors
    const $ = (s: string) => document.querySelector(s) as HTMLElement | null;
    const $$ = (s: string) => Array.from(document.querySelectorAll(s)) as HTMLElement[];

    let UW = 1;
    let EX = 0;
    let SEL = -1;
    let counted = 0;

    // Toast notification
    const notify = (m: string) => {
      const t = $('#toast');
      if (!t) return;
      t.textContent = m;
      t.classList.add('on');
      if ((notify as any).h) clearTimeout((notify as any).h);
      (notify as any).h = setTimeout(() => t.classList.remove('on'), 2400);
    };
    (window as any).notify = notify;

    // IntersectionObserver for reveal (.r) and stats counter
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add('in');
            if (x.target.id === 'stats' && !counted) {
              counted = 1;
              $$('#stats [data-n]').forEach((s) => {
                const n = +(s.dataset.n || 0);
                const t0 = performance.now();
                (function f(t) {
                  const k = Math.min(1, (t - t0) / 1400);
                  s.textContent = String(Math.round(n * (1 - Math.pow(1 - k, 3))));
                  if (k < 1) requestAnimationFrame(f);
                })(t0);
              });
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    $$('.r').forEach((el) => io.observe(el));

    // Observer for Bone section to hide global navbar logo & 3D chocolate bar
    const boneEl = $('#bone');
    if (boneEl) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              document.body.classList.add('in-bone-section');
              const cv = $('#c') as HTMLCanvasElement | null;
              if (cv) cv.style.opacity = '0';
              const orb = $('#orb');
              if (orb) orb.style.opacity = '0';
            } else {
              document.body.classList.remove('in-bone-section');
            }
          });
        },
        { threshold: 0.2 }
      ).observe(boneEl);
    }

    // Section 1: Sarcopenia muscle fibers (28 bars)
    const fib = $('#fib');
    if (fib && fib.children.length === 0) {
      for (let i = 0; i < 28; i++) {
        const b = document.createElement('i');
        b.style.height = 60 + Math.random() * 40 + '%';
        fib.appendChild(b);
      }
    }

    const ager = $('#ager') as HTMLInputElement | null;
    if (ager && fib) {
      ager.oninput = function () {
        const a = +ager.value;
        const l = a <= 50 ? a - 30 : Math.min(40, 20 + (a - 50) * 2);
        const k = Math.round(28 * (1 - l / 100));
        const agev = $('#agev');
        if (agev) agev.textContent = String(a);
        Array.from(fib.children).forEach((b, i) => (b as HTMLElement).classList.toggle('x', i >= k));
        const ageo = $('#ageo');
        if (ageo) {
          ageo.textContent = l
            ? `Illustrative: up to ~${l}% less muscle by this age if nothing changes.*`
            : 'From around 30 we can lose roughly 1% of muscle a year, and the pace often doubles after 50. Illustrative only.*';
        }
      };
    }

    // Grocery hold button with shake animation
    const holdBtn = $('#hold');
    const ringFill = $('#ring i');
    const hst = $('#hst');
    let holdRaf: number;
    let holdOn = 0;
    if (holdBtn && ringFill && hst) {
      const getLoss = () => {
        const a = ager ? +ager.value : 30;
        return a <= 50 ? a - 30 : Math.min(40, 20 + (a - 50) * 2);
      };
      const stopHold = () => {
        holdOn = 0;
        cancelAnimationFrame(holdRaf);
        ringFill.style.width = '0';
        holdBtn.classList.remove('shake');
        hst.textContent = 'Hold to lift the groceries. Then change your age.';
      };
      holdBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        holdOn = 1;
        const t0 = performance.now();
        const duration = (7 - getLoss() * 0.12) * 1000;
        (function step(t) {
          if (!holdOn) return;
          const k = Math.min(1, (t - t0) / duration);
          ringFill.style.width = k * 100 + '%';
          holdBtn.classList.toggle('shake', k > 0.7);
          hst.textContent =
            k >= 1
              ? 'Arms shaking… knees unsteady… breath short. Now try a younger age.'
              : 'Lifting…';
          holdRaf = requestAnimationFrame(step);
        })(t0);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((v) =>
        holdBtn.addEventListener(v, stopHold)
      );
    }

    // Section 2: Cells Grid (60 cells)
    const cw = $('#cells');
    if (cw && cw.children.length === 0) {
      cw.innerHTML = '<i></i>'.repeat(60);
      const cl = Array.from(cw.children) as HTMLElement[];
      cw.addEventListener('pointermove', (e) => {
        const on = cw.classList.contains('on');
        cl.forEach((c) => {
          const r = c.getBoundingClientRect();
          const k = Math.max(
            0,
            1 - Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2) / 120
          );
          c.style.transform = `scale(${1 + k * 0.9})`;
          c.style.background = !on && k > 0.05 ? `rgba(255,138,43,${k})` : '';
        });
      });
      cw.addEventListener('pointerleave', () => {
        const on = cw.classList.contains('on');
        cl.forEach((c) => {
          c.style.transform = '';
          if (!on) c.style.background = '';
        });
      });
    }

    const leu = $('#leu');
    if (leu && cw) {
      leu.onclick = function () {
        const o = cw.classList.toggle('on');
        leu.textContent = o ? 'Cells awake' : 'Wake the cells with leucine';
      };
    }

    // Section 3: Bone posture spine slider
    const yr = $('#yr') as HTMLInputElement | null;
    const sp = $('#sp');
    const hd = $('#hd');
    const yrl = $('#yrl');
    if (yr && sp && hd && yrl) {
      yr.oninput = function () {
        const y = +yr.value;
        const s = y * 1.6;
        sp.setAttribute('d', `M${100 + s * 0.9} ${54 + y * 0.5} Q${100 + s * 2.2} 120 100 200`);
        hd.setAttribute('cx', String(100 + s * 0.9));
        hd.setAttribute('cy', String(30 + y * 0.5));
        yrl.textContent = y
          ? `In ${y} years · up to ~${y}% less bone density if nothing changes · illustrative*`
          : 'Today';
      };
    }

    // Section 4: Afternoon crash energy curve chips
    const P = [
      'M0 110 C90 110 110 30 180 30 S260 140 340 140 S430 110 520 110',
      'M0 110 C60 110 90 10 150 20 S230 150 330 148 S440 120 520 118',
      'M0 100 C130 90 200 70 260 74 S400 90 520 84',
    ];
    $$('#chips button').forEach((b) =>
      b.addEventListener('click', () => {
        $$('#chips button').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        const curve = $('#curve');
        if (curve) curve.setAttribute('d', P[+(b.dataset.m || 0)]);
        const gap = $('#gap');
        const gapl = $('#gapl');
        if (gap) gap.classList.toggle('full', b.dataset.m === '2');
        if (gapl) {
          gapl.textContent =
            b.dataset.m === '2'
              ? '10 g of clean cellular protein, added.*'
              : 'The silent 10 g deficit';
        }
      })
    );

    // Section 5: Repair kit hotspot chips & orb hue
    const setHue = (sec: HTMLElement | null, h: string | undefined) => {
      if (!sec || !h) return;
      const p = sec.dataset.orb ? sec.dataset.orb.split(' ') : ['0', '0', '1', '0', '1'];
      p[3] = h;
      sec.dataset.orb = p.join(' ');
      pick();
    };

    $$('#hs button').forEach((b) =>
      b.addEventListener('click', () => {
        $$('#hs button').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        const ht = $('#ht');
        if (ht) ht.textContent = b.dataset.t || '';
        setHue($('#rep'), b.dataset.h);
      })
    );

    // Section 6: Breakthrough comparison slider & 5 benefit checkmarks
    const cmpr = $('#cmpr') as HTMLInputElement | null;
    if (cmpr) {
      cmpr.oninput = function () {
        const o = $('.cmp .o');
        if (o) o.style.clipPath = `inset(0 ${100 - +cmpr.value}% 0 0)`;
      };
    }

    const bnl = $$('#bn li');
    bnl.forEach((l) => {
      l.onclick = () => {
        l.classList.toggle('on');
        const n = bnl.filter((x) => x.classList.contains('on')).length;
        const bnc = $('#bnc');
        if (bnc) bnc.textContent = `Tap each one · ${n} / 5`;
        if (n === 5) notify('That’s the feeling ✓');
      };
    });

    // Section 7: Unwrap button
    const uw = $('#uw');
    if (uw) {
      uw.onclick = function () {
        UW = UW ? 0 : 1;
        uw.textContent = UW ? 'Unwrap' : 'Wrap it again';
      };
    }

    // Section 8: Anatomy exploded view
    const LAY = [
      'Textured chocolate-style coating that keeps every bite satisfying.',
      'Whole almonds and cashews for real crunch.',
      '10 g of fermented yeast protein with complete essential amino acids, plus prebiotic fibre and probiotics.*',
      'Sweetened purely with date paste: 0% added sugar.',
    ];
    const exr = $('#exr') as HTMLInputElement | null;
    if (exr) {
      exr.oninput = function () {
        EX = +exr.value / 100;
        SEL = -1;
        $$('.anat button').forEach((x) => x.classList.remove('on'));
      };
    }
    $$('.anat button').forEach((b) =>
      b.addEventListener('click', () => {
        SEL = +(b.dataset.i || 0);
        EX = 1;
        if (exr) exr.value = '100';
        $$('.anat button').forEach((x) => x.classList.toggle('on', x === b));
        const info = $('#info');
        if (info) info.textContent = LAY[SEL];
      })
    );

    // Section 9: Synbiotic canvas bubbles & lock blood sugar
    (function () {
      const g = $('#gut');
      const cv = $('#bb') as HTMLCanvasElement | null;
      if (!g || !cv) return;
      const x = cv.getContext('2d');
      if (!x) return;
      let B: any[] = [];
      let vis = 0;
      let mx = -999;
      let my = -999;

      new IntersectionObserver((e) => {
        vis = e[0].isIntersecting ? 1 : 0;
        if (vis) tick();
      }).observe(g);

      const mk = () => ({
        x: Math.random() * cv.width,
        y: cv.height + Math.random() * 200,
        r: 14 + Math.random() * 34,
        v: 0.3 + Math.random() * 0.7,
        ph: Math.random() * 6,
        dx: 0,
        dy: 0,
      });

      function sz() {
        if (!cv || !g) return;
        cv.width = g.clientWidth;
        cv.height = g.clientHeight;
        B = Array.from({ length: 26 }, () => {
          const b = mk();
          b.y = Math.random() * cv.height;
          return b;
        });
      }
      sz();
      window.addEventListener('resize', sz);

      g.addEventListener('pointermove', (e) => {
        const r = g.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
      });

      g.addEventListener('click', (e) => {
        const r = g.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        B = B.map((b) => (Math.hypot(b.x - px, b.y - py) < b.r ? mk() : b));
      });

      function tick() {
        if (!vis || !x || !cv) return;
        requestAnimationFrame(tick);
        x.clearRect(0, 0, cv.width, cv.height);
        const t = performance.now() / 1000;
        B.forEach((b) => {
          b.y -= b.v;
          b.x += Math.sin(t + b.ph) * 0.4;
          const d = Math.hypot(b.x - mx, b.y - my);
          if (d < 150) {
            b.dx += ((b.x - mx) / d) * 0.8;
            b.dy += ((b.y - my) / d) * 0.8;
          }
          b.x += b.dx;
          b.y += b.dy;
          b.dx *= 0.92;
          b.dy *= 0.92;
          if (b.y < -60) Object.assign(b, mk());

          const gr = x.createRadialGradient(
            b.x - b.r * 0.3,
            b.y - b.r * 0.3,
            b.r * 0.1,
            b.x,
            b.y,
            b.r
          );
          gr.addColorStop(0, 'hsla(280,90%,92%,.55)');
          gr.addColorStop(1, 'hsla(260,80%,60%,.12)');
          x.fillStyle = gr;
          x.strokeStyle = 'hsla(260,80%,65%,.35)';
          x.beginPath();
          x.arc(b.x, b.y, b.r, 0, 7);
          x.fill();
          x.stroke();
        });
      }
    })();

    let lk = false;
    const lockBtn = $('#lock');
    if (lockBtn) {
      lockBtn.onclick = function () {
        lk = !lk;
        const bs = $('#bs');
        if (bs) {
          bs.setAttribute(
            'd',
            lk
              ? 'M0 40 C130 40 260 40 520 40'
              : 'M0 40 C40 5 80 75 130 40 S210 5 260 40 S350 75 400 40 S480 10 520 40'
          );
        }
        lockBtn.classList.toggle('on', lk);
        const gt = $('#gt');
        if (gt) {
          gt.textContent = lk
            ? 'Every single bite digests smoothly, leaving your stomach light, comfortable and bloat-free. Your blood sugar locks in place.*'
            : 'Effortless Gut & Blood Sugar Harmony.';
        }
      };
    }
    $$('[data-g]').forEach((b) =>
      b.addEventListener('click', () => {
        const gt = $('#gt');
        if (gt) gt.textContent = b.dataset.g || '';
      })
    );

    // Section 10: Clean-label guarantee buttons
    const noContainer = $('#no');
    if (noContainer && noContainer.children.length === 0) {
      const items = [
        'No added sugar',
        'No soy or whey',
        'No dairy',
        'No refined oils',
        'No fake sweeteners',
        'No trans fats',
        'No artificial colours',
        'No gluten',
        'No pesticides, antibiotics or hormones',
      ];
      noContainer.innerHTML = items
        .map((t) => `<button data-t="${t}">${t}</button>`)
        .join('');
      $$('#no button').forEach((b) => {
        b.onclick = () => b.classList.toggle('on');
        const t = b.dataset.t || '';
        b.addEventListener('pointerenter', () => (b.textContent = '✓ ' + t.replace('No ', 'Free of ')));
        b.addEventListener('pointerleave', () => (b.textContent = t));
      });
    }

    const LB = [
      '<s>artificial sugars</s><br><s>palm oils</s><br><s>synthetic fillers</s><br><s>dairy isolates</s><br>…hidden behind flashy marketing claims.',
      '<em>10 g clinically studied fermented yeast protein</em><br><em>Natural date paste</em><br><em>Crunchy whole almonds &amp; cashews</em><br><em>Prebiotic fibre + probiotics</em><br>Total purity. Nothing hidden.',
    ];
    $$('[data-f]').forEach((b) =>
      b.addEventListener('click', () => {
        $$('[data-f]').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        const lab = $('#lab');
        if (lab) lab.innerHTML = LB[+(b.dataset.f || 0)];
      })
    );

    // Section 11: Persona track carousel
    const tr = $('#track');
    let dn = 0;
    let sx = 0;
    let sl = 0;
    if (tr) {
      tr.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        dn = 1;
        sx = e.clientX;
        sl = tr.scrollLeft;
      });
      window.addEventListener('pointerup', () => (dn = 0));
      tr.addEventListener('pointermove', (e) => {
        if (dn) tr.scrollLeft = sl - (e.clientX - sx);
      });
    }
    $$('.card').forEach((c) =>
      c.addEventListener('click', () => {
        $$('.card').forEach((x) => x.classList.toggle('on', x === c));
        const pn = $('#pn');
        if (pn) pn.innerHTML = 'For ' + (c.dataset.n || '') + '.';
        setHue($('#who'), c.dataset.h);
      })
    );

    // Section 12: Pricing cards 3D tilt
    $$('.price>div').forEach((d) => {
      d.addEventListener('pointermove', (e) => {
        const r = d.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        d.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      });
      d.addEventListener('pointerleave', () => (d.style.transform = ''));
    });

    // Magnetic buttons
    $$('.btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${
          (e.clientY - r.top - r.height / 2) * 0.3
        }px)`;
      });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });

    // Crunch action on .crunch buttons
    $$('.crunch').forEach((b) =>
      b.addEventListener('click', (e) => {
        e.preventDefault();
        if ((window as any).crunch) (window as any).crunch();
        const parentDiv = b.closest('div');
        const planName = parentDiv?.querySelector('.mono')?.textContent || 'Box of 6';
        const priceTag = parentDiv?.querySelector('strong')?.textContent || '₹660';
        setOrderModal({ open: true, plan: planName, price: priceTag });
      })
    );

    // Custom cursor (#cur)
    if (window.matchMedia('(pointer:fine)').matches) {
      const cur = $('#cur');
      if (cur) {
        window.addEventListener('pointermove', (e) => {
          cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
        });
        document.addEventListener('pointerover', (e) => {
          const target = e.target as HTMLElement | null;
          cur.classList.toggle('h', !!target?.closest('button,a,.card,input'));
        });
      }
    }

    // Section target tracking & aura orb
    const secs = $$('[data-bar]');
    let act = 0;
    const T = { x: 0, y: -0.02, s: 1.4, ry: 0, rx: 0, op: 1, w: 1, ex: 0 };

    function pick() {
      const c = window.innerHeight / 2;
      let b = 1e9;
      secs.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - c);
        if (d < b) {
          b = d;
          act = i;
        }
      });

      const s = secs[act];
      if (!s) return;
      const o = (s.dataset.orb || '0 0 1 0 1').split(' ').map(Number);
      const k = (s.dataset.bar || '0 0 1 0 0 1 1 0').split(' ').map(Number);
      const m = window.innerWidth < 800;

      document.body.classList.toggle('v', s.dataset.theme === 'v');
      document.body.classList.toggle('in-bone-section', s.id === 'bone');
      document.body.classList.toggle('in-crash-section', s.id === 'crash');

      const orb = $('#orb');
      if (orb) {
        if (s.id === 'bone' || s.id === 'crash') {
          orb.style.opacity = '0';
        } else {
          orb.style.transform = `translate(${o[0] * 22}vw,${o[1] * 10}vh) scale(${o[2]})`;
          orb.style.opacity = String(o[4]);
          orb.style.filter = `blur(34px) hue-rotate(${o[3]}deg)`;
        }
      }

      if (s.id !== 'anat' && SEL > -1) {
        SEL = -1;
        $$('.anat button').forEach((x) => x.classList.remove('on'));
      }

      if (s.id === 'bone' || s.id === 'crash') {
        T.x = 0;
        T.y = 0;
        T.s = 0;
        T.op = 0;
        const cvEl = $('#c') as HTMLCanvasElement | null;
        if (cvEl) {
          cvEl.style.opacity = '0';
          cvEl.style.visibility = 'hidden';
          cvEl.style.pointerEvents = 'none';
        }
      } else {
        const cvEl = $('#c') as HTMLCanvasElement | null;
        if (cvEl && s.id !== 'bone' && s.id !== 'crash') {
          cvEl.style.opacity = '1';
          cvEl.style.visibility = 'visible';
          cvEl.style.pointerEvents = 'none';
        }
        T.x = m ? 0 : k[0];
        T.y = m && k[5] < 0.5 ? k[1] * 0.5 : k[1];
        T.s = m ? k[2] * 0.8 : k[2];
        T.ry = k[3];
        T.rx = k[4];
        T.op = m && k[5] < 0.9 ? Math.min(k[5], 0.15) : k[5];
        T.w = s.id === 'meet' ? UW : k[6];
        T.ex = s.id === 'anat' ? EX : 0;
      }
    }

    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick);
    window.addEventListener('click', () => setTimeout(pick, 0));
    window.addEventListener('input', () => setTimeout(pick, 0));
    pick();

    // Section dots
    const dt = $('#dots');
    if (dt && dt.children.length === 0) {
      secs.forEach((s, i) => {
        const a = document.createElement('a');
        a.href = '#';
        const monoEl = s.querySelector('.mono');
        a.dataset.d = i
          ? (monoEl?.textContent || '').replace(/^\d+ — /, '')
          : 'Start';
        a.onclick = (e) => {
          e.preventDefault();
          s.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        dt.appendChild(a);
      });
    }

    // SpeechSynthesis narration
    let lastAct = -1;
    let lis = 0;
    const ls = $('#listen');
    function say() {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      if (!lis) return;
      const st = secs[act]?.querySelector('.story>div');
      if (!st) return;
      const u = new SpeechSynthesisUtterance(st.textContent?.replace(/\*/g, '') || '');
      u.rate = 0.88;
      u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    }

    function onSc() {
      const prog = $('#prog');
      if (prog) {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        prog.style.width = (window.scrollY / maxScroll) * 100 + '%';
      }
      if (act !== lastAct) {
        lastAct = act;
        if (dt) {
          Array.from(dt.children).forEach((d, i) =>
            (d as HTMLElement).classList.toggle('on', i === act)
          );
        }
        say();
      }
    }
    window.addEventListener('scroll', onSc, { passive: true });
    onSc();

    if (ls) {
      ls.onclick = () => {
        if (!('speechSynthesis' in window)) {
          notify('Narration is not supported on this browser');
          return;
        }
        lis = lis ? 0 : 1;
        ls.classList.toggle('on', !!lis);
        ls.textContent = lis ? '❚❚ PAUSE' : '▶ LISTEN';
        say();
      };
    }

    // Lite mode button
    const liteBtn = $('#lite');
    if (liteBtn) {
      liteBtn.onclick = () => {
        document.body.classList.toggle('lite');
        if (!document.body.classList.contains('lite')) boot3d();
      };
    }

    // Three.js 3D Bar Engine
    const nc = (navigator as any).connection;
    const weak =
      (nc && (nc.saveData || /(^|-)2g|3g/.test(nc.effectiveType || ''))) ||
      ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2) ||
      /lite/.test(location.search);

    let started = false;
    function boot3d() {
      try {
        run3d();
      } catch (e) {
        document.body.classList.add('lite');
      }
    }

    function run3d() {
      if (started) return;
      started = true;

      const cv = $('#c') as HTMLCanvasElement | null;
      if (!cv) return;

      const r = new THREE.WebGLRenderer({
        canvas: cv,
        alpha: true,
        antialias: window.innerWidth > 800,
      });
      r.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth > 800 ? 1.5 : 1.25));
      r.toneMapping = THREE.ACESFilmicToneMapping;
      r.toneMappingExposure = 1.35;
      r.outputColorSpace = THREE.SRGBColorSpace;

      const sc = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(r);
      sc.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      cam.position.z = 5.5;

      // Chocolate bump texture
      const n = document.createElement('canvas');
      n.width = n.height = 128;
      const g = n.getContext('2d');
      if (g) {
        g.fillStyle = '#808080';
        g.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 900; i++) {
          const v = (90 + Math.random() * 110) | 0;
          g.fillStyle = `rgb(${v},${v},${v})`;
          g.beginPath();
          g.arc(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 4, 0, 7);
          g.fill();
        }
      }
      const bump = new THREE.CanvasTexture(n);
      bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
      bump.repeat.set(3, 1);

      const bar = new THREE.Group();
      bar.rotation.order = 'YXZ';
      sc.add(bar);

      const cm = new THREE.MeshStandardMaterial({
        color: 0x3b1d12,
        roughness: 0.38,
        metalness: 0.05,
        bumpMap: bump,
        bumpScale: 2.2,
      });
      const body = new THREE.Group();
      body.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.26, 0.6), cm));

      const lm = new THREE.MeshStandardMaterial({ color: 0x5a2f1c, roughness: 0.5 });
      const nm = new THREE.MeshStandardMaterial({ color: 0xc99358, roughness: 0.6 });
      for (let i = 0; i < 34; i++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), i % 3 ? lm : nm);
        m.scale.set(1.4, 0.6, 1);
        m.position.set(-0.8 + Math.random() * 1.6, 0.13, -0.25 + Math.random() * 0.5);
        m.rotation.y = Math.random() * 3;
        body.add(m);
      }
      bar.add(body);

      // 4 Exploded Layers
      const H = [0.08, 0.07, 0.06, 0.05];
      const Y = [0.09, 0.015, -0.05, -0.105];
      const C = [0x3b1d12, 0xb98650, 0x8a5a3a, 0xa9743f];
      const layers = new THREE.Group();
      const lmats: THREE.MeshStandardMaterial[] = [];
      const lms: THREE.Mesh[] = [];

      H.forEach((h, i) => {
        const mt = new THREE.MeshStandardMaterial({
          color: C[i],
          roughness: 0.5,
          emissive: new THREE.Color(0xff8a2b),
          emissiveIntensity: 0,
          bumpMap: i < 2 ? bump : null,
          bumpScale: 1.5,
        });
        lmats.push(mt);
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.8, h, 0.6), mt);
        m.position.y = Y[i];
        layers.add(m);
        lms.push(m);
      });

      for (let i = 0; i < 22; i++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), nm);
        m.scale.set(1.5, 0.7, 1);
        m.position.set(-0.8 + Math.random() * 1.6, Y[1] + 0.04, -0.22 + Math.random() * 0.44);
        lms[1].add(m);
        m.position.y = 0.04;
      }
      bar.add(layers);

      // Wrapper
      const wc = document.createElement('canvas');
      wc.width = 512;
      wc.height = 186;
      const w = wc.getContext('2d');
      if (w) {
        w.fillStyle = '#5B21B6';
        w.fillRect(0, 0, 512, 186);
        const gr = w.createLinearGradient(0, 0, 0, 186);
        gr.addColorStop(0, 'rgba(255,255,255,.22)');
        gr.addColorStop(1, 'rgba(0,0,0,.25)');
        w.fillStyle = gr;
        w.fillRect(0, 0, 512, 186);
        w.fillStyle = '#fff';
        w.font = '800 64px Inter,Arial,sans-serif';
        w.textAlign = 'center';
        w.textBaseline = 'middle';
        w.fillText('GoProteen', 256, 93);
      }
      const wt = new THREE.CanvasTexture(wc);
      const wm = new THREE.MeshStandardMaterial({
        color: 0x5b21b6,
        metalness: 0.75,
        roughness: 0.28,
        transparent: true,
      });
      const wf = new THREE.MeshStandardMaterial({
        map: wt,
        metalness: 0.6,
        roughness: 0.3,
        transparent: true,
      });

      const wrap = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.36, 0.72), [wm, wm, wf, wf, wm, wm]);
      const crimpL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.8), wm);
      const crimpR = crimpL.clone();
      crimpL.position.x = -1.03;
      crimpR.position.x = 1.03;

      const wg = new THREE.Group();
      wg.add(wrap, crimpL, crimpR);
      bar.add(wg);

      // Groups for the photorealistic 3D GLB model (cover and inner bar)
      const glbWrapperGroup = new THREE.Group();
      const glbBarGroup = new THREE.Group();
      bar.add(glbWrapperGroup);
      bar.add(glbBarGroup);

      let useGLB = false;
      let wrapperMesh: THREE.Mesh | null = null;
      let innerBarMesh: THREE.Mesh | null = null;

      // Load GoProTeen_model.glb
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        '/models/GoProTeen_model.glb',
        (gltf) => {
          const model = gltf.scene;

          model.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (
                child.name.includes('Wrapper') ||
                child.material?.name?.includes('Print') ||
                child.name === 'GoProTeen_Main_Wrapper'
              ) {
                wrapperMesh = child;
              } else if (
                child.name.includes('Bar') ||
                child.material?.name?.includes('Chocolate') ||
                child.name === 'GoProTeen_Inner_Chocolate_Bar'
              ) {
                innerBarMesh = child;
              }
            }
          });

          // Scale factor for GLB model: wrapper is ~0.145m -> enhanced hero product scale
          const scaleFactor = 17.2;

          if (wrapperMesh) {
            wrapperMesh.scale.setScalar(scaleFactor);
            if (wrapperMesh.material) {
              const mat = wrapperMesh.material as THREE.MeshStandardMaterial;
              mat.transparent = true;
              mat.roughness = 0.28;
              mat.metalness = 0.04;
              mat.envMapIntensity = 1.2;
              mat.needsUpdate = true;
            }
            glbWrapperGroup.add(wrapperMesh);
            useGLB = true;
          }

          if (innerBarMesh) {
            innerBarMesh.scale.setScalar(scaleFactor);
            if (innerBarMesh.material) {
              const bMat = innerBarMesh.material as THREE.MeshStandardMaterial;
              bMat.bumpMap = bump;
              bMat.bumpScale = 1.4;
              bMat.roughness = 0.38;
              bMat.envMapIntensity = 0.8;
              bMat.needsUpdate = true;
            }
            glbBarGroup.add(innerBarMesh);
            useGLB = true;
          }

          if (useGLB) {
            body.visible = false;
            wg.visible = false;
          }
        },
        undefined,
        (err) => {
          console.warn('GLB load error, using procedural fallback:', err);
        }
      );

      // Studio Lighting for Photorealistic Product Showcase
      sc.add(new THREE.AmbientLight(0xffffff, 1.4));
      sc.add(new THREE.HemisphereLight(0xffffff, 0x4a1d75, 1.2));

      // Key Front Light (direct illumination on front packaging)
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
      keyLight.position.set(1.5, 2.5, 5);
      sc.add(keyLight);

      // Fill Light (soft shadow lifting)
      const fillLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
      fillLight.position.set(-2.5, 1.2, 4.5);
      sc.add(fillLight);

      // Top Soft Light
      const topLight = new THREE.DirectionalLight(0xffffff, 1.6);
      topLight.position.set(0, 4, 2);
      sc.add(topLight);

      // Front Camera-Aligned Direct Center Light
      const frontCenter = new THREE.PointLight(0xffffff, 2.4, 18);
      frontCenter.position.set(0, 0, 5);
      sc.add(frontCenter);

      // Warm Underglow (harmonizes with aura orb)
      const warmGlow = new THREE.PointLight(0xff8a2b, 2.6, 12);
      warmGlow.position.set(0, -2, 2);
      sc.add(warmGlow);

      // Violet Edge Rim
      const violetRim = new THREE.PointLight(0x8b5cf6, 2.8, 12);
      violetRim.position.set(-3, 1, -1.5);
      sc.add(violetRim);

      // Mouse interactive light
      const mo = new THREE.PointLight(0xffffff, 2.0, 14);
      mo.position.set(0, 0, 4.5);
      sc.add(mo);

      // Crumb Particles
      const N = 80;
      const pg = new THREE.BufferGeometry();
      const pp = new Float32Array(N * 3);
      const pv = new Float32Array(N * 3);
      pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
      const pm = new THREE.PointsMaterial({
        color: 0x7a4a2e,
        size: 0.08,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      sc.add(new THREE.Points(pg, pm));
      let life = 0;
      let punch = 0;

      function burst(p: THREE.Vector3) {
        for (let i = 0; i < N; i++) {
          pp[i * 3] = p.x;
          pp[i * 3 + 1] = p.y;
          pp[i * 3 + 2] = p.z;
          pv[i * 3] = (Math.random() - 0.5) * 0.1;
          pv[i * 3 + 1] = Math.random() * 0.08;
          pv[i * 3 + 2] = (Math.random() - 0.2) * 0.1;
        }
        life = 1;
        punch = 1;
        if (!((window as any).cn = ((window as any).cn || 0) + 1)) (window as any).cn = 1;
        if ((window as any).cn === 3) notify('Crunchy! 10 g of protein ✓');
      }
      (window as any).crunch = () => burst(bar.position);

      let mx = 0;
      let my = 0;
      let spVal = 0;
      let ea = 0;
      let ev = 0;
      let isDown = 0;
      let lx = 0;
      let mv = 0;
      const cur = { x: 0, y: -0.02, s: 1.4, ry: 0, rx: 0, op: 1, w: 1, ex: 0 };

      window.addEventListener('pointermove', (e) => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
        mo.position.set(mx * 8, -my * 6, 4.5);
        if (isDown) {
          const d = e.clientX - lx;
          lx = e.clientX;
          mv += Math.abs(d);
          ev = d * 0.012;
        }
      });

      window.addEventListener('pointerdown', (e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('button,input,a,.track,.card,.cells')) return;
        isDown = 1;
        lx = e.clientX;
        mv = 0;
      });

      const rc = new THREE.Raycaster();
      window.addEventListener('pointerup', (e) => {
        if (isDown && mv < 6 && cur.op > 0.4) {
          rc.setFromCamera(
            new THREE.Vector2(
              (e.clientX / window.innerWidth) * 2 - 1,
              -(e.clientY / window.innerHeight) * 2 + 1
            ),
            cam
          );
          const h = rc.intersectObject(bar, true)[0];
          if (h) burst(h.point);
        }
        isDown = 0;
      });

      function size() {
        if (!cv) return;
        r.setSize(window.innerWidth, window.innerHeight, false);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      }
      size();
      window.addEventListener('resize', size);

      let vis = true;
      document.addEventListener('visibilitychange', () => {
        vis = !document.hidden;
        if (vis) {
          last = performance.now();
          loop(last);
        }
      });

      let last = performance.now();
      let slow = 0;

      function loop(t: number) {
        if (!vis || document.body.classList.contains('lite')) return;
        requestAnimationFrame(loop);

        const dt = t - last || 16;
        last = t;
        slow = dt > 45 ? slow + 1 : Math.max(0, slow - 1);
        if (slow > 100) {
          document.body.classList.add('lite');
          return;
        }

        const hw = Math.tan((17.5 * Math.PI) / 180) * 5.5 * cam.aspect;
        for (const q in cur) {
          (cur as any)[q] += ((T as any)[q] - (cur as any)[q]) * 0.07;
        }

        spVal += (window.scrollY * 0.0014 - spVal) * 0.06;
        ea += ev;
        ev *= 0.94;
        ea *= 0.997;

        if (useGLB) {
          body.visible = false;
          wg.visible = false;

          glbWrapperGroup.visible = cur.w > 0.02;
          glbWrapperGroup.position.x = (1 - cur.w) * 3;
          if (wrapperMesh && wrapperMesh.material) {
            (wrapperMesh.material as THREE.Material).opacity = cur.w;
          }

          glbBarGroup.visible = cur.ex < 0.03;
          layers.visible = cur.ex >= 0.03;
          lms.forEach((m, i) => {
            m.position.y = Y[i] + (1.5 - i) * cur.ex * 0.34;
            lmats[i].emissiveIntensity +=
              ((SEL === i ? 0.7 : 0) - lmats[i].emissiveIntensity) * 0.12;
          });
        } else {
          body.visible = cur.ex < 0.03;
          layers.visible = !body.visible;
          lms.forEach((m, i) => {
            m.position.y = Y[i] + (1.5 - i) * cur.ex * 0.34;
            lmats[i].emissiveIntensity +=
              ((SEL === i ? 0.7 : 0) - lmats[i].emissiveIntensity) * 0.12;
          });

          wg.visible = cur.w > 0.02;
          wg.position.x = (1 - cur.w) * 3;
          wm.opacity = wf.opacity = cur.w;
        }

        if (life > 0) {
          for (let i = 0; i < N; i++) {
            pv[i * 3 + 1] -= 0.003;
            pp[i * 3] += pv[i * 3];
            pp[i * 3 + 1] += pv[i * 3 + 1];
            pp[i * 3 + 2] += pv[i * 3 + 2];
          }
          life -= 0.018;
          pm.opacity = Math.max(0, life);
          pg.attributes.position.needsUpdate = true;
        }

        punch *= 0.9;
        const S = cur.s * (window.innerWidth < 800 ? 0.62 : 1);

        bar.position.set(cur.x * hw * 0.55, cur.y + Math.sin(t * 0.0012) * 0.05, 0);
        bar.scale.set(S * (1 + 0.16 * punch), S * (1 - 0.16 * punch), S * (1 + 0.16 * punch));
        bar.rotation.set(
          cur.rx * 0.5 + my * 0.22,
          cur.ry + mx * 0.35 + spVal + ea,
          -my * 0.04 + mx * 0.06
        );

        cv.style.opacity = String(cur.op);
        r.render(sc, cam);
      }

      requestAnimationFrame(loop);
    }

    if (weak) {
      document.body.classList.add('lite');
    } else {
      const go = () => boot3d();
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(go, { timeout: 2500 });
      } else {
        setTimeout(go, 1200);
      }
    }

    return () => {
      // Cleanup observers
      io.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Background Interactive Layer */}
      <div id="orb"></div>
      <canvas id="c"></canvas>
      <div className="cssbar"></div>
      <div id="cur"></div>

      {/* Progress & Toast */}
      <div id="prog"></div>
      <div id="dots"></div>
      <div id="toast" className="pill">
        Crunchy! 10 g of protein ✓
      </div>

      {/* Navigation */}
      <nav>
        <div className="flex flex-col">
          <div className="w-10 h-1 bg-gradient-to-r from-orange-400 via-rose-500 to-indigo-600 rounded-full mb-1" />
          <b className="font-semibold text-lg tracking-tight text-[#14091F]">GoProteen</b>
        </div>
        <span className="mono">
          <button id="listen" className="mono" type="button">
            ▶ LISTEN
          </button>
        </span>
      </nav>

      {/* Main Sections */}
      <main>
        {/* Section 0: Hero */}
        <section
          className="hero"
          data-bar="0 -0.02 1.4 0 0 1 1 0"
          data-orb="0 0 1.2 0 .9"
        >
          <span className="mono c1">GPT — 001</span>
          <span className="mono c2">Original bar</span>
          <h1 className="big">GOPROTEEN</h1>
          <div className="pills">
            <span className="pill">10 g protein</span>
            <span className="pill">102 kcal</span>
            <span className="pill">0% added sugar</span>
            <span className="pill">100% vegan</span>
          </div>
          <p className="sub r" style={{ maxWidth: 'none', marginTop: '46vh' }}>
            Wake up your muscle.
          </p>
          <div className="r" style={{ marginTop: '3vh' }}>
            <a className="btn s" href="#meet">
              Meet the bar
            </a>
            <a className="btn" href="#s2">
              Why protein
            </a>
          </div>
          <span className="mono c3">Drag · click the bar</span>
          <span className="mono c4">90 × 30 × 12 mm</span>
        </section>
        <div className="sp"></div>

        {/* Section 1: The Quiet Breakdown (Editorial Flow) */}
        <section
          id="s2"
          className="sarcopenia-section relative"
          data-bar="0 0 0 0 0 0 0 0"
          data-orb="-0.9 0 .8 160 .45"
          style={{
            minHeight: '100vh',
            maxHeight: '100vh',
            padding: '3vh 6vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-center select-none">
            {/* Top Stage: Minimal Editorial Title & Large Anatomical Arm with Drag Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-2">
              {/* Left Column: Clean Title & Audio */}
              <div className="lg:col-span-5 flex flex-col justify-center z-10">
                {/* Category Tracker */}
                <span className="mono r" style={{ marginBottom: '1vh', display: 'inline-block' }}>
                  The quiet breakdown
                </span>

                {/* Main Headline */}
                <h2 className="r" style={{ margin: '0.5vh 0 2vh', fontSize: 'clamp(2.2rem, 3.8vw, 3.5rem)', lineHeight: 1.02 }}>
                  The silent loss of<br />
                  independence.
                </h2>

                {/* Audio Player Bar */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleNarration}
                    className="w-10 h-10 rounded-full bg-[#14091F] hover:bg-[#251535] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer"
                    title={audioPlaying ? 'Pause narration' : 'Hear the story'}
                    aria-label={audioPlaying ? 'Pause narration' : 'Hear the story'}
                  >
                    {audioPlaying ? (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <span className="mono" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--mut)' }}>
                    Hear the story
                  </span>
                  <div className="flex items-center gap-1 h-5 px-1">
                    {[6, 12, 18, 9, 16, 22, 14, 18, 24, 11, 16, 7, 4].map((h, i) => (
                      <span
                        key={i}
                        className={`w-[2px] rounded-full bg-[#14091F] transition-all duration-200 ${
                          audioPlaying ? `animate-eq-${(i % 5) + 1}` : 'opacity-35'
                        }`}
                        style={{ height: audioPlaying ? `${h}px` : `${Math.max(3, h * 0.45)}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Large Anatomical Arm with 3D Interactive Muscle Experience */}
              <div className="lg:col-span-7 relative flex items-center justify-center">
                <div className="relative w-full h-[390px] sm:h-[450px] lg:h-[490px] xl:h-[520px] flex items-center justify-center">
                  {/* 3D WebGL Muscle Experience Component */}
                  <MuscleExperience
                    userAge={userAge}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Interactive Age Slider & Progression (Completely Borderless & Box-free) */}
            <div className="w-full pt-2 pb-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                {/* Col 1: Single Age Control with Stepper & Direct Entry */}
                <div className="md:col-span-3 flex flex-col">
                  <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '8px' }}>
                    Enter Your Age
                  </span>
                  <div className="inline-flex items-center justify-between rounded-full bg-white/80 p-1 w-36 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setUserAge((a) => Math.max(30, a - 5))}
                      className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-base focus:outline-none cursor-pointer"
                      title="Decrease age"
                      aria-label="Decrease age"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="30"
                      max="75"
                      value={userAge}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setUserAge(Math.max(25, Math.min(80, val)));
                      }}
                      className="w-14 text-center text-xl font-light text-[#14091F] font-mono bg-transparent border-none focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setUserAge((a) => Math.min(65, a + 5))}
                      className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-base focus:outline-none cursor-pointer"
                      title="Increase age"
                      aria-label="Increase age"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Col 2: Estimated Muscle Change */}
                <div className="md:col-span-4 flex items-center gap-4 py-2 md:py-0 md:px-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mut)' }}>
                        Estimated Muscle Change
                      </span>
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-[10px] flex items-center justify-center text-gray-500 font-serif" title="Sarcopenic volume decline from age 30 baseline">i</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200, letterSpacing: '-0.045em', lineHeight: 0.95, fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--fg)' }}>
                        {userAge <= 30
                          ? '0%'
                          : userAge <= 40
                          ? `≈ ${Math.round(((userAge - 30) / 10) * 10)}%`
                          : userAge <= 50
                          ? `≈ ${Math.round(10 + ((userAge - 40) / 10) * 30)}%`
                          : `≈ ${Math.min(55, Math.round(40 + ((userAge - 50) / 10) * 10))}%`}
                      </span>
                      <span style={{ fontSize: '12px', lineHeight: 1.4, color: 'var(--mut)', maxWidth: '20ch', fontWeight: 300 }}>
                        {userAge <= 30
                          ? 'Baseline full muscular volume.'
                          : 'Loss of muscle volume since age 30.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 3: See Muscle Progression by Age Milestones */}
                <div className="md:col-span-5 flex flex-col justify-center">
                  <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '14px' }}>
                    See Muscle Progression by Age
                  </span>
                  <div className="relative w-full px-2">
                    {/* Track Line */}
                    <div className="relative w-full h-1 bg-[#E4DFD5] rounded-full">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#14091F] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, ((userAge - 30) / 30) * 100))}%` }}
                      />
                    </div>

                    {/* 4 Milestones: 30, 40, 50, 60 */}
                    <div className="relative flex justify-between mt-[-9px]">
                      {[
                        { age: 30, label: '30', sub: '(Baseline)' },
                        { age: 40, label: '40', sub: '(~10% loss)' },
                        { age: 50, label: '50', sub: '(~40% loss)' },
                        { age: 60, label: '60', sub: '(~50% loss)' },
                      ].map((m) => {
                        const isSelected = Math.abs(userAge - m.age) < 3;
                        const isPassed = userAge >= m.age;
                        return (
                          <button
                            key={m.age}
                            type="button"
                            onClick={() => setUserAge(m.age)}
                            className="flex flex-col items-center group focus:outline-none cursor-pointer"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-[#14091F] bg-white ring-4 ring-[#14091F]/20 scale-125'
                                  : isPassed
                                  ? 'border-[#14091F] bg-[#14091F]'
                                  : 'border-[#C8C2B7] bg-white'
                              }`}
                            />
                            <span className={`text-xs mt-2 font-mono ${isSelected ? 'text-[#14091F] font-bold' : 'text-[#6B726C]'}`}>
                              {m.label}
                            </span>
                            <span className="text-[10px] text-[#9BA39D] leading-tight mt-0.5 font-mono">
                              {m.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar: Reset to Age 30 Action & Look Deeper */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-3">
              {/* Left: Reset to Age 30 Action */}
              <div className="chips" style={{ margin: 0 }}>
                <button
                  type="button"
                  onClick={() => setUserAge(30)}
                  className={userAge === 30 ? 'on' : ''}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  title="Reset to Age 30 Baseline"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset to Age 30 (Baseline)</span>
                </button>
              </div>

              {/* Right: Look deeper button */}
              <div className="chips" style={{ margin: 0 }}>
                <a
                  href="#cell-response"
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    type="button"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>Look Deeper Inside Your Body</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="sp"></div>

        {/* Section 2: The Cell Response (Anabolic Resistance) */}
        <section
          id="cell-response"
          className="cell-response-section relative"
          data-bar="0 0 .3 0 0 0 0 0"
          data-orb="0 0 1.2 120 .6"
          style={{
            minHeight: '100vh',
            maxHeight: '100vh',
            padding: '3vh 6vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-center select-none">
            {/* Top Stage: Left Editorial Title & Right Hero Interactive Fascicle */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-2">
              {/* Left Column: Title, Subtitle, Audio */}
              <div className="lg:col-span-5 flex flex-col justify-center z-10">
                {/* Category Tracker */}
                <span className="mono r" style={{ marginBottom: '1vh', display: 'inline-block' }}>
                  The cell response
                </span>

                {/* Main Headline */}
                <h2 className="r" style={{ margin: '0.5vh 0 1.5vh', fontSize: 'clamp(2.2rem, 3.8vw, 3.5rem)', lineHeight: 1.02 }}>
                  The Hard-Of-<br />
                  Hearing Cells <span style={{ color: '#2D6A4F', fontStyle: 'italic', fontWeight: 300 }}>(Anabolic Resistance)</span>
                </h2>

                {/* Subtitle Paragraph */}
                <p className="r" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)', lineHeight: 1.55, color: 'var(--mut)', maxWidth: '44ch', marginBottom: '2.5vh', fontWeight: 300 }}>
                  As we age, our muscle cells become less responsive to protein signals — especially leucine. They don’t respond as strongly, so muscle rebuilding becomes less efficient.
                </p>

                {/* Audio Player Bar */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleCellNarration}
                    className="w-10 h-10 rounded-full bg-[#14091F] hover:bg-[#251535] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer"
                    title={cellAudioPlaying ? 'Pause narration' : 'Hear the story'}
                    aria-label={cellAudioPlaying ? 'Pause narration' : 'Hear the story'}
                  >
                    {cellAudioPlaying ? (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <span className="mono" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--mut)' }}>
                    Hear the story
                  </span>
                  <div className="flex items-center gap-1 h-5 px-1">
                    {[6, 12, 18, 9, 16, 22, 14, 18, 24, 11, 16, 7, 4].map((h, i) => (
                      <span
                        key={i}
                        className={`w-[2px] rounded-full bg-[#14091F] transition-all duration-200 ${
                          cellAudioPlaying ? `animate-eq-${(i % 5) + 1}` : 'opacity-35'
                        }`}
                        style={{ height: cellAudioPlaying ? `${h}px` : `${Math.max(3, h * 0.45)}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Interactive Fascicle with Draggable Leucine Protein */}
              <div className="lg:col-span-7 relative flex items-center justify-center">
                <div className="relative w-full h-[330px] sm:h-[380px] lg:h-[410px] flex items-center justify-center">
                  <CellResponseExperience
                    userAge={cellAge}
                    onAbsorb={() => {
                      setIsProteinBound(true);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Interactive Controls (Completely Borderless & Box-free) */}
            <div className="w-full pt-2 pb-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                {/* Col 1: Single Age Control with Stepper & Direct Entry */}
                <div className="md:col-span-3 flex flex-col">
                  <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '8px' }}>
                    Enter Your Age
                  </span>
                  <div className="inline-flex items-center justify-between rounded-full bg-white/80 p-1 w-36 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setCellAge((a) => Math.max(30, a - 5))}
                      className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-base focus:outline-none cursor-pointer"
                      title="Decrease age"
                      aria-label="Decrease age"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="30"
                      max="75"
                      value={cellAge}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setCellAge(Math.max(25, Math.min(80, val)));
                      }}
                      className="w-14 text-center text-xl font-light text-[#14091F] font-mono bg-transparent border-none focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCellAge((a) => Math.min(65, a + 5))}
                      className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-base focus:outline-none cursor-pointer"
                      title="Increase age"
                      aria-label="Increase age"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Col 2: Cell Response Percentage */}
                <div className="md:col-span-4 flex items-center gap-4 py-2 md:py-0 md:px-6">
                  <div>
                    <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mut)', display: 'block', marginBottom: '4px' }}>
                      Cell Response
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200, letterSpacing: '-0.045em', lineHeight: 0.95, fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: 'var(--fg)' }}>
                        {cellAge <= 30
                          ? '100%'
                          : cellAge <= 40
                          ? `≈ ${Math.round(100 - ((cellAge - 30) / 10) * 25)}%`
                          : cellAge <= 50
                          ? `≈ ${Math.round(75 - ((cellAge - 40) / 10) * 25)}%`
                          : `≈ ${Math.max(20, Math.round(50 - ((cellAge - 50) / 10) * 20))}%`}
                      </span>
                      <span style={{ fontSize: '12px', lineHeight: 1.4, color: 'var(--mut)', maxWidth: '22ch', fontWeight: 300 }}>
                        {cellAge <= 30
                          ? 'Muscle protein synthesis active.'
                          : cellAge <= 40
                          ? 'Moderate response to standard protein.'
                          : cellAge <= 50
                          ? 'Blunted response (Anabolic resistance).'
                          : 'Requires high-density leucine to activate.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 3: Response Decreases with Age Timeline */}
                <div className="md:col-span-5 flex flex-col justify-center">
                  <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mut)', marginBottom: '14px' }}>
                    Response Decreases with Age
                  </span>
                  <div className="relative w-full px-2">
                    {/* Track Line */}
                    <div className="relative w-full h-1 bg-[#E4DFD5] rounded-full">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#14091F] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, ((cellAge - 30) / 30) * 100))}%` }}
                      />
                    </div>

                    {/* 4 Milestones: 30, 40, 50, 60 */}
                    <div className="relative flex justify-between mt-[-9px]">
                      {[
                        { age: 30, label: '30', sub: '(Strong)' },
                        { age: 40, label: '40', sub: '(Moderate)' },
                        { age: 50, label: '50', sub: '(Weaker)' },
                        { age: 60, label: '60', sub: '(Low)' },
                      ].map((m) => {
                        const isSelected = Math.abs(cellAge - m.age) < 3;
                        const isPassed = cellAge >= m.age;
                        return (
                          <button
                            key={m.age}
                            type="button"
                            onClick={() => setCellAge(m.age)}
                            className="flex flex-col items-center group focus:outline-none cursor-pointer"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-[#14091F] bg-white ring-4 ring-[#14091F]/20 scale-125'
                                  : isPassed
                                  ? 'border-[#14091F] bg-[#14091F]'
                                  : 'border-[#C8C2B7] bg-white'
                              }`}
                            />
                            <span className={`text-xs mt-2 font-mono ${isSelected ? 'text-[#14091F] font-bold' : 'text-[#6B726C]'}`}>
                              {m.label}
                            </span>
                            <span className="text-[10px] text-[#9BA39D] leading-tight mt-0.5 font-mono">
                              {m.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar: Reset to Age 30 Action & Look Deeper */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-3">
              {/* Left: Reset to Age 30 Action */}
              <div className="chips" style={{ margin: 0 }}>
                <button
                  type="button"
                  onClick={() => {
                    setCellAge(30);
                    setIsProteinBound(false);
                  }}
                  className={cellAge === 30 && !isProteinBound ? 'on' : ''}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  title="Reset to Age 30 Baseline"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset to Age 30</span>
                </button>
              </div>

              {/* Right: Look deeper button to next section (#bone) */}
              <div className="chips" style={{ margin: 0 }}>
                <a
                  href="#bone"
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    type="button"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>Look Deeper</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
        <div className="sp"></div>

        {/* Section 3: The Fading Foundation — Interactive Bone Education */}
        <section
          id="bone"
          className="fading-foundation-section relative"
          data-bar="0 0 0 0 0 0 0 0"
          data-orb="0 0 0 0 0"
          style={{
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#FDFBF7',
            zIndex: 10,
            minHeight: '100vh',
            height: '100vh',
            maxHeight: '100vh',
          }}
        >
          {/* Hidden Story for Global Narration */}
          <details className="story" style={{ display: 'none' }}>
            <summary>Listen</summary>
            <div>
              The fading foundation. One percent annual mineral loss. Picture this: You step out of bed in the quiet of the morning... and feel that unfamiliar stiffness whispering through your joints. You look back at a recent photograph... and notice your posture, gently slumping. Your physical frame, feeling just a little less sturdy than it used to... quietly shifting, day by day. Every year after middle age, your body quietly surrenders 1% of its bone density and systemic mineral matrix. Without a complete amino acid framework to lock calcium into place... your internal structure accelerates its breakdown. As you feel how important your frame really is... ask yourself: How strong and upright do you want to feel a decade from now?
            </div>
          </details>

          <BoneFoundationExperience />
        </section>
        <div className="sp"></div>

        {/* Section 4: Midday afternoon crash */}
        <AfternoonCrashSection />
        <details className="story" style={{ display: 'none' }}>
          <summary>Read the full story · The silent 10-gram deficit &amp; afternoon crash</summary>
          <div>
            <p>
              “Think about what happens when you finish your midday meal… rice, rotis, or heavy carbs. An hour later, your stomach feels completely full… heavy… and weighed down. And as that full feeling sets in, your mind grows foggy… your focus drifts… and your energy crashes. You find yourself reaching blindly for tea, coffee, or sugary snacks… desperately trying to scrape together enough focus… just to make it through the rest of the day.
            </p>
            <p>
              Carbohydrate-heavy meals trigger rapid blood sugar spikes… followed by steep, exhausting crashes… leaving your cells stranded in a hidden daily deficit of 10 grams of clean cellular protein. Look back at what you ate today… How much of it was fast-burning carbs… and how much was pure, high-quality cellular repair fuel?”
            </p>
          </div>
        </details>
        <div className="sp"></div>

        {/* Section 5: GoProteen 3D Scroll Storytelling Experience */}
        <section
          id="product-story"
          className="relative"
          style={{
            backgroundColor: '#FDFBF7',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Product3DStoryExperience />
        </section>
        <div className="sp"></div>

        {/* Section 6: The repair kit */}
        <section
          id="rep"
          data-bar="-1.25 .8 .4 .4 0 .25 0 0"
          data-orb="1 0 .8 60 .55"
        >
          <span className="mono r">The repair kit</span>
          <div className="agen r" style={{ fontSize: 'clamp(5rem,19vw,17rem)' }}>
            REPAIR
          </div>
          <div className="chips r" id="hs">
            <button data-h="0" data-t="Supports bone strength and a steady, upright frame.*">
              Bones
            </button>
            <button data-h="60" data-t="Amino acids help skin look and feel its best.*">
              Skin
            </button>
            <button data-h="120" data-t="Protein is a building block of healthy hair.*">
              Hair
            </button>
            <button data-h="200" data-t="Part of the everyday defence your body builds.*">
              Immunity
            </button>
            <button data-h="280" data-t="Complete amino acids with high leucine support muscle.*">
              Muscle
            </button>
            <button data-h="330" data-t="Steady fuel, without the spike and slump.*">
              Energy
            </button>
          </div>
          <p id="ht" className="r" style={{ maxWidth: '48ch', color: 'var(--fg)' }}>
            Pick a part of your body.
          </p>
          <details className="story">
            <summary>Read the full story · The vanishing repair kit</summary>
            <div>
              <p>
                “You see… protein is far more than just muscle. It is your total body maintenance system. Right now, as you listen to my voice… it is quietly at work inside you… constantly rebuilding your entire frame. Strengthening your bones. Smoothing your skin. Nourishing your hair. Arming your immune system with pure cellular defense… so you feel unbreakable, energized, and completely alive.
              </p>
              <p>
                Without this raw repair fuel… even a small scratch takes longer to heal. Hair loses its shine. Skin loses its bounce. And rock-solid bones quietly become fragile. We spend so much of our lives building financial wealth for tomorrow… Now is the moment to invest pure raw fuel into the body that carries you there. And now… the moment you have been waiting for…”
              </p>
            </div>
          </details>
        </section>
        <div className="sp"></div>

        {/* Section 6: Breakthrough Solution */}
        <section
          id="sol"
          data-bar="1.25 .7 .45 .4 0 .3 0 0"
          data-orb="-1 0 .8 250 .55"
        >
          <span className="mono r">The breakthrough solution</span>
          <h2 className="r">Weightless on your stomach.</h2>
          <p className="r">
            Traditional whey or raw plant powders often trigger heavy gastric bloat, gas and uncomfortable stomach distress. Drag to compare.
          </p>
          <div className="cmp r">
            <div className="n">
              <span className="mono">GoProteen · fermented yeast protein</span>
              <h3>
                Complete amino acids.<br />
                High leucine.<br />
                Weightless.
              </h3>
            </div>
            <div className="o">
              <span className="mono" style={{ color: '#ddd' }}>
                Traditional whey · raw plant powders
              </span>
              <h3>
                Heavy.<br />
                Bloat. Gas.<br />
                Distress.
              </h3>
            </div>
          </div>
          <input
            className="r"
            type="range"
            id="cmpr"
            min="0"
            max="100"
            defaultValue="50"
            aria-label="Compare"
          />
          <p className="r" style={{ maxWidth: '48ch', color: 'var(--fg)', marginTop: '5vh' }}>
            Imagine a solution where fermented yeast protein changes everything. Meet GoProteen, powered by clinically studied Fermented Yeast Protein. It delivers complete essential amino acids with high leucine density to flip your muscle-building engine back on, sitting completely weightless on your stomach.* As you experience GoProteen, notice how effortless it feels to:
          </p>
          <ul className="bn r" id="bn">
            <li>Finish your workday feeling vibrant, active, and fully alive.*</li>
            <li>Make lifting, walking, and climbing stairs smooth and easy again.*</li>
            <li>Wake up aging muscle cells and see real, firm definition return.*</li>
            <li>Keep your energy laser-stable all afternoon long without the crash.*</li>
            <li>Stand tall, steady, and sturdy as you gracefully age.*</li>
          </ul>
          <p className="mono" id="bnc">
            Tap each one · 0 / 5
          </p>
          <details className="story">
            <summary>Read the full story · The breakthrough solution: meet GoProteen</summary>
            <div>
              <p>
                “Traditional whey or raw plant powders often trigger heavy gastric bloat… gas… and uncomfortable stomach distress. Imagine a solution where fermented yeast protein changes everything. Meet GoProteen… powered by clinically studied Fermented Yeast Protein. It delivers complete essential amino acids with high leucine density… to flip your muscle-building engine back on… sitting completely weightless on your stomach.
              </p>
              <p>
                As you experience GoProteen, notice how effortless it feels to: Finish your workday feeling vibrant, active, and fully alive.* Make lifting, walking, and climbing stairs smooth and easy again.* Wake up aging muscle cells and see real, firm definition return.* Keep your energy laser-stable all afternoon long without the crash.* Stand tall, steady, and sturdy as you gracefully age.”*
              </p>
            </div>
          </details>
        </section>
        <div className="sp"></div>

        {/* Section 7: Meet GoProteen */}
        <section
          id="meet"
          data-bar="0 -0.05 1.55 0 0 1 1 0"
          data-orb="0 0 1.6 0 1"
          data-theme="v"
          style={{ alignItems: 'center', textAlign: 'center' }}
        >
          <span className="mono r">Meet GoProteen</span>
          <div className="big">UNWRAP</div>
          <div className="r" style={{ marginTop: '50vh' }}>
            <button className="btn s" id="uw">
              Unwrap
            </button>
            <span className="mono">Drag to spin · click to crunch</span>
          </div>
          <div className="stats r" id="stats">
            <div>
              <b>
                <span data-n="10">0</span> g
              </b>
              <span className="mono">fermented yeast protein</span>
            </div>
            <div>
              <b>
                <span data-n="102">0</span>
              </b>
              <span className="mono">kcal</span>
            </div>
            <div>
              <b>
                <span data-n="0">0</span>%
              </b>
              <span className="mono">added sugar</span>
            </div>
            <div>
              <b>
                <span data-n="100">0</span>%
              </b>
              <span className="mono">vegan</span>
            </div>
          </div>
        </section>
        <div className="sp"></div>

        {/* Section 8: Anatomy */}
        <section
          id="anat"
          data-bar="0 0 1.4 0 0 1 0 0"
          data-orb="0 0 .9 20 .4"
          style={{ alignItems: 'center', textAlign: 'center' }}
        >
          <span className="mono r">Anatomy</span>
          <h2 className="r" style={{ margin: '2vh auto' }}>
            Pull it apart.
          </h2>
          <div className="anat r">
            <div className="col">
              <button data-i="0">Crunchy coat</button>
              <button data-i="1">Whole nuts</button>
            </div>
            <div className="mid"></div>
            <div className="col">
              <button data-i="2">Protein core</button>
              <button data-i="3">Date base</button>
            </div>
          </div>
          <input
            type="range"
            id="exr"
            min="0"
            max="100"
            defaultValue="0"
            aria-label="Explode"
            style={{ margin: '5vh auto 0' }}
          />
          <p className="info" id="info">
            Slide to explode the bar, or tap a layer.
          </p>
        </section>
        <div className="sp"></div>

        {/* Section 9: Gut Synbiotic */}
        <section
          id="gut"
          data-bar="1.25 .6 .4 .4 0 .2 0 0"
          data-orb="-1 0 .8 90 .5"
        >
          <canvas id="bb"></canvas>
          <span className="mono r">Synbiotic</span>
          <h2 className="r">Light. Comfortable. Steady.</h2>
          <p className="r">
            Powered by clinically studied prebiotic fibre and clinically studied probiotics.* Push the bubbles. Pop them.
          </p>
          <div className="chips r">
            <button id="lock">Lock blood sugar</button>
            <button data-g="GLP-1: one of your body’s natural fullness hormones, quietly taking control.*">
              GLP-1
            </button>
            <button data-g="PYY: another natural fullness hormone, helping silence random junk food urges.*">
              PYY
            </button>
          </div>
          <svg className="cv r" viewBox="0 0 520 80" aria-label="Illustrative blood sugar line">
            <path
              id="bs"
              d="M0 40 C40 5 80 75 130 40 S210 5 260 40 S350 75 400 40 S480 10 520 40"
              fill="none"
              stroke="url(#g)"
              strokeWidth="3"
              style={{ transition: 'd 1s' }}
            />
          </svg>
          <p id="gt" className="r" style={{ color: 'var(--fg)', maxWidth: '48ch' }}>
            Effortless Gut &amp; Blood Sugar Harmony.
          </p>
          <details className="story">
            <summary>Read the full story · The synbiotic advantage: effortless gut &amp; blood sugar harmony</summary>
            <div>
              <p>
                “Imagine finishing a meal right now… and taking a deep, easy, satisfying breath. Allow yourself to experience Effortless Gut &amp; Blood Sugar Harmony… fueled by clinically studied prebiotic fiber… and clinically studied probiotics. Every single bite digests smoothly… leaving your stomach feeling light, comfortable, and 100% bloat-free.
              </p>
              <p>
                Your blood sugar locks in place… holding your mental focus sharp and steady all afternoon long. And those random, uncontrollable junk food urges? Silenced… as your body’s natural fullness hormones, GLP-1 and PYY, quietly take complete control.”*
              </p>
            </div>
          </details>
        </section>

        {/* Section 10: Clean-label guarantee */}
        <section
          data-bar="0 0 .4 0 0 .12 0 0"
          data-orb="0 0 1 0 .6"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <div className="mq r">
            <div>
              No added sugar • No soy or whey • No dairy • No refined oils • No fake sweeteners • No trans fats • No artificial colours • No gluten • No added sugar • No soy or whey • No dairy • No refined oils • No fake sweeteners • No trans fats • No artificial colours • No gluten •{' '}
            </div>
          </div>
          <div style={{ padding: '0 8vw' }}>
            <span className="mono r">Clean-label promise</span>
            <div className="no r" id="no"></div>
            <p className="r" style={{ marginBottom: '2vh' }}>
              Turn the bar over in your hand…
            </p>
            <div className="chips r">
              <button className="on" data-f="0">
                A commercial “health” bar
              </button>
              <button data-f="1">GoProteen</button>
            </div>
            <div className="fine r">
              <div className="lab" id="lab">
                <s>artificial sugars</s><br />
                <s>palm oils</s><br />
                <s>synthetic fillers</s><br />
                <s>dairy isolates</s><br />
                …hidden behind flashy marketing claims.
              </div>
            </div>
            <div className="panel r">
              <span className="mono">Max-bioavailable protein matrix</span>
              <div>
                <span>Protein</span>
                <b>10 g</b>
              </div>
              <div>
                <span>Energy</span>
                <b>102 kcal</b>
              </div>
              <div>
                <span>Added sugar</span>
                <b>0%</b>
              </div>
              <div>
                <span>Formula</span>
                <b>100% vegan</b>
              </div>
              <div>
                <span>Zero dairy strain</span>
                <b>Weightless</b>
              </div>
              <div>
                <span>Real whole foods</span>
                <b>Almonds &amp; cashews</b>
              </div>
            </div>
            <details className="story">
              <summary>Read the full story · The clean-label guarantee</summary>
              <div>
                <p>
                  “When you pick up a commercial ‘health’ or ‘protein’ bar… turn it over in your hand… and discover a long list of artificial sugars… palm oils… synthetic fillers… and dairy isolates hidden behind flashy marketing claims. You can feel complete peace of mind knowing we believe in total purity.
                </p>
                <p>
                  The Clean-Label Guarantee: NO Added Sugar • NO Soy or Whey • NO Milk or Dairy • NO Refined Oils • NO Fake Sweeteners • NO Trans Fats • NO Artificial Colors/Flavors • NO Gluten • NO Pesticides, Antibiotics, or Hormones.
                </p>
                <p>
                  Max-Bioavailable Protein Matrix: 10 Grams | Pure, Clean Clinically Studied Fermented Yeast Protein. 102 Calories | Steady, Sustained Cellular Fuel. 0% Added Sugar | Sweetened purely with natural date paste. 100% Pure Vegan Formula. Zero Dairy Strain | Feel weightless and comfortable after every bar. Real Whole Foods | Crunchy Whole Almonds &amp; Cashews.”
                </p>
              </div>
            </details>
          </div>
        </section>
        <div className="sp"></div>

        {/* Section 11: Who it's for */}
        <section
          id="who"
          data-bar="0 0 .3 0 0 0 0 0"
          data-orb="0 0 .8 0 .5"
          style={{ paddingRight: 0 }}
        >
          <span className="mono r">Who it’s for</span>
          <h2 className="r" id="pn" style={{ maxWidth: '16ch' }}>
            Made for real life.
          </h2>
          <p className="r">
            This isn’t just another snack. It is targeted cellular nutrition engineered for your real life. Tap a card.
          </p>
          <div className="track r" id="track">
            <div className="card" data-h="0" data-n="adults 30+">
              <span className="mono">30+ · 40+</span>
              <div>
                <b>Adults over 30 &amp; 40</b>
                <p>
                  Stop silent 1% annual muscle loss, preserve grip strength, and protect your upright posture.*
                </p>
              </div>
            </div>
            <div className="card" data-h="200" data-n="busy professionals">
              <span className="mono">Work</span>
              <div>
                <b>Professionals battling fatigue</b>
                <p>
                  Erase afternoon brain fog and carb crashes with clean, steady focus.*
                </p>
              </div>
            </div>
            <div className="card" data-h="120" data-n="walkers &amp; lifters">
              <span className="mono">Move</span>
              <div>
                <b>Walkers &amp; active lifters</b>
                <p>
                  Maintain firm muscle tone and joint mobility without heavy whey bloat.*
                </p>
              </div>
            </div>
            <div className="card" data-h="60" data-n="sensitive stomachs">
              <span className="mono">Gut</span>
              <div>
                <b>Sensitive guts</b>
                <p>
                  Enjoy 100% bloat-free digestion powered by clinically studied prebiotics and probiotics.*
                </p>
              </div>
            </div>
            <div className="card" data-h="280" data-n="seniors">
              <span className="mono">60+</span>
              <div>
                <b>Seniors guarding posture</b>
                <p>
                  Support bone mineral retention, balance, and a sturdy frame.*
                </p>
              </div>
            </div>
            <div className="card" data-h="330" data-n="the blood-sugar aware">
              <span className="mono">Balance</span>
              <div>
                <b>Blood sugar &amp; heart support</b>
                <p>
                  Keep blood sugar spikes away while plant purity with zero cholesterol or trans fats keeps circulation clean and arteries flexible.*
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="sp"></div>

        {/* Section 12: Pricing / Order */}
        <section
          data-bar="0 0.02 1.35 0 0 1 0 0"
          data-orb="0 0 1.3 330 .8"
          data-theme="v"
          style={{ alignItems: 'center', textAlign: 'center' }}
        >
          <span className="mono r">10 — Today</span>
          <div className="big">FIRST BITE</div>
          <div className="price r" style={{ marginTop: '42vh', textAlign: 'left', width: '100%' }}>
            <div>
              <span className="mono">Single</span>
              <strong>₹ 120</strong>
              <a className="btn crunch" href="#">
                Order
              </a>
            </div>
            <div className="hot">
              <span className="mono" style={{ color: '#fff' }}>
                Most popular · Box of 6
              </span>
              <strong>₹ 660</strong>
              <a
                className="btn crunch"
                style={{ background: '#fff', color: '#14091F', borderColor: '#fff' }}
                href="#"
              >
                Order
              </a>
            </div>
            <div>
              <span className="mono">Box of 12</span>
              <strong>₹ 1,200</strong>
              <a className="btn crunch" href="#">
                Order
              </a>
            </div>
            <div>
              <span className="mono">Subscribe &amp; save</span>
              <strong>₹ 999/mo</strong>
              <a className="btn crunch" href="#">
                Start
              </a>
            </div>
          </div>
          <p
            className="r"
            style={{
              margin: '6vh auto 0',
              maxWidth: '46ch',
              textAlign: 'center',
              color: 'var(--fg)',
            }}
          >
            As you realize the power of this formula… you see that this isn’t just another snack. Decide today to give your body the cellular repair fuel it has been waiting for.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>
          *These statements have not been evaluated by FSSAI. This product is not intended to diagnose, treat, cure or prevent any disease. Illustrations are for explanation only. FSSAI licence no.: [to be added]
        </p>
        <p>
          <button className="btn" id="lite">
            Lite mode
          </button>{' '}
          <span className="mono">GoProteen · Original bar</span>
        </p>
      </footer>

      {/* Order Modal Confirmation */}
      {orderModal?.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOrderModal(null)}
        >
          <div
            className="panel relative w-full max-w-md bg-white dark:bg-[#14091F] text-[#14091F] dark:text-[#F4F2EF] p-8 rounded-3xl shadow-2xl border border-[var(--line)]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mono text-xs text-[var(--amb)]">GoProteen Dispatch</span>
            <h3 className="text-2xl font-light mt-2 mb-1">{orderModal.plan}</h3>
            <p className="text-sm text-[var(--mut)] mb-6">Price: {orderModal.price}</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-full border border-[var(--line)] bg-[var(--glass)] text-sm focus:outline-none focus:border-[var(--amb)]"
                defaultValue="Jaidev"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-full border border-[var(--line)] bg-[var(--glass)] text-sm focus:outline-none focus:border-[var(--amb)]"
                defaultValue="jaidev@example.com"
              />
              <button
                className="btn s w-full py-3.5 text-center justify-center font-medium mt-2"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        planId: orderModal.plan,
                        name: 'Jaidev',
                        email: 'jaidev@example.com',
                      }),
                    });
                    const data = await res.json();
                    if ((window as any).notify) {
                      (window as any).notify(`Order ${data.orderId} Confirmed! ✓`);
                    }
                  } catch (e) {
                    if ((window as any).notify) {
                      (window as any).notify('Order received! Dispatching soon ✓');
                    }
                  }
                  setOrderModal(null);
                }}
              >
                Confirm Order &amp; Dispatch
              </button>
            </div>
            <button
              className="mt-4 text-xs text-[var(--mut)] hover:text-[var(--fg)] underline block text-center w-full"
              onClick={() => setOrderModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
