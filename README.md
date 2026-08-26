# Cleaning Profit Calculator

A static, browser-based pricing calculator for small cleaning businesses. It turns labor, job-specific expenses, monthly overhead, payment fees, and a desired profit margin into a break-even price and a recommended customer price.

The application has no backend, no paid API, no build step, and no third-party runtime dependency. It can be hosted for free on GitHub Pages.

## What the application does

- Calculates labor cost from hourly wage, workers, and cleaning hours.
- Adds supplies, travel, parking, allocated equipment, and other variable costs.
- Allocates monthly business overhead to each job.
- Accounts for percentage-based payment processing fees.
- Uses a true profit-margin formula instead of treating margin as a cost markup.
- Applies a configurable service-complexity multiplier.
- Displays break-even price, recommended price, estimated profit, actual margin, revenue per labor hour, and total job cost.
- Suggests Basic, Standard, and Premium package prices with restrained commercial rounding.
- Calculates the jobs needed to reach a monthly profit target and initially syncs average profit with the current job estimate.
- Includes a launch offer whose name, price, and checkout URL are configured in one place.
- Switches the full interface instantly between English and Spanish without reloading.
- Remembers the selected language independently from currency and calculator data.
- Saves calculator and monthly-goal values in `localStorage`.
- Stores early-access email submissions only in `localStorage` as an explicit prototype.

## Project structure

```text
.
├── index.html   # Semantic page structure and English interface copy
├── styles.css   # Responsive visual system and component styles
├── script.js    # Configuration, pricing engine, validation, rendering, and storage
└── README.md    # Setup, deployment, formulas, and extension notes
```

## Run locally

Because the project is fully static, you can open `index.html` directly in a modern browser. Using a small local web server more closely matches GitHub Pages:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

If Python is not available, any static file server will work, such as `npx serve .`.

## Publish with GitHub Pages

1. Create a GitHub repository and add these four files at its root.
2. Push the repository to GitHub.
3. Open the repository's **Settings**.
4. Choose **Pages** in the sidebar.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select the branch containing the files (usually `main`) and the `/ (root)` folder.
7. Save. GitHub will show the public URL after deployment finishes.

All asset references are relative, so the application works both at a user/organization Pages domain and inside a repository subpath.

## Change service multipliers

Service definitions are centralized near the top of `script.js` in `APP_CONFIG.serviceTypes`:

```js
serviceTypes: [
  { id: "standard", labelKey: "serviceStandard", multiplier: 1.0 },
  { id: "deep", labelKey: "serviceDeep", multiplier: 1.3 },
  // ...
]
```

Edit a `multiplier`, change its translated `labelKey`, or add another object. The dropdown is generated from this array, so `index.html` does not need to be edited when service types change. Add the label text for every supported language in `TRANSLATIONS`.

## Configure the launch offer

The commercial offer is centralized near the top of `script.js` in `APP_CONFIG.commercialOffer`:

```js
commercialOffer: {
  productName: {
    en: "Personalized Pricing Setup",
    es: "Configuración Personalizada de Precios",
  },
  priceUsd: 19,
  purchaseUrl: "",
}
```

Change `priceUsd` for the displayed launch price. Edit the two `productName` values when renaming the product. Paste the complete Gumroad checkout URL into `purchaseUrl`; the CTA will immediately become an active link and the “checkout opening soon” notice will disappear. While the URL is empty, the CTA remains visibly prepared but cannot navigate to a broken checkout.

## Monthly goal synchronization

On first use, **Average profit per job** is filled with the current **Estimated Profit** from the main calculator. It keeps following the main estimate until the user edits the average manually. The **Use current estimate** button restores automatic synchronization. This mode is saved with the monthly-goal data in `localStorage`.

## Pricing formulas

The pure `calculatePricing()` function in `script.js` contains the pricing logic. The function does not read or write the page, which makes it easier to test and reuse.

