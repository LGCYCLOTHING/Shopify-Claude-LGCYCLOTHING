const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'templates', 'collection.json');
const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

const chevron = '<svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const faqHtml = [
'<style>',
'.lgcy-faq2-section{position:relative;width:100%;padding:7rem 2rem;box-sizing:border-box;background:#0a0a0a;overflow:hidden;display:flex;align-items:center;justify-content:center;}',

/* big decorative text behind everything — gives blur something to work against */
'.lgcy-faq2-section::before{content:"FAQ";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:system-ui,-apple-system,sans-serif;font-weight:900;font-size:clamp(180px,22vw,340px);letter-spacing:-0.06em;color:rgba(255,255,255,0.04);white-space:nowrap;pointer-events:none;z-index:0;line-height:1;}',

/* faint diagonal lines grid overlay */
'.lgcy-faq2-section::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(255,255,255,0.015) 0px,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 40px);pointer-events:none;z-index:0;}',

'.lgcy-faq2-inner{position:relative;z-index:1;width:100%;max-width:1000px;}',

/* header row */
'.lgcy-faq2-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;gap:2rem;}',
'.lgcy-faq2-title{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-weight:900;font-size:clamp(2.8rem,6vw,5rem);letter-spacing:-0.05em;text-transform:uppercase;color:#ffffff;line-height:0.95;margin:0;}',
'.lgcy-faq2-sub{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin:0;padding-bottom:0.4rem;}',

/* the frosted glass card wrapping all items */
'.lgcy-faq2-card{background:rgba(255,255,255,0.06);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;}',

'.lgcy-faq2-item{border-bottom:1px solid rgba(255,255,255,0.08);}',
'.lgcy-faq2-item:last-child{border-bottom:none;}',
'.lgcy-faq2-item summary{list-style:none;cursor:pointer;padding:1.6rem 2.4rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;user-select:none;-webkit-tap-highlight-color:transparent;transition:background 0.2s ease;}',
'.lgcy-faq2-item summary:hover{background:rgba(255,255,255,0.04);}',
'.lgcy-faq2-item summary::-webkit-details-marker{display:none;}',
'.lgcy-faq2-q{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:0.82rem;font-weight:900;letter-spacing:-0.01em;text-transform:uppercase;color:#ffffff;flex:1;line-height:1.4;}',
'.lgcy-faq2-num{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;color:rgba(255,255,255,0.2);margin-right:1.5rem;flex-shrink:0;}',
'.lgcy-faq2-chevron{flex-shrink:0;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;transition:background 0.25s ease,transform 0.4s cubic-bezier(0.34,1.56,0.64,1);color:rgba(255,255,255,0.6);}',
'.lgcy-faq2-item[open] .lgcy-faq2-chevron{transform:rotate(180deg);background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.35);}',

'.lgcy-faq2-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.45s cubic-bezier(0.4,0,0.2,1);}',
'.lgcy-faq2-item[open] .lgcy-faq2-body{grid-template-rows:1fr;}',
'.lgcy-faq2-body-inner{overflow:hidden;}',
'.lgcy-faq2-answer{padding:0 2.4rem 1.6rem 5rem;font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:0.82rem;line-height:1.85;letter-spacing:0em;color:rgba(255,255,255,0.45);font-weight:400;opacity:0;transform:translateY(-6px);transition:opacity 0.3s ease 0.08s,transform 0.3s ease 0.08s;}',
'.lgcy-faq2-item[open] .lgcy-faq2-answer{opacity:1;transform:translateY(0);}',
'.lgcy-faq2-answer p{margin:0 0 0.4rem;}',
'.lgcy-faq2-answer p:last-child{margin-bottom:0;}',
'.lgcy-faq2-answer strong{font-weight:700;color:rgba(255,255,255,0.75);}',
'.lgcy-faq2-answer a{color:#ffffff;text-decoration:underline;text-underline-offset:3px;}',

'@media(max-width:600px){',
'.lgcy-faq2-section{padding:5rem 1.2rem;}',
'.lgcy-faq2-item summary{padding:1.4rem 1.4rem;}',
'.lgcy-faq2-answer{padding:0 1.4rem 1.4rem 1.4rem;}',
'}',
'</style>',

'<div class="lgcy-faq2-section">',
'  <div class="lgcy-faq2-inner">',
'    <div class="lgcy-faq2-header">',
'      <h2 class="lgcy-faq2-title">FAQs</h2>',
'      <p class="lgcy-faq2-sub">Your questions, answered.</p>',
'    </div>',
'    <div class="lgcy-faq2-card">',

'      <details class="lgcy-faq2-item">',
'        <summary><span class="lgcy-faq2-num">01</span><span class="lgcy-faq2-q">How long does shipping take?</span><span class="lgcy-faq2-chevron">' + chevron + '</span></summary>',
'        <div class="lgcy-faq2-body"><div class="lgcy-faq2-body-inner"><div class="lgcy-faq2-answer"><p>Orders are typically <strong>processed within 1\u20133 business days</strong>.</p><p><strong>Estimated delivery:</strong> US & Canada: 7\u201312 days &nbsp;\u00b7&nbsp; Europe: 7\u201312 days &nbsp;\u00b7&nbsp; UAE: 10\u201314 days &nbsp;\u00b7&nbsp; Rest of world: 7\u201312 days</p></div></div></div>',
'      </details>',

'      <details class="lgcy-faq2-item">',
'        <summary><span class="lgcy-faq2-num">02</span><span class="lgcy-faq2-q">What does the warranty include?</span><span class="lgcy-faq2-chevron">' + chevron + '</span></summary>',
'        <div class="lgcy-faq2-body"><div class="lgcy-faq2-body-inner"><div class="lgcy-faq2-answer"><p>Our warranty <strong>does not cover personal misuse or damage</strong>. It applies only to <strong>manufacturing defects</strong> or material faults.</p></div></div></div>',
'      </details>',

'      <details class="lgcy-faq2-item">',
'        <summary><span class="lgcy-faq2-num">03</span><span class="lgcy-faq2-q">Any question?</span><span class="lgcy-faq2-chevron">' + chevron + '</span></summary>',
'        <div class="lgcy-faq2-body"><div class="lgcy-faq2-body-inner"><div class="lgcy-faq2-answer"><p>You can reach us through our <a href="/pages/contact">contact page</a>. We will be happy to assist you.</p></div></div></div>',
'      </details>',

'    </div>',
'  </div>',
'</div>',

'<script>',
'(function(){document.querySelectorAll(".lgcy-faq2-item").forEach(function(d){d.addEventListener("toggle",function(){if(d.open)document.querySelectorAll(".lgcy-faq2-item").forEach(function(o){if(o!==d&&o.open)o.open=false;});});});})();',
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
