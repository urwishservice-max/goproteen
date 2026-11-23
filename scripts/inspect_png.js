const fs = require('fs');

function inspectPng(file) {
  const b = fs.readFileSync(file);
  const w = b.readUInt32BE(16);
  const h = b.readUInt32BE(20);
  const depth = b[24];
  const colorType = b[25]; // 6 is RGBA
  console.log(file, '->', w, 'x', h, 'depth:', depth, 'colorType:', colorType, '(RGBA is 6)');
}

inspectPng('public/images/afternoon_active_goproteen.png');
inspectPng('public/images/afternoon_crash_exhausted.png');
