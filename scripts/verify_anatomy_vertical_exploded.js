const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'check_anat_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9459',
  '--no-sandbox',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1440,900',
  'http://localhost:3000/?explode=1#anat'
]);

async function run() {
  await new Promise(r => setTimeout(r, 4000));
  const pages = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9459/json', res => {
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
    // 1. Ensure page is scrolled to #anat and slider is at 100
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

    // Wait for exploded layers to settle
    await new Promise(r => setTimeout(r, 2200));

    // Capture State 1: Exploded View with Nuts Separated as its Own Layer
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    const dest1 = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_vertical_nuts_separated_layer.png');
    fs.writeFileSync(dest1, Buffer.from(snap1.data, 'base64'));
    console.log('Saved State 1 (Nuts Separated Layer) to:', dest1);

    // 2. Perform interactive drag to rotate the model (simulating pointer drag on the model)
    const midX = 720;
    const midY = 450;
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: midX, y: midY, button: 'left', clickCount: 1 });
    await new Promise(r => setTimeout(r, 50));
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: midX + 160, y: midY - 60, button: 'left' });
    await new Promise(r => setTimeout(r, 50));
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: midX + 160, y: midY - 60, button: 'left' });

    // Wait 1s for interactive rotation to settle
    await new Promise(r => setTimeout(r, 1200));

    // Capture State 2: Rotated View
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    const dest2 = path.join('C:', 'Users', 'JAIDEV', '.gemini', 'antigravity', 'brain', 'd8894f91-ee83-4605-b7aa-0ba46276ab97', 'check_model_rotated_view.png');
    fs.writeFileSync(dest2, Buffer.from(snap2.data, 'base64'));
    console.log('Saved State 2 (Rotated View) to:', dest2);

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
