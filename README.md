# When the Heat Goes Out

A scrollytelling piece built with Svelte and D3, for a data journalism course assignment. As you scroll, a bar chart in the background updates to match the story — first showing outages by month, then highlighting the heating season, then breaking things down by borough, by development, and by whether the outage was planned or not.

**Data**: NYCHA heat and hot-water outage reports, October 2024–January 2026, scraped from [NYCHA's public outage tracker](https://my.nycha.info/Outages/Outages.aspx) and aggregated into `src/lib/data/outages.json`.

## Developing

```sh
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## How it works

- `src/lib/components/Scroller.svelte` is the class-provided scrollytelling component — it tracks which text step the reader has scrolled to and exposes that as `index`.
- `src/lib/components/OutageChart.svelte` is the chart. It has a `steps` array — one entry per scroll step — that says which data to plot and what to highlight. When `index` changes, the chart re-renders with the new step's data.
- `src/routes/+page.svelte` puts the two together: the chart as a fixed background, and the story text as steps that scroll over it.
