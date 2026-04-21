const fs = require('fs');
const data = JSON.parse(fs.readFileSync('templates/collection.json', 'utf8'));
let html = data.sections['lgcy_faq_TMGqdE'].settings.custom_liquid;
// Match side panel exactly: rgba(255,255,255,0.03) + blur(12px)
html = html.replace(
  'background:rgba(255,255,255,0.04);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);',
  'background:rgba(255,255,255,0.03);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);'
);
data.sections['lgcy_faq_TMGqdE'].settings.custom_liquid = html;
fs.writeFileSync('templates/collection.json', JSON.stringify(data, null, 2));
console.log('Done');
