'use strict';

// ─── Futures Contract Data ────────────────────────────────────────────────────

const FUTURES_DATA = {
  // Equity Index
  ES:  { name: 'E-mini S&P 500',            category: 'Equity Index', point_value: 50.00,       tick_value: 12.50,   tick_size: 0.25,          micro: 'MES' },
  MES: { name: 'Micro E-mini S&P 500',       category: 'Equity Index', point_value: 5.00,        tick_value: 1.25,    tick_size: 0.25,          micro: null  },
  NQ:  { name: 'E-mini Nasdaq-100',          category: 'Equity Index', point_value: 20.00,       tick_value: 5.00,    tick_size: 0.25,          micro: 'MNQ' },
  MNQ: { name: 'Micro E-mini Nasdaq-100',    category: 'Equity Index', point_value: 2.00,        tick_value: 0.50,    tick_size: 0.25,          micro: null  },
  YM:  { name: 'E-mini Dow Jones',           category: 'Equity Index', point_value: 5.00,        tick_value: 5.00,    tick_size: 1.00,          micro: 'MYM' },
  MYM: { name: 'Micro E-mini Dow Jones',     category: 'Equity Index', point_value: 0.50,        tick_value: 0.50,    tick_size: 1.00,          micro: null  },
  RTY: { name: 'E-mini Russell 2000',        category: 'Equity Index', point_value: 50.00,       tick_value: 5.00,    tick_size: 0.10,          micro: 'M2K' },
  M2K: { name: 'Micro E-mini Russell 2000',  category: 'Equity Index', point_value: 5.00,        tick_value: 0.50,    tick_size: 0.10,          micro: null  },
  VX:  { name: 'CBOE VIX Futures',           category: 'Equity Index', point_value: 1000.00,     tick_value: 50.00,   tick_size: 0.05,          micro: null  },
  // Metals
  GC:  { name: 'Gold',                       category: 'Metals',       point_value: 100.00,      tick_value: 10.00,   tick_size: 0.10,          micro: 'MGC' },
  MGC: { name: 'Micro Gold',                 category: 'Metals',       point_value: 10.00,       tick_value: 1.00,    tick_size: 0.10,          micro: null  },
  SI:  { name: 'Silver',                     category: 'Metals',       point_value: 5000.00,     tick_value: 25.00,   tick_size: 0.005,         micro: 'SIL' },
  SIL: { name: 'Micro Silver',               category: 'Metals',       point_value: 1000.00,     tick_value: 5.00,    tick_size: 0.005,         micro: null  },
  HG:  { name: 'Copper',                     category: 'Metals',       point_value: 25000.00,    tick_value: 12.50,   tick_size: 0.0005,        micro: 'MHG' },
  MHG: { name: 'Micro Copper',               category: 'Metals',       point_value: 2500.00,     tick_value: 1.25,    tick_size: 0.0005,        micro: null  },
  PL:  { name: 'Platinum',                   category: 'Metals',       point_value: 50.00,       tick_value: 5.00,    tick_size: 0.10,          micro: null  },
  // Energy
  CL:  { name: 'Crude Oil (WTI)',            category: 'Energy',       point_value: 1000.00,     tick_value: 10.00,   tick_size: 0.01,          micro: 'MCL' },
  MCL: { name: 'Micro Crude Oil (WTI)',      category: 'Energy',       point_value: 100.00,      tick_value: 1.00,    tick_size: 0.01,          micro: null  },
  NG:  { name: 'Natural Gas',                category: 'Energy',       point_value: 10000.00,    tick_value: 10.00,   tick_size: 0.001,         micro: null  },
  // Treasury
  ZN:  { name: '10-Year T-Note',             category: 'Treasury',     point_value: 1000.00,     tick_value: 15.625,  tick_size: '1/2 of 1/32', micro: null  },
  ZB:  { name: '30-Year T-Bond',             category: 'Treasury',     point_value: 1000.00,     tick_value: 31.25,   tick_size: '1/32',        micro: null  },
  ZF:  { name: '5-Year T-Note',              category: 'Treasury',     point_value: 1000.00,     tick_value: 7.8125,  tick_size: '1/4 of 1/32', micro: null  },
  ZQ:  { name: 'Fed Funds Rate',             category: 'Treasury',     point_value: 4167.00,     tick_value: 20.835,  tick_size: 0.005,         micro: null  },
  // Currency
  '6E': { name: 'Euro FX',                  category: 'Currency',     point_value: 125000.00,   tick_value: 6.25,    tick_size: 0.00005,       micro: 'M6E' },
  M6E: { name: 'Micro Euro FX',             category: 'Currency',     point_value: 12500.00,    tick_value: 1.25,    tick_size: 0.00005,       micro: null  },
  '6B': { name: 'British Pound',            category: 'Currency',     point_value: 62500.00,    tick_value: 6.25,    tick_size: 0.0001,        micro: null  },
  '6J': { name: 'Japanese Yen',             category: 'Currency',     point_value: 12500000.00, tick_value: 6.25,    tick_size: 0.0000005,     micro: null  },
  '6C': { name: 'Canadian Dollar',          category: 'Currency',     point_value: 100000.00,   tick_value: 5.00,    tick_size: 0.00005,       micro: null  },
  // Crypto
  BTC: { name: 'Bitcoin Futures',           category: 'Crypto',       point_value: 5.00,        tick_value: 25.00,   tick_size: 5.00,          micro: 'MBT' },
  MBT: { name: 'Micro Bitcoin Futures',     category: 'Crypto',       point_value: 0.10,        tick_value: 0.10,    tick_size: 1.00,          micro: null  },
};

