# V83 Financials and Documents Corrections

1. When a Business Development commission is confirmed as paid, the loan now records the commission amount, paid date, recipient, branch, payment reference, and payment method marker. The Financials Commission Paid total is calculated from loans marked commissionPaid, using the recorded commission amount or the default 3% of principal for legacy paid entries without an amount. The paid flag prevents duplicate confirmations.
2. The Documents page now lists generated letter records only (offer letter, letter of indebtedness, repayment acknowledgment letter, final liquidation notice/liquidation letter). Rollover, payment, and other operational events are excluded and remain in activity records. The page explicitly states that downloadable stored copies require database/file-storage integration.

Validation: `npm test` passes all 10 existing tests. A production build could not be run in this environment because dependencies are not installed (`vite: not found`).
