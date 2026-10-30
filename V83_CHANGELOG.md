# Orange Capitals Limited — Version 83

## Version 83 changes
- Added **Add Another Investment** to the investor dashboard.
- The action opens the same investment entry form used for a first investment, with the selected investor prefilled.
- Existing investor contact, address and bank-account fields are carried into the form where available; the user can edit them before saving.
- Each additional investment remains a separate investment record with its own amount, term, ROI plan, schedule, payment status and liquidation state.
- Related investments retain the same investor portal token and are grouped in the investor portfolio dashboard.
- Selecting an existing investor in the investment form also pre-fills their available bank details.

## Verification
- JSX/TypeScript parser check: passed (`tsc --allowJs --checkJs false --noEmit --jsx react-jsx --module esnext --target es2022 --skipLibCheck src/main.jsx`).
- `npm test`: passed (10/10 tests).
- Production build: not completed because dependency installation timed out in this environment; run `npm install` and `npm run build` before deployment.

## Scope note
This is a source-code ZIP. The build was not verified in this environment, and this release note does not claim that every previously discussed PDF/letter and registration workflow correction is complete.