// ─── Calculation Engine ───────────────────────────────────────────────────────

function getRiskPerContract(stopLoss, unit, data) {
  return unit === 'points'
    ? stopLoss * data.point_value
    : stopLoss * data.tick_value;
}

function getStopLossInfo(stopLoss, unit, data) {
  const ticksPerPoint = data.point_value / data.tick_value;
  if (unit === 'points') {
    return {
      points: stopLoss,
      ticks: parseFloat((stopLoss * ticksPerPoint).toPrecision(12)),
    };
  }
  return {
    points: parseFloat((stopLoss / ticksPerPoint).toPrecision(12)),
    ticks: stopLoss,
  };
}

function getScaleIn(n) {
  if (n <= 1) return null;
  if (n % 2 === 0) {
    const half = n / 2;
    return `Scale in: 2 entries of ${half} contract${half > 1 ? 's' : ''} each`;
  }
  return `Scale in: initial ${Math.ceil(n / 2)}, second ${Math.floor(n / 2)}`;
}

function buildPlan(symbol, stopLoss, unit, maxRiskDollars, accountSize) {
  const data = FUTURES_DATA[symbol];
  if (!data) return null;
  const riskPerContract = getRiskPerContract(stopLoss, unit, data);
  if (riskPerContract <= 0) return null;
  const maxContracts = Math.floor(maxRiskDollars / riskPerContract);
  const totalRisk = maxContracts * riskPerContract;
  return {
    symbol,
    name: data.name,
    maxContracts,
    riskPerContract,
    totalRisk,
    riskPercent: accountSize > 0 ? (totalRisk / accountSize) * 100 : null,
    stopLossInfo: getStopLossInfo(stopLoss, unit, data),
    pointValue: data.point_value,
    tickValue: data.tick_value,
    scaleIn: getScaleIn(maxContracts),
  };
}

function calculate({ accountSize, maxRiskDollars, symbol, stopLoss, unit }) {
  const data = FUTURES_DATA[symbol];
  if (!data || stopLoss <= 0 || maxRiskDollars <= 0) return null;

  const riskPerContract = getRiskPerContract(stopLoss, unit, data);
  const primary = buildPlan(symbol, stopLoss, unit, maxRiskDollars, accountSize);

  // Always compute micro if one exists
  let micro = null;
  if (data.micro && FUTURES_DATA[data.micro]) {
    const m = buildPlan(data.micro, stopLoss, unit, maxRiskDollars, accountSize);
    if (m && m.maxContracts > 0) micro = m;
  }

  if (!primary || primary.maxContracts === 0) {
    // Standard contract is over budget
    if (micro) return { status: 'micro_only', primary: null, micro, riskPerContract, maxRiskDollars };
    return { status: 'too_risky', primary: null, micro: null, riskPerContract, maxRiskDollars };
  }

  return { status: 'ok', primary, micro, riskPerContract, maxRiskDollars };
}

// ─── State & Persistence ──────────────────────────────────────────────────────

const DEFAULTS = {
  accountSize: 25000,
  riskMode: 'percent',
  riskPercent: 1,
  riskFixed: 250,
  symbol: 'ES',
  stopLoss: 10,
  unit: 'points',
  cvSymbol: 'ES',
  cvAmount: '',
  cvUnit: 'points',
  favorites: ['ES', 'NQ', 'CL', 'GC'],
  qsEditing: false,
};

