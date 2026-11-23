const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = path.join(process.env.TEMP || 'C:\\Temp', 'check_anat_rot_' + Date.now());

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9466',
  '--no-sandbox',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1440,900',
  'http://localhost:3000/#anat'
]);

async function run() {
  await new Promise(r => setTimeout(r, 6500));
  const pages = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9466/json', res => {
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
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const anat = document.getElementById('anat');
          if (anat) anat.scrollIntoView({ behavior: 'instant', block: 'center' });
          const r = document.getElementById('exr');
          if (r) {
            r.value = '80';
            r.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/JAIDEV/.gemini/antigravity/brain/d8894f91-ee83-4605-b7aa-0ba46276ab97/test_anat_exploded_check.png', Buffer.from(snap.data, 'base64'));

    ws.close();
    chrome.kill();
    console.log('Saved anatomy exploded check');
    process.exit(0);
  };
}

run().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
