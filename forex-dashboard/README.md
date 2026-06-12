# PropDesk — Forex & Prop Firm Trade Management Dashboard

A professional, fully responsive dashboard for Forex and prop-firm traders to manage
risk, size positions, monitor challenge rules and journal trades — built with
**Next.js 14, React 18, TypeScript, Tailwind CSS and Chart.js**.

## Features

- **Account & challenge tracking** — remaining daily/max drawdown, profit target,
  current drawdown and challenge completion %.
- **Position sizing engine** — lot size auto-adjusts to stop distance; dollar risk,
  pip/point distance, margin, max loss and potential profit.
- **Buy/Sell target logic** — automatic target price, risk and reward amounts.
- **Profit & loss simulator** — win/loss outcomes and projected new balance.
- **Prop firm analysis** — how many losing trades remain before a rule breach.
- **Target analysis** — winning trades needed to pass at the current R:R.
- **Risk management score** (0–100) with Safe / Moderate / Aggressive / Dangerous rating.
- **Charts** — equity curve, drawdown, challenge progress and risk distribution.
- **Trading journal** — log trades, screenshot upload, win rate, average R:R,
  profit factor, and one-click **Export to Excel**.
- **Economic calendar** with a currency / impact news filter.
- Dark prop-firm theme, smooth animations, loading skeletons and **localStorage** persistence.

Supported instruments: **EURUSD, GBPUSD, XAUUSD (Gold)**.

## Getting started

> Requires [Node.js](https://nodejs.org) 18+ (Node 20 LTS recommended).

```bash
# from inside this forex-dashboard folder
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the project
```

## Notes

This tool is for risk-management planning only. All figures are estimates — always
confirm pip values, contract sizes and rules with your broker and prop firm.