```text
Labor Cost = Hourly Wage × Workers × Hours

Variable Costs = Supplies + Travel + Parking
               + Allocated Equipment + Other Variable Costs

Direct Costs = Labor Cost + Variable Costs

Monthly Overhead = Insurance + Software + Phone + Marketing
                 + Vehicle + Equipment + Office/Storage
                 + Other Monthly Expenses

Overhead Per Job = Monthly Overhead ÷ Expected Jobs Per Month

Total Job Cost = Direct Costs + Overhead Per Job

Break-Even Price = Total Job Cost ÷ (1 - Payment Fee Rate)

Adjusted Cost Basis = Total Job Cost × Service Multiplier

Recommended Price = Adjusted Cost Basis
                  ÷ (1 - Desired Margin Rate - Payment Fee Rate)

Payment Fee Amount = Recommended Price × Payment Fee Rate

Estimated Profit = Recommended Price - Total Job Cost - Payment Fee Amount

Actual Profit Margin = Estimated Profit ÷ Recommended Price
```

The margin is calculated on the final selling price. For example, a 30% desired margin is **not** `cost × 1.30`; that would be a 30% markup and produces a lower margin. The denominator reserves the desired share of the final price for profit and the payment-fee share for processing.

The complexity multiplier is applied to the cost basis before solving for price. With a multiplier above `1.00`, the displayed actual margin can be higher than the desired base margin because the multiplier intentionally adds a complexity/risk buffer. The break-even price is not multiplied because it represents the minimum needed to recover actual entered costs and payment fees.

To change formulas, edit `calculatePricing()` and keep the DOM rendering functions unchanged. The engine is also exposed as `window.PricingEngine` for browser-based tests and future variants.

## Commercial package rounding

`commercialRound()` always rounds package suggestions up to a whole dollar. At prices of $100 or more, it uses a nearby ending in 9 only when that ending is no more than $3 higher. For example, `$187.31` becomes `$189`, while a price just above `$189` becomes the next whole dollar instead of jumping to `$199`.

## Localization

- English is the default language; English and Spanish are included in the central `TRANSLATIONS` object in `script.js`.
- Important visible elements use `data-i18n`, `data-i18n-placeholder`, or `data-i18n-aria-label` keys instead of duplicated page markup.
- Service labels, validation errors, result context, success messages, page metadata, placeholders, and accessibility labels use the same translation system.
- The selected language is stored under `cleaningProfitCalculator:v1:language` and applied before the first calculation when the page opens.
- The document's `lang`, page title, and meta description update with the selected language.

Language and currency are deliberately independent. Switching to Spanish does not change the formulas, square-foot unit, or USD formatting. `APP_CONFIG.locale` remains `en-US` and `APP_CONFIG.currency` remains `USD` until a separate currency feature is introduced.

To add Portuguese, French, German, or another language:

1. Copy one language object inside `TRANSLATIONS` and translate every key.
2. Add the language code to `APP_CONFIG.supportedLanguages`.
3. Add a matching `data-language` button to the header selector.

The translation-key consistency check can compare the new object with `TRANSLATIONS.en`. The pricing engine itself contains no market-facing language and does not need to change.

## Future backend connections

The current application deliberately stays browser-only. These parts can later connect to a backend without replacing the pricing engine:

- `leadStorageAdapter.save()` can be replaced with a `fetch()` call to an email/form API.
- Calculator state can move from `localStorage` to authenticated saved jobs.
- Pricing results can feed a quote and printable-estimate service.
- Client, recurring-job, and dashboard data can use a database and user accounts.
- Custom rules can be loaded as business-specific configuration.

No current email submission is transmitted anywhere. It is saved on the user's device under the `cleaningProfitCalculator:v1:earlyAccessEmails` local-storage key.

**Before public launch:** connect `leadStorageAdapter.save()` to a real form service or backend if submitted emails are expected to reach the business. The source contains an explicit pre-launch note next to this adapter.

## Reusing the pricing engine for other businesses

The application separates:

1. **Configuration** — business name, service types, multipliers, defaults, locale, and storage keys.
2. **Pricing engine** — the pure cost, fee, margin, and price formulas.
3. **Presentation** — form reading, validation messages, formatted results, and UI updates.
4. **Persistence adapters** — calculator, goal, and lead storage.

To create a future calculator for detailing, landscaping, photography, baking, nails, pressure washing, or handyman work, keep the pricing engine and replace the business-specific configuration, field labels, and any relevant cost inputs. If the new business uses the same cost model, the formula layer does not need to change.