let S = { ...DEFAULTS };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('frb_v2') || '{}');
    S = { ...DEFAULTS, ...saved, qsEditing: false }; // never restore edit mode
  } catch (_) {
    S = { ...DEFAULTS };
  }
}

function save() {
  try { localStorage.setItem('frb_v2', JSON.stringify(S)); } catch (_) {}
}

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

const el = id => document.getElementById(id);

// ─── Quick Select ─────────────────────────────────────────────────────────────

function focusStopLoss() {
  const inp = el('stop-loss');
  inp.focus();
  inp.select();
}

function selectInstrument(sym) {
  if (!FUTURES_DATA[sym]) return;
  S.symbol = sym;
  el('instrument').value = sym;
  S.cvSymbol = sym;
  el('cv-instrument').value = sym;
  save();
  run();
  renderConverter();
  renderQuickSelect();
  updateFavBtn();
  focusStopLoss();
}

function updateFavBtn() {
  const btn   = el('qs-fav-btn');
  const isFav = S.favorites.includes(S.symbol);
  btn.textContent = isFav ? '★' : '☆';
  btn.title       = isFav ? 'Remove from quick select' : 'Add to quick select';
  btn.setAttribute('aria-label', isFav ? `Remove ${S.symbol} from favorites` : `Add ${S.symbol} to favorites`);
  btn.classList.toggle('is-fav', isFav);
}

function renderQuickSelect() {
  const chips   = el('qs-chips');
  const editBtn = el('qs-edit-btn');
  chips.innerHTML = '';

  S.favorites.forEach(sym => {
    if (!FUTURES_DATA[sym]) return;
    if (S.qsEditing) {
      const div = document.createElement('div');
      div.className = 'qs-chip';
      div.innerHTML = `${sym}<button class="qs-x" data-sym="${sym}" aria-label="Remove ${sym}">×</button>`;
      div.querySelector('.qs-x').addEventListener('click', () => {
        S.favorites = S.favorites.filter(f => f !== sym);
        save();
        renderQuickSelect();
      });
      chips.appendChild(div);
    } else {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-chip' + (sym === S.symbol ? ' qs-active' : '');
      btn.textContent = sym;
      btn.setAttribute('aria-label', `Switch to ${sym} – ${FUTURES_DATA[sym].name}`);
      btn.addEventListener('click', () => selectInstrument(sym));
      chips.appendChild(btn);
    }
  });

  if (S.qsEditing) {
    editBtn.textContent = '✓ Done';
    editBtn.classList.add('qs-editing');
  } else {
    editBtn.textContent = '✎ Edit';
    editBtn.classList.remove('qs-editing');
  }
}

function populateSelects() {
  const grouped = {};
  for (const [sym, data] of Object.entries(FUTURES_DATA)) {
    (grouped[data.category] = grouped[data.category] || []).push({ sym, ...data });
  }
  for (const selId of ['instrument', 'cv-instrument']) {
    const sel = el(selId);
    sel.innerHTML = '';
    for (const [cat, list] of Object.entries(grouped)) {
      const og = document.createElement('optgroup');
      og.label = cat;
      for (const c of list) {
        const opt = document.createElement('option');
        opt.value = c.sym;
        opt.textContent = `${c.sym} – ${c.name}`;
        og.appendChild(opt);
      }
      sel.appendChild(og);
    }
  }
}

