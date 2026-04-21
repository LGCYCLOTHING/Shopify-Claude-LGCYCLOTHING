const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'templates', 'collection.json');
const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

const faqHtml = [
  '<style>',
  '.lgcy-faq-wrap{width:100%;min-height:600px;display:flex;align-items:center;justify-content:center;padding:8rem 2rem;box-sizing:border-box;background:linear-gradient(145deg,#000000 0%,#1c1c1c 35%,#4a4a4a 70%,#9a9a9a 100%);}',
  '.lgcy-faq-card{width:100%;max-width:1100px;border-radius:4px;display:flex;flex-direction:column;overflow:hidden;background:rgba(255,255,255,0.07);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.12);}',
  '@media(min-width:860px){.lgcy-faq-card{flex-direction:row;min-height:380px;}}',
  '.lgcy-faq-intro{padding:3.5rem 3rem;flex:0 0 32%;display:flex;flex-direction:column;justify-content:flex-start;gap:0.75rem;border-bottom:1px solid rgba(255,255,255,0.1);}',
  '@media(min-width:860px){.lgcy-faq-intro{border-bottom:none;border-right:1px solid rgba(255,255,255,0.12);padding:4rem 3.5rem;}}',
  '.lgcy-faq-intro h2{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:2rem;font-weight:900;letter-spacing:-0.04em;text-transform:uppercase;margin:0;color:#ffffff;line-height:1.05;}',
  '.lgcy-faq-intro p{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:0.85rem;letter-spacing:-0.01em;color:rgba(255,255,255,0.45);margin:0;line-height:1.6;font-weight:500;}',
  '.lgcy-faq-panel{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;}',
  '.lgcy-faq-item{border-bottom:1px solid rgba(255,255,255,0.1);}',
  '.lgcy-faq-item:last-child{border-bottom:none;}',
  '.lgcy-faq-item summary{list-style:none;cursor:pointer;padding:1.75rem 3rem;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;user-select:none;-webkit-tap-highlight-color:transparent;transition:background 0.2s ease;}',
  '.lgcy-faq-item summary:hover{background:rgba(255,255,255,0.05);}',
  '.lgcy-faq-item summary::-webkit-details-marker{display:none;}',
  '.lgcy-faq-q{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:0.9rem;font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;color:#ffffff;flex:1;line-height:1.4;}',
  '.lgcy-faq-chevron{flex-shrink:0;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;transition:background 0.25s ease,transform 0.4s cubic-bezier(0.34,1.56,0.64,1);color:#ffffff;}',
  '.lgcy-faq-item[open] .lgcy-faq-chevron{transform:rotate(180deg);background:rgba(255,255,255,0.12);}',
  '.lgcy-faq-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.5s cubic-bezier(0.4,0,0.2,1);}',
  '.lgcy-faq-item[open] .lgcy-faq-body{grid-template-rows:1fr;}',
  '.lgcy-faq-body-inner{overflow:hidden;}',
  '.lgcy-faq-answer{padding:0 3rem 1.75rem;font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:0.85rem;line-height:1.9;letter-spacing:-0.01em;color:rgba(255,255,255,0.5);font-weight:400;opacity:0;transform:translateY(-4px);transition:opacity 0.35s ease 0.1s,transform 0.35s ease 0.1s;}',
  '.lgcy-faq-item[open] .lgcy-faq-answer{opacity:1;transform:translateY(0);}',
  '.lgcy-faq-answer p{margin:0 0 0.5rem;}',
  '.lgcy-faq-answer p:last-child{margin-bottom:0;}',
  '.lgcy-faq-answer strong{font-weight:700;color:rgba(255,255,255,0.85);}',
  '.lgcy-faq-answer a{color:#ffffff;text-decoration:underline;text-underline-offset:3px;}',
  '</style>',

  '<div class="lgcy-faq-wrap">',
  '  <div class="lgcy-faq-card">',
  '    <div class="lgcy-faq-intro"><h2>FAQs</h2><p>Your questions, answered.</p></div>',
  '    <div class="lgcy-faq-panel">',

  '      <details class="lgcy-faq-item">',
  '        <summary><span class="lgcy-faq-q">How long does shipping take?</span><span class="lgcy-faq-chevron"><svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></summary>',
  '        <div class="lgcy-faq-body"><div class="lgcy-faq-body-inner"><div class="lgcy-faq-answer"><p>Our orders are typically <strong>processed within 1\u20133 business days</strong>.</p><p><strong>Estimated Shipping Times:</strong></p><p>United States &amp; Canada: 7\u201312 business days</p><p>Europe: 7\u201312 business days</p><p>UAE &amp; Middle East: 10\u201314 business days</p><p>Rest of the World: 7\u201312 business days</p></div></div></div>',
  '      </details>',

  '      <details class="lgcy-faq-item">',
  '        <summary><span class="lgcy-faq-q">What does the warranty include?</span><span class="lgcy-faq-chevron"><svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></summary>',
  '        <div class="lgcy-faq-body"><div class="lgcy-faq-body-inner"><div class="lgcy-faq-answer"><p>Our warranty <strong>does not cover damage caused by personal misuse or destruction</strong>, and applies only to <strong>defects resulting from manufacturing errors</strong> or material faults.</p></div></div></div>',
  '      </details>',

  '      <details class="lgcy-faq-item">',
  '        <summary><span class="lgcy-faq-q">Any question?</span><span class="lgcy-faq-chevron"><svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></summary>',
  '        <div class="lgcy-faq-body"><div class="lgcy-faq-body-inner"><div class="lgcy-faq-answer"><p>You can reach us through our <a href="/pages/contact">contact page</a>. We will be happy to assist you.</p></div></div></div>',
  '      </details>',

  '    </div>',
  '  </div>',
  '</div>',

  '<script>',
  '(function(){document.querySelectorAll(".lgcy-faq-item").forEach(function(d){d.addEventListener("toggle",function(){if(d.open)document.querySelectorAll(".lgcy-faq-item").forEach(function(o){if(o!==d&&o.open)o.open=false;});});});})();',
  '</script>'
].join('\n');

data.sections['lgcy_faq_TMGqdE'] = {
  type: 'custom-liquid',
  name: 'LGCY FAQ',
  settings: {
    custom_liquid: faqHtml,
    color_scheme: '',
    padding_top: 0,
    padding_bottom: 0
  }
};

fs.writeFileSync(collectionPath, JSON.stringify(data));
console.log('Done');
