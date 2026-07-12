// term/definition text lives in the locale files (i18n/locales/*.json, glossary.terms.<id>)
// so it can be translated. `slug` stays fixed across languages since BudgetInput.jsx links
// to specific glossary entries via anchors like /glossary#term-<slug>.
const glossaryTerms = [
    { id: 1, slug: "etf", level: "Beginner", topic: "Stocks" },
    { id: 2, slug: "diversification", level: "Beginner", topic: "Risk" },
    { id: 3, slug: "compound-interest", level: "Beginner", topic: "Investing Basics" },
    { id: 4, slug: "volatility", level: "Intermediate", topic: "Risk" },
    { id: 5, slug: "index-fund", level: "Beginner", topic: "Stocks" },
    { id: 6, slug: "cds", level: "Beginner", topic: "Savings" },
    { id: 7, slug: "bonds", level: "Beginner", topic: "Bonds" },
    { id: 8, slug: "treasury-bills", level: "Beginner", topic: "Bonds" },
    { id: 9, slug: "dividend-stocks", level: "Intermediate", topic: "Stocks" },
    { id: 10, slug: "capital-gains", level: "Beginner", topic: "Stocks" },
    { id: 11, slug: "market-capitalization", level: "Intermediate", topic: "Stocks" },
    { id: 12, slug: "shares", level: "Beginner", topic: "Stocks" },
    { id: 13, slug: "portfolio", level: "Beginner", topic: "Stocks" },
    { id: 14, slug: "bull-market", level: "Beginner", topic: "Stocks" },
    { id: 15, slug: "bear-market", level: "Beginner", topic: "Stocks" },
    { id: 16, slug: "inflation", level: "Beginner", topic: "Risk" },
    { id: 17, slug: "market-crash", level: "Intermediate", topic: "Risk" },
    { id: 18, slug: "recession", level: "Intermediate", topic: "Risk" },
    { id: 19, slug: "passive-income", level: "Beginner", topic: "Savings" },
    { id: 20, slug: "high-yield-savings-account", level: "Beginner", topic: "Savings" },
    { id: 21, slug: "government-bonds", level: "Beginner", topic: "Bonds" },
    { id: 22, slug: "interest-rates", level: "Beginner", topic: "Bonds" },
    { id: 23, slug: "yield", level: "Intermediate", topic: "Bonds" },
    { id: 24, slug: "corporate-bonds", level: "Intermediate", topic: "Bonds" },
    { id: 25, slug: "dollar-cost-averaging", level: "Beginner", topic: "Investing Basics" },
    { id: 26, slug: "roth-ira", level: "Intermediate", topic: "Investing Basics" },
    { id: 27, slug: "s-and-p-500", level: "Intermediate", topic: "Stocks" },
    { id: 28, slug: "expense-ratio", level: "Intermediate", topic: "Investing Basics" },
    { id: 29, slug: "index-investing", level: "Intermediate", topic: "Investing Basics" },
    { id: 30, slug: "short-selling", level: "Advanced", topic: "Advanced Strategies" },
    { id: 31, slug: "options", level: "Advanced", topic: "Advanced Strategies" },
    { id: 32, slug: "reits", level: "Intermediate", topic: "Funds" },
];

export default glossaryTerms;
