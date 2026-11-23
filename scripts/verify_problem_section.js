const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'check_prob_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9461',
  '--no-sandbox',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1440,900',
  'http://localhost:3000'
]);

async function run() {
  await new Promise(r => setTimeout(r, 4500));
  const pages = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9461/json', res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
  const page = pages.find(p => p.type === 'page') || pages[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 1;
  const send = (method, params = {}) => {
    const id = msgId++;
    return new Promise(resolve => {
      const handler = e => {
        const data = JSON.parse(e.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  ws.onopen = async () => {
    // Scroll directly to story-problem section
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('story-problem') || Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Heavy gastric'));
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2500));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const dest = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_problem_section_fixed.png');
    fs.writeFileSync(dest, Buffer.from(snap.data, 'base64'));
    console.log('Saved Problem Section Screenshot to:', dest);

    // Also check hero and unwrap/anatomy to make sure nothing was broken
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const anat = document.getElementById('anat');
          if (anat) {
            anat.scrollIntoView({ behavior: 'instant', block: 'center' });
            const r = document.getElementById('exr');
            if (r) {
              r.value = '80';
              r.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));
    const snapAnat = await send('Page.captureScreenshot', { format: 'png' });
    const destAnat = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_anatomy_vertical_after_fix.png');
    fs.writeFileSync(destAnat, Buffer.from(snapAnat.data, 'base64'));
    console.log('Saved Anatomy Screenshot to:', destAnat);

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (e) {}
  process.exit(1);
});
