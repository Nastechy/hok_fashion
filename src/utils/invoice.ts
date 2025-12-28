import type { Order } from '@/services/hokApi';

type InvoiceOptions = {
  storeName?: string;
  storeEmail?: string;
  formatCurrency?: (value: number) => string;
  formatDate?: (value?: string) => string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const buildInvoiceHtml = (order: Order, options: InvoiceOptions = {}) => {
  const {
    storeName = 'HOK FASHION HOUSE',
    storeEmail = 'support@hokfashionhouse.com',
    formatCurrency = (value: number) =>
      Number(value || 0).toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      }),
    formatDate = (value?: string) =>
      value ? new Date(value).toLocaleDateString('en-NG') : 'N/A',
  } = options;

  const items = order.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const processingFee = Math.min(Math.round(subtotal * 0.015), 2000);
  const total = subtotal + processingFee;

  const rows = items
    .map((item) => {
      const name = item.productName || item.product?.name || item.productCode || item.productId || 'Product';
      const code = item.productCode || item.product?.productCode || item.productId || 'N/A';
      const variant =
        item.variant || item.product?.variants?.[0]?.name || item.product?.variants?.[0]?.sku || '';
      const qty = Number(item.quantity || 0);
      const unit = Number(item.price || 0);
      const lineTotal = unit * qty;
      return `
        <tr>
          <td>
            <div class="item-name">${escapeHtml(name)}</div>
            <div class="item-meta">Code: ${escapeHtml(code)}${variant ? ` · ${escapeHtml(variant)}` : ''}</div>
          </td>
          <td class="center">${qty}</td>
          <td class="right">${escapeHtml(formatCurrency(unit))}</td>
          <td class="right">${escapeHtml(formatCurrency(lineTotal))}</td>
        </tr>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Invoice ${escapeHtml(order.friendlyId || order.id)}</title>
    <style>
      :root {
        color-scheme: only light;
        --ink: #141414;
        --muted: #5f5f5f;
        --line: #e5e5e5;
        --accent: #b91c1c;
        --soft: #f8f8f8;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #f5f2ee;
        font-family: "Times New Roman", serif;
        color: var(--ink);
      }
      .page {
        max-width: 880px;
        margin: 32px auto;
        background: #fff;
        padding: 40px;
        border: 1px solid #e2ddd7;
        box-shadow: 0 18px 50px rgba(0,0,0,0.08);
        position: relative;
        overflow: hidden;
      }
      .page::before {
        content: "";
        position: absolute;
        inset: 16px;
        border: 1px solid #e9e4de;
        pointer-events: none;
      }
      .header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: flex-start;
        border-bottom: 2px solid #d9d2ca;
        padding-bottom: 20px;
        margin-bottom: 28px;
        position: relative;
        z-index: 1;
      }
      .brand-wrap {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .logo-mark {
        height: 48px;
        width: 48px;
        border-radius: 999px;
        background: linear-gradient(135deg, #c71f37, #7f0a1d);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        letter-spacing: 1px;
        box-shadow: 0 8px 18px rgba(199, 31, 55, 0.35);
        border: 2px solid #f2d3d3;
      }
      .brand h1 {
        margin: 0 0 6px 0;
        font-size: 30px;
        letter-spacing: 3px;
        text-transform: uppercase;
      }
      .brand p {
        margin: 0;
        color: var(--muted);
        font-size: 13px;
        letter-spacing: 0.4px;
      }
      .invoice-meta {
        text-align: right;
        font-size: 14px;
      }
      .invoice-meta strong {
        display: block;
        font-size: 16px;
        color: var(--accent);
      }
      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        margin-bottom: 24px;
        position: relative;
        z-index: 1;
      }
      .card {
        border: 1px solid #e5ded7;
        padding: 16px;
        background: #fbfaf8;
      }
      .card h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--muted);
      }
      .card p {
        margin: 0;
        font-size: 15px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 24px;
        position: relative;
        z-index: 1;
      }
      thead th {
        text-align: left;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        padding: 10px 8px;
        background: #f6f2ee;
        border-bottom: 1px solid #e0d8d0;
      }
      tbody td {
        padding: 12px 8px;
        border-bottom: 1px solid #ece6df;
        vertical-align: top;
      }
      .center { text-align: center; }
      .right { text-align: right; }
      .item-name {
        font-weight: 600;
        margin-bottom: 4px;
      }
      .item-meta {
        font-size: 12px;
        color: var(--muted);
      }
      .totals {
        margin-left: auto;
        max-width: 280px;
        position: relative;
        z-index: 1;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e2dbd4;
        font-size: 14px;
      }
      .totals-row.total {
        border-bottom: none;
        font-size: 16px;
        font-weight: 700;
        color: var(--accent);
      }
      .footer {
        margin-top: 32px;
        border-top: 1px solid #e0d8d0;
        padding-top: 16px;
        font-size: 12px;
        color: var(--muted);
        text-align: center;
        position: relative;
        z-index: 1;
      }
      .watermark {
        position: absolute;
        right: 32px;
        bottom: 40px;
        font-size: 72px;
        letter-spacing: 10px;
        color: rgba(185, 28, 28, 0.08);
        font-weight: 700;
        text-transform: uppercase;
        transform: rotate(-8deg);
        pointer-events: none;
      }
      @media print {
        body { background: #fff; }
        .page { margin: 0; box-shadow: none; border: none; }
        .page::before { border: none; }
        .watermark { color: rgba(0, 0, 0, 0.06); }
      }
      @media (max-width: 640px) {
        .page { margin: 12px; padding: 22px; }
        .page::before { inset: 10px; }
        .header { flex-direction: column; align-items: flex-start; }
        .invoice-meta { text-align: left; }
        .brand-wrap { gap: 12px; }
        .logo-mark { height: 42px; width: 42px; font-size: 18px; }
        .brand h1 { font-size: 24px; letter-spacing: 2px; }
        .watermark {
          font-size: 42px;
          right: 16px;
          bottom: 22px;
          letter-spacing: 6px;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="brand-wrap">
          <div class="logo-mark">H</div>
          <div class="brand">
            <h1>${escapeHtml(storeName)}</h1>
            <p>${escapeHtml(storeEmail)}</p>
          </div>
        </div>
        <div class="invoice-meta">
          <strong>Invoice</strong>
          <div>Order ID: ${escapeHtml(order.friendlyId || order.id)}</div>
          <div>Date: ${escapeHtml(formatDate(order.createdAt))}</div>
          <div>Status: ${escapeHtml(order.status || 'PENDING')}</div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h3>Bill To</h3>
          <p>${escapeHtml(order.customerName || 'Guest')}</p>
          <p>${escapeHtml(order.customerEmail || 'Not provided')}</p>
          ${order.customerPhone ? `<p>${escapeHtml(order.customerPhone)}</p>` : ''}
        </div>
        <div class="card">
          <h3>Ship To</h3>
          <p>${escapeHtml(order.shippingAddress || order.billingAddress || 'Not provided')}</p>
          ${order.note ? `<p>Note: ${escapeHtml(order.note)}</p>` : ''}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="center">Qty</th>
            <th class="right">Unit</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="4">No items available.</td></tr>'}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>${escapeHtml(formatCurrency(subtotal))}</span>
        </div>
        <div class="totals-row">
          <span>Processing fee</span>
          <span>${escapeHtml(formatCurrency(processingFee))}</span>
        </div>
        <div class="totals-row total">
          <span>Total</span>
          <span>${escapeHtml(formatCurrency(total))}</span>
        </div>
      </div>

      <div class="footer">
        Thanks for shopping with ${escapeHtml(storeName)}.
      </div>
      <div class="watermark">HOK</div>
    </div>
  </body>
</html>`;
};
