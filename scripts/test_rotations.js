const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'check_rot_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9464',
  '--no-sandbox',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1440,900',
  'http://localhost:3000/#meet'
]);

async function run() {
  await new Promise(r => setTimeout(r, 6000));
  const pages = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9464/json', res => {
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
    // Scroll to #meet and unwrap
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('meet');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
          const btn = document.getElementById('uw');
          if (btn && btn.textContent.includes('Unwrap')) btn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // Capture baseline (rx = 0)
    let snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/JAIDEV/.gemini/antigravity/brain/d8894f91-ee83-4605-b7aa-0ba46276ab97/rot_test_baseline_0.png', Buffer.from(snap.data, 'base64'));

    // Test rx = Math.PI / 2
    await send('Runtime.evaluate', {
      expression: `
        if (window._innerBar) {
          window._innerBar.rotation.set(Math.PI / 2, 0, 0);
        }
      `
    });
    await new Promise(r => setTimeout(r, 300));
    snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/JAIDEV/.gemini/antigravity/brain/d8894f91-ee83-4605-b7aa-0ba46276ab97/rot_test_rx_plus90.png', Buffer.from(snap.data, 'base64'));

    // Test rx = Math.PI / 2 - 0.25 (tilted ~15 deg so we see top waves beautifully from above)
    await send('Runtime.evaluate', {
      expression: `
        if (window._innerBar) {
          window._innerBar.rotation.set(Math.PI / 2 - 0.28, 0, 0);
        }
      `
    });
    await new Promise(r => setTimeout(r, 300));
    snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/JAIDEV/.gemini/antigravity/brain/d8894f91-ee83-4605-b7aa-0ba46276ab97/rot_test_rx_tilted_75.png', Buffer.from(snap.data, 'base64'));

    // Test rx = -Math.PI / 2
    await send('Runtime.evaluate', {
      expression: `
        if (window._innerBar) {
          window._innerBar.rotation.set(-Math.PI / 2, 0, 0);
        }
      `
    });
    await new Promise(r => setTimeout(r, 300));
    snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/JAIDEV/.gemini/antigravity/brain/d8894f91-ee83-4605-b7aa-0ba46276ab97/rot_test_rx_minus90.png', Buffer.from(snap.data, 'base64'));

    // Test rx = 0.35 (slight pitch forward from flat)
    await send('Runtime.evaluate', {
      expression: `
        if (window._innerBar) {
          window._innerBar.rotation.set(0.35, 0, 0);
        }
      `
    });
    await new Promise(r => setTimeout(r, 300));
    snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/JAIDEV/.gemini/antigravity/brain/d8894f91-ee83-4605-b7aa-0ba46276ab97/rot_test_rx_pitch_035.png', Buffer.from(snap.data, 'base64'));

    console.log('Finished capturing rotation tests');
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}

run().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
