const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'templates', 'collection.json');
const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

const chevron = '<svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const faqHtml = [
'<style>',
'.lgcy-faq3-section{position:relative;width:100%;padding:7rem 2rem;box-sizing:border-box;background:#0a0a0a;display:flex;align-items:center;justify-content:center;}',

'.lgcy-faq3-inner{position:relative;z-index:1;width:100%;max-width:1000px;}',

/* header */
'.lgcy-faq3-header{margin-bottom:1.8rem;}',
'.lgcy-faq3-eyebrow{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:9px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin:0 0 10px;}',
'.lgcy-faq3-title{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-weight:900;font-size:clamp(2.2rem,5vw,3.8rem);letter-spacing:-0.05em;text-transform:uppercase;color:#ffffff;line-height:0.95;margin:0;}',

/* card — exact match to side panel */
'.lgcy-faq3-card{background:rgba(255,255,255,0.03);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:0;}',

'.lgcy-faq3-item{border-bottom:1px solid rgba(255,255,255,0.08);}',
'.lgcy-faq3-item:last-child{border-bottom:none;}',
'.lgcy-faq3-item summary{list-style:none;cursor:pointer;padding:18px 28px;display:flex;align-items:center;justify-content:space-between;gap:2rem;user-select:none;-webkit-tap-highlight-color:transparent;transition:background 0.2s ease;}',
'.lgcy-faq3-item summary:hover{background:rgba(255,255,255,0.03);}',
'.lgcy-faq3-item summary::-webkit-details-marker{display:none;}',
'.lgcy-faq3-q{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:clamp(14px,2vw,16px);font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;color:#ffffff;flex:1;line-height:1.3;}',
'.lgcy-faq3-chevron{flex-shrink:0;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;transition:background 0.25s ease,transform 0.4s cubic-bezier(0.34,1.56,0.64,1);color:rgba(255,255,255,0.5);}',
'.lgcy-faq3-item[open] .lgcy-faq3-chevron{transform:rotate(180deg);background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.3);}',

'.lgcy-faq3-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.45s cubic-bezier(0.4,0,0.2,1);}',
'.lgcy-faq3-item[open] .lgcy-faq3-body{grid-template-rows:1fr;}',
'.lgcy-faq3-body-inner{overflow:hidden;}',
'.lgcy-faq3-answer{padding:0 28px 18px 28px;font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:13px;line-height:1.9;letter-spacing:-0.01em;color:rgba(255,255,255,0.45);font-weight:400;opacity:0;transform:translateY(-4px);transition:opacity 0.3s ease 0.08s,transform 0.3s ease 0.08s;}',
'.lgcy-faq3-item[open] .lgcy-faq3-answer{opacity:1;transform:translateY(0);}',
'.lgcy-faq3-answer p{margin:0 0 0.4rem;}',
'.lgcy-faq3-answer p:last-child{margin-bottom:0;}',
'.lgcy-faq3-answer strong{font-weight:700;color:rgba(255,255,255,0.7);}',
'.lgcy-faq3-answer a{color:#ffffff;text-decoration:underline;text-underline-offset:3px;}',
'</style>',

'<div class="lgcy-faq3-section">',
'  <div class="lgcy-faq3-inner">',
'    <div class="lgcy-faq3-header">',
'      <p class="lgcy-faq3-eyebrow">Support</p>',
'      <h2 class="lgcy-faq3-title">FAQs</h2>',
'    </div>',
'    <div class="lgcy-faq3-card">',

'      <details class="lgcy-faq3-item">',
'        <summary><span class="lgcy-faq3-q">How long does shipping take?</span><span class="lgcy-faq3-chevron">' + chevron + '</span></summary>',
'        <div class="lgcy-faq3-body"><div class="lgcy-faq3-body-inner"><div class="lgcy-faq3-answer"><p>Orders are typically <strong>processed within 1\u20133 business days</strong>.</p><p><strong>Estimated delivery:</strong> US & Canada: 7\u201312 days &nbsp;\u00b7&nbsp; Europe: 7\u201312 days &nbsp;\u00b7&nbsp; UAE: 10\u201314 days &nbsp;\u00b7&nbsp; Rest of world: 7\u201312 days</p></div></div></div>',
'      </details>',

'      <details class="lgcy-faq3-item">',
'        <summary><span class="lgcy-faq3-q">What does the warranty include?</span><span class="lgcy-faq3-chevron">' + chevron + '</span></summary>',
'        <div class="lgcy-faq3-body"><div class="lgcy-faq3-body-inner"><div class="lgcy-faq3-answer"><p>Our warranty <strong>does not cover personal misuse or damage</strong>. It applies only to <strong>manufacturing defects</strong> or material faults.</p></div></div></div>',
'      </details>',

'      <details class="lgcy-faq3-item">',
'        <summary><span class="lgcy-faq3-q">Any question?</span><span class="lgcy-faq3-chevron">' + chevron + '</span></summary>',
'        <div class="lgcy-faq3-body"><div class="lgcy-faq3-body-inner"><div class="lgcy-faq3-answer"><p>You can reach us through our <a href="/pages/contact">contact page</a>. We will be happy to assist you.</p></div></div></div>',
'      </details>',

'    </div>',
'  </div>',
'</div>',

'<script>',
'(function(){document.querySelectorAll(".lgcy-faq3-item").forEach(function(d){d.addEventListener("toggle",function(){if(d.open)document.querySelectorAll(".lgcy-faq3-item").forEach(function(o){if(o!==d&&o.open)o.open=false;});});});})();',
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
