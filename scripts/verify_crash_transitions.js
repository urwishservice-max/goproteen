const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'check_crash_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9345',
  '--no-sandbox',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1440,900',
  'http://localhost:3000'
]);

async function run() {
  await new Promise(r => setTimeout(r, 4000));
  const pages = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9345/json', res => {
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
    // Scroll to #crash
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('crash');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1500));

    // Capture State 1: With GoProteen (Active man)
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    const dest1 = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'crash_state_goproteen.png');
    fs.writeFileSync(dest1, Buffer.from(snap1.data, 'base64'));
    console.log('Saved State 1 (GoProteen) to:', dest1);

    // Click "Rice + roti" button
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('#crash button'));
          const riceBtn = btns.find(b => b.textContent.includes('Rice + roti'));
          if (riceBtn) riceBtn.click();
        })()
      `
    });

    // Wait 1.2s for smooth transition
    await new Promise(r => setTimeout(r, 1200));

    // Capture State 2: Rice + roti (Sleeping man)
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    const dest2 = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'crash_state_rice.png');
    fs.writeFileSync(dest2, Buffer.from(snap2.data, 'base64'));
    console.log('Saved State 2 (Rice + roti) to:', dest2);

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