function buildContractsTable() {
  const tbody = el('contracts-tbody');
  tbody.innerHTML = '';
  const grouped = {};
  for (const [sym, data] of Object.entries(FUTURES_DATA)) {
    (grouped[data.category] = grouped[data.category] || []).push({ sym, ...data });
  }
  for (const [cat, list] of Object.entries(grouped)) {
    const hr = document.createElement('tr');
    hr.className = 'tbl-cat';
    hr.innerHTML = `<td colspan="6">${cat}</td>`;
    tbody.appendChild(hr);
    for (const c of list) {
      const row = document.createElement('tr');
      const tickStr = typeof c.tick_size === 'number' ? c.tick_size.toString() : c.tick_size;
      row.innerHTML = `
        <td class="mono fw-bold">${c.sym}</td>
        <td>${c.name}</td>
        <td class="mono dim">${c.micro || '—'}</td>
        <td class="mono r">$${c.point_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td class="mono r">$${c.tick_value.toFixed(4)}</td>
        <td class="mono r">${tickStr}</td>
      `;
      tbody.appendChild(row);
    }
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

const usd = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmt = (n, d = 4) => parseFloat(n.toFixed(d));

function planHTML(plan, variant) {
  const cls = { success: 'plan-green', warning: 'plan-amber', neutral: 'plan-dim' }[variant] ?? 'plan-dim';
  const riskPct = plan.riskPercent != null
    ? `<div class="plan-row"><span>Risk % of Account</span><span class="mono">${plan.riskPercent.toFixed(2)}%</span></div>` : '';
  return `
    <div class="trade-plan ${cls}">
      <div class="plan-tag">${plan.symbol} — ${plan.name}</div>
      <div class="plan-big">
        <span class="plan-big-label">Max Contracts</span>
        <span class="plan-big-val">${plan.maxContracts}</span>
      </div>
      <div class="plan-rows">
        <div class="plan-row"><span>Risk / Contract</span><span class="mono">${usd(plan.riskPerContract)}</span></div>
        <div class="plan-row"><span>Total Risk</span><span class="mono fw-bold">${usd(plan.totalRisk)}</span></div>
        ${riskPct}
        <div class="plan-row"><span>Stop Loss</span><span class="mono">${fmt(plan.stopLossInfo.points)} pts / ${fmt(plan.stopLossInfo.ticks)} ticks</span></div>
        <div class="plan-row"><span>Point Value</span><span class="mono">$${plan.pointValue.toLocaleString()}</span></div>
        <div class="plan-row"><span>Tick Value</span><span class="mono">${usd(plan.tickValue)}</span></div>
      </div>
      ${plan.scaleIn ? `<div class="plan-scalein">${plan.scaleIn}</div>` : ''}
    </div>`;
}

function renderResult(result) {
  const panel = el('result-panel');
  if (!result) {
    panel.innerHTML = `<div class="result-empty">Enter your parameters above to see position sizing.</div>`;
    return;
  }

  if (result.status === 'too_risky') {
    panel.innerHTML = `
      <div class="badge badge-red">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
        Over Risk Limit
      </div>
      <p class="result-msg">Risk per contract is <strong>${usd(result.riskPerContract)}</strong> — exceeds your <strong>${usd(result.maxRiskDollars)}</strong> max. No affordable alternative found.</p>`;
    return;
  }

  if (result.status === 'micro_only') {
    panel.innerHTML = `
      <div class="badge badge-amber">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
        Micro Alternative
      </div>
      <p class="result-msg">Standard contract requires <strong>${usd(result.riskPerContract)}</strong> — over your limit. Showing the micro equivalent:</p>
      ${planHTML(result.micro, 'warning')}`;
    return;
  }

  // status === 'ok'
  const { primary, micro } = result;
  const microSection = micro && primary.maxContracts <= 2 ? `
    <div class="micro-alt">
      <p class="micro-label">Micro alternative for more flexibility:</p>
      ${planHTML(micro, 'neutral')}
    </div>` : '';

  panel.innerHTML = `
    <div class="badge badge-green">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      Within Risk Limits
    </div>
    ${planHTML(primary, 'success')}
    ${microSection}`;
}

function renderConverter() {
  const data = FUTURES_DATA[S.cvSymbol];
  const amt = parseFloat(S.cvAmount);
  const out = el('cv-result');
  if (!data || !amt || amt <= 0) { out.textContent = '—'; return; }
  const val = S.cvUnit === 'points' ? amt * data.point_value : amt * data.tick_value;
  out.textContent = usd(val);
}

// ─── Core Update Loop ─────────────────────────────────────────────────────────

function getMaxRisk() {
  return S.riskMode === 'fixed' ? S.riskFixed : (S.accountSize * S.riskPercent) / 100;
}

function updateRiskDisplay() {
  const max = getMaxRisk();
  el('risk-computed').textContent = max > 0 ? `= ${usd(max)} per trade` : '';
  el('row-percent').style.display = S.riskMode === 'percent' ? '' : 'none';
  el('row-fixed').style.display   = S.riskMode === 'fixed'   ? '' : 'none';
}

function run() {
  const result = calculate({
    accountSize: S.accountSize,
    maxRiskDollars: getMaxRisk(),
    symbol: S.symbol,
    stopLoss: S.stopLoss,
    unit: S.unit,
  });
  renderResult(result);
}

// ─── Event Wiring ─────────────────────────────────────────────────────────────

function bindEvents() {
  el('account-size').addEventListener('input', e => {
    S.accountSize = parseFloat(e.target.value) || 0;
    save(); updateRiskDisplay(); run();
  });

  document.querySelectorAll('input[name="risk-mode"]').forEach(r =>
    r.addEventListener('change', e => {
      S.riskMode = e.target.value;
      save(); updateRiskDisplay(); run();
    })
  );

  el('risk-percent').addEventListener('input', e => {
    S.riskPercent = parseFloat(e.target.value) || 0;
    save(); updateRiskDisplay(); run();
  });

  el('risk-fixed').addEventListener('input', e => {
    S.riskFixed = parseFloat(e.target.value) || 0;
    save(); updateRiskDisplay(); run();
  });

  el('instrument').addEventListener('change', e => {
    S.symbol = e.target.value;
    S.cvSymbol = e.target.value;
    el('cv-instrument').value = S.cvSymbol;
    save(); run(); renderConverter();
    renderQuickSelect();
    updateFavBtn();
    focusStopLoss();
  });

  el('qs-fav-btn').addEventListener('click', () => {
    if (S.favorites.includes(S.symbol)) {
      S.favorites = S.favorites.filter(f => f !== S.symbol);
    } else {
      S.favorites = [...S.favorites, S.symbol];
    }
    save();
    renderQuickSelect();
    updateFavBtn();
  });

  el('qs-edit-btn').addEventListener('click', () => {
    S.qsEditing = !S.qsEditing;
    renderQuickSelect();
  });

  el('stop-loss').addEventListener('input', e => {
    S.stopLoss = parseFloat(e.target.value) || 0;
    save(); run();
  });

  document.querySelectorAll('input[name="unit"]').forEach(r =>
    r.addEventListener('change', e => {
      S.unit = e.target.value;
      save(); run();
    })
  );

  el('cv-instrument').addEventListener('change', e => {
    S.cvSymbol = e.target.value;
    save(); renderConverter();
  });

  el('cv-amount').addEventListener('input', e => {
    S.cvAmount = e.target.value;
    renderConverter();
  });

  document.querySelectorAll('input[name="cv-unit"]').forEach(r =>
    r.addEventListener('change', e => {
      S.cvUnit = e.target.value;
      renderConverter();
    })
  );

  el('toggle-method').addEventListener('click', () => {
    const body = el('method-body');
    const btn  = el('toggle-method');
    const willOpen = body.hasAttribute('hidden');
    willOpen ? body.removeAttribute('hidden') : body.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', willOpen);
    btn.textContent = willOpen ? 'Close ▲' : 'Read the methodology ▼';
  });

  el('toggle-contracts').addEventListener('click', () => {
    const wrap = el('contracts-wrap');
    const btn  = el('toggle-contracts');
    const open = wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? 'Hide table ▲' : 'View all contracts ▼';
  });

  // Kit email capture
  const kitForm = el('kit-form');
  if (kitForm) {
    kitForm.addEventListener('submit', async e => {
      e.preventDefault();
      const emailInput = el('kit-email');
      const submitBtn  = el('kit-submit');
      const errorEl    = el('kit-error');
      const email = emailInput.value.trim();
      if (!email) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      errorEl.setAttribute('hidden', '');

      try {
        // mode: 'no-cors' avoids CORS preflight — response is opaque but submission fires
        await fetch('https://app.kit.com/forms/9520667/subscriptions', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ email_address: email }).toString(),
        });
        kitForm.setAttribute('hidden', '');
        el('kit-success').removeAttribute('hidden');
      } catch (_) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send me the cheat sheet →';
        errorEl.removeAttribute('hidden');
      }
    });
  }

  document.querySelectorAll('.faq-q').forEach(btn =>
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    })
  );
}

function syncUI() {
  el('account-size').value  = S.accountSize;
  el('risk-percent').value  = S.riskPercent;
  el('risk-fixed').value    = S.riskFixed;
  el('instrument').value    = S.symbol;
  el('stop-loss').value     = S.stopLoss;
  el('cv-instrument').value = S.cvSymbol;
  el('cv-amount').value     = S.cvAmount;
  document.querySelectorAll('input[name="risk-mode"]').forEach(r => { r.checked = r.value === S.riskMode; });
  document.querySelectorAll('input[name="unit"]').forEach(r => { r.checked = r.value === S.unit; });
  document.querySelectorAll('input[name="cv-unit"]').forEach(r => { r.checked = r.value === S.cvUnit; });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  load();
  populateSelects();
  buildContractsTable();
  syncUI();
  renderQuickSelect();
  updateFavBtn();
  updateRiskDisplay();
  run();
  renderConverter();
  bindEvents();
});
