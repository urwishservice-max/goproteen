const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'check_hero_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9460',
  '--no-sandbox',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1440,900',
  'http://localhost:3000'
]);

async function run() {
  await new Promise(r => setTimeout(r, 4000));
  const pages = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9460/json', res => {
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
    // Scroll to top (hero section)
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo(0, 0);
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const dest = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_hero_section.png');
    fs.writeFileSync(dest, Buffer.from(snap.data, 'base64'));
    console.log('Saved Hero Screenshot to:', dest);

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
