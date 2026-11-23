const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'check_unwrap_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9461',
  '--no-sandbox',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1440,900',
  'http://localhost:3000/#meet'
]);

async function run() {
  await new Promise(r => setTimeout(r, 6500));
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
    // 1. Scroll to #meet
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('meet');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // Capture Section 7 Wrapped
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    const dest1 = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_meet_wrapped.png');
    fs.writeFileSync(dest1, Buffer.from(snap1.data, 'base64'));
    console.log('Saved Section 7 Wrapped to:', dest1);

    // Click "Unwrap" button
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const uw = document.getElementById('uw');
          if (uw) uw.click();
        })()
      `
    });

    // Wait for unwrap animation to complete
    await new Promise(r => setTimeout(r, 1600));

    // Capture Section 7 Unwrapped
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    const dest2 = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_meet_unwrapped.png');
    fs.writeFileSync(dest2, Buffer.from(snap2.data, 'base64'));
    console.log('Saved Section 7 Unwrapped to:', dest2);

    // Scroll to #anat with explode slider at 100
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('anat');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
          const exr = document.getElementById('exr');
          if (exr) {
            exr.value = '100';
            exr.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // Capture Section 8 Exploded View
    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    const dest3 = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_anatomy_after_fit.png');
    fs.writeFileSync(dest3, Buffer.from(snap3.data, 'base64'));
    console.log('Saved Section 8 Exploded to:', dest3);

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
