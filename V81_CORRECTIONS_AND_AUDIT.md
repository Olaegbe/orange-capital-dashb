# Orange Capitals V81 – V80 corrections and audit notes

## Changes applied
- Reduced the Loans search panel's vertical footprint while retaining its existing search behavior.
- Kept loan detail views tied to a specific loan ID so each facility has independent principal, interest, balance, payment history, schedule, rollover history, due date and status. Customer History remains a list of all facilities linked to the customer.
- Updated rollover behavior: the extension due date is based on the current future due date (or today if already overdue); extension interest is calculated from the original facility principal at the recorded monthly rate; existing outstanding is carried forward and optional interest paid reduces the carried amount; rollover audit metadata is retained.
- Added a daily operations report with a date filter, branch scope (Abuja/Lagos/Both), application counts/value, actual disbursement counts/value, recovery transaction totals, and commission transaction totals, plus CSV export.
- Tightened shared letter/offer print CSS and investment letter sizing/table spacing to reduce header/footer collision and overflow.

## Validation
- `npm test`: 8/8 financial tests passed.
- ZIP archive integrity checked after packaging.
- Production build could not run in this environment because the uploaded project has no installed `node_modules` (`vite: not found`). Install dependencies and run `npm run build` before deployment.

## Audit caveats requiring production-data review
- Daily reports can only allocate activity to a branch when source records have a branch field or the documented Lagos fallback applies. Legacy events with missing/incorrect branch/date metadata cannot be reliably reconstructed.
- Commission totals depend on commission payments being recorded as dated records/expenses with a commission category/type. A commission owed or calculated but not paid should not be reported as paid.
- Rollover is a policy-sensitive financial operation. The updated calculation carries forward the current outstanding balance and adds new-period interest based on original principal. Confirm this matches each signed loan agreement before applying to live loans; some agreements may instead charge extension interest on principal only or capitalize unpaid interest differently.
- PDF layouts were adjusted in source CSS but could not be visually rendered/printed here; verify representative short and long letters in a browser before deployment.


## V82 corrections made after review
- Rollover is now an **additional-month** operation: selected months are added to the current duration, the due date extends by the selected months, and additional simple interest is charged monthly on the original principal. Previous total interest/payable are retained and increased rather than overwritten. An actual payment recorded during rollover is applied to the carried outstanding amount.
- Added tested `calculateRollover` financial helper and regression tests for duration addition, original-principal interest, and rollover with unpaid original interest.
- Customer History now opens one customer-level loan dashboard with Loan 1 / Loan 2 / further loan navigation. Each selected facility displays its own balances and has a Manage This Loan action.
- Delete Loan is now restricted to Credit and Funds Transfer team users; that team can also reject and approve/disburse at its workflow stage. Other teams retain their own-stage approval/rejection permissions but cannot delete.
- Added responsive styling for the customer loan navigator and safer print pagination rules. Daily reports and branch/date filters were already present and retained.
- Validation: `npm test` passes 10/10 tests. A production build could not be run here because dependency installation timed out; run `npm install` and `npm run build` on the deployment laptop before publishing.
