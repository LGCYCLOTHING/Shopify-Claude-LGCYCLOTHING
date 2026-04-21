const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'templates', 'collection.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const faqHtml = `<style>
.shopify-section:has(.lgcy-faq3-section) { background: #0d0d0d !important; }
.lgcy-faq3-section{position:relative;width:100%;padding:10rem 2rem;box-sizing:border-box;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#0d0d0d;}
.lgcy-faq3-bg{position:absolute;inset:0;background-image:url('https://cdn.shopify.com/s/files/1/0688/4537/1578/files/download_1.jpg');background-size:cover;background-position:center;transform:scale(1.05);}
.lgcy-faq3-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.6);}
.lgcy-faq3-inner{position:relative;z-index:1;width:100%;max-width:1000px;}
.lgcy-faq3-header{margin-bottom:2.5rem;}
.lgcy-faq3-eyebrow{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:9px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin:0 0 10px;}
.lgcy-faq3-title{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-weight:900;font-size:clamp(2.2rem,5vw,3.8rem);letter-spacing:-0.05em;text-transform:uppercase;color:#ffffff;line-height:0.95;margin:0;}
.lgcy-faq3-card{background:rgba(255,255,255,0.04);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;}
.lgcy-faq3-item{border-bottom:1px solid rgba(255,255,255,0.08);}
.lgcy-faq3-item:last-child{border-bottom:none;}
.lgcy-faq3-item summary{list-style:none;cursor:pointer;padding:22px 32px;display:flex;align-items:center;justify-content:space-between;gap:2rem;user-select:none;-webkit-tap-highlight-color:transparent;transition:background 0.2s ease;}
.lgcy-faq3-item summary:hover{background:rgba(255,255,255,0.03);}
.lgcy-faq3-item summary::-webkit-details-marker{display:none;}
.lgcy-faq3-q{font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:clamp(13px,2vw,15px);font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;color:#ffffff;flex:1;line-height:1.3;}
.lgcy-faq3-chevron{flex-shrink:0;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;transition:background 0.25s ease,transform 0.4s cubic-bezier(0.34,1.56,0.64,1);color:rgba(255,255,255,0.4);}
.lgcy-faq3-chevron.is-open{transform:rotate(180deg);background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.25);}
/* Body: always starts collapsed — JS drives open state */
.lgcy-faq3-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.5s cubic-bezier(0.4,0,0.2,1);}
.lgcy-faq3-body-inner{overflow:hidden;}
.lgcy-faq3-answer{padding:0 32px 22px 32px;font-family:system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;font-size:13px;line-height:1.9;letter-spacing:-0.01em;color:rgba(255,255,255,0.45);font-weight:400;opacity:0;transform:translateY(-6px);transition:opacity 0.4s ease 0.15s,transform 0.4s ease 0.15s;}
.lgcy-faq3-answer p{margin:0 0 0.4rem;}
.lgcy-faq3-answer p:last-child{margin-bottom:0;}
.lgcy-faq3-answer strong{font-weight:700;color:rgba(255,255,255,0.7);}
.lgcy-faq3-answer a{color:#ffffff;text-decoration:underline;text-underline-offset:3px;}
</style>
<div class="lgcy-faq3-section">
  <div class="lgcy-faq3-bg"></div>
  <div class="lgcy-faq3-overlay"></div>
  <div class="lgcy-faq3-inner">
    <div class="lgcy-faq3-header">
      <p class="lgcy-faq3-eyebrow">Support</p>
      <h2 class="lgcy-faq3-title">FAQs</h2>
    </div>
    <div class="lgcy-faq3-card">
      <details class="lgcy-faq3-item">
        <summary><span class="lgcy-faq3-q">How long does shipping take?</span><span class="lgcy-faq3-chevron"><svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></summary>
        <div class="lgcy-faq3-body"><div class="lgcy-faq3-body-inner"><div class="lgcy-faq3-answer"><p>Orders are typically <strong>processed within 1-3 business days</strong>.</p><p><strong>Estimated delivery:</strong> US & Canada: 7-12 days &nbsp;.&nbsp; Europe: 7-12 days &nbsp;.&nbsp; UAE: 10-14 days &nbsp;.&nbsp; Rest of world: 7-12 days</p></div></div></div>
      </details>
      <details class="lgcy-faq3-item">
        <summary><span class="lgcy-faq3-q">What does the warranty include?</span><span class="lgcy-faq3-chevron"><svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></summary>
        <div class="lgcy-faq3-body"><div class="lgcy-faq3-body-inner"><div class="lgcy-faq3-answer"><p>Our warranty <strong>does not cover personal misuse or damage</strong>. It applies only to <strong>manufacturing defects</strong> or material faults.</p></div></div></div>
      </details>
      <details class="lgcy-faq3-item">
        <summary><span class="lgcy-faq3-q">Any questions?</span><span class="lgcy-faq3-chevron"><svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></summary>
        <div class="lgcy-faq3-body"><div class="lgcy-faq3-body-inner"><div class="lgcy-faq3-answer"><p>You can reach us through our <a href="/pages/contact">contact page</a>. We will be happy to assist you.</p></div></div></div>
      </details>
    </div>
  </div>
</div>
<script>
(function(){
  var el = document.querySelector('.lgcy-faq3-section');
  if (el && el.parentElement) el.parentElement.style.background = '#0d0d0d';

  function openItem(details) {
    var body = details.querySelector('.lgcy-faq3-body');
    var answer = details.querySelector('.lgcy-faq3-answer');
    var chevron = details.querySelector('.lgcy-faq3-chevron');
    // Force collapsed before opening so transition always plays
    body.style.gridTemplateRows = '0fr';
    answer.style.opacity = '0';
    answer.style.transform = 'translateY(-6px)';
    details.open = true;
    // Double rAF ensures the collapsed state is painted before we animate
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        body.style.gridTemplateRows = '1fr';
        answer.style.opacity = '1';
        answer.style.transform = 'translateY(0)';
        if (chevron) chevron.classList.add('is-open');
      });
    });
  }

  function closeItem(details, cb) {
    var body = details.querySelector('.lgcy-faq3-body');
    var answer = details.querySelector('.lgcy-faq3-answer');
    var chevron = details.querySelector('.lgcy-faq3-chevron');
    body.style.gridTemplateRows = '0fr';
    answer.style.opacity = '0';
    answer.style.transform = 'translateY(-6px)';
    if (chevron) chevron.classList.remove('is-open');
    setTimeout(function(){
      details.open = false;
      body.style.gridTemplateRows = '';
      answer.style.cssText = '';
      if (cb) cb();
    }, 520);
  }

  document.querySelectorAll('.lgcy-faq3-item').forEach(function(details) {
    details.querySelector('summary').addEventListener('click', function(e) {
      e.preventDefault();
      if (details.open) {
        closeItem(details);
      } else {
        // Close any open sibling first
        document.querySelectorAll('.lgcy-faq3-item').forEach(function(other) {
          if (other !== details && other.open) closeItem(other);
        });
        openItem(details);
      }
    });
  });
})();
</script>`;

data.sections['lgcy_faq_TMGqdE'].settings.custom_liquid = faqHtml;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Done');
