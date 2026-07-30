<script>
	import * as d3 from 'd3';
	import { fade } from 'svelte/transition';
	import outages from '$lib/data/outages.json';

	let { index = 0, count = 1 } = $props();

	// Turn the monthly/borough/development data into a common {label, value} shape
	// so the chart below only ever has to think about one format.
	const monthNames = {
		'01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
		'07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
	};
	const heatingMonths = new Set(['10', '11', '12', '01', '02', '03']);

	const monthlyBars = outages.monthly.map((d) => {
		const [year, month] = d.year_month.split('-');
		return {
			label: `${monthNames[month]} '${year.slice(2)}`,
			value: d.count,
			inHeatingSeason: heatingMonths.has(month)
		};
	});

	const boroughBars = [...outages.boroughs]
		.filter((d) => d.borough !== 'Unknown')
		.sort((a, b) => b.outages - a.outages)
		.map((d) => ({ label: d.borough, value: d.outages }));

	const developmentBars = [...outages.developments]
		.sort((a, b) => b.outages - a.outages)
		.map((d) => ({ label: d.development, value: d.outages }));

	const plannedBars = outages.plannedVsUnplanned.map((d) => ({
		label: d.type,
		value: d.outages
	}));

	// One entry per scroll step. Edit this array to change the story.
	const steps = [
		{ bars: monthlyBars, title: 'Outages per month', highlight: 'none' },
		{ bars: monthlyBars, title: 'Outages per month', highlight: 'heating-season' },
		{ bars: boroughBars, title: 'Outages by borough', highlight: 'none' },
		{ bars: developmentBars, title: 'The 10 hardest-hit developments', highlight: 'none' },
		{ bars: plannedBars, title: 'Planned vs. unplanned', highlight: 'unplanned' }
	];

	const step = $derived(steps[Math.min(index, steps.length - 1)]);
	const bars = $derived(step.bars);
	const highlight = $derived(step.highlight);

	const margin = { top: 30, right: 20, bottom: 70, left: 46 };
	let width = $state(700);
	let height = $state(460);

	// Cap how much horizontal room each bar gets, so a chart with only 2-5
	// categories doesn't stretch them across the full width with huge gaps.
	const MAX_SLOT_WIDTH = 70;
	const plotWidth = $derived(width - margin.left - margin.right);
	const slotWidth = $derived(Math.min(MAX_SLOT_WIDTH, plotWidth / bars.length));
	const usedWidth = $derived(slotWidth * bars.length);
	const plotStart = $derived(margin.left + (plotWidth - usedWidth) / 2);

	// scaleBand: one evenly-spaced slot per bar, like a category axis
	const xScale = $derived(
		d3
			.scaleBand()
			.domain(bars.map((d) => d.label))
			.range([plotStart, plotStart + usedWidth])
			.padding(0.25)
	);

	const yScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(bars, (d) => d.value)])
			.nice()
			.range([height - margin.bottom, margin.top])
	);

	// Cap the bar thickness so bars stay the same width whether there are
	// 2 categories or 16 — never wider than the band has room for.
	const MAX_BAR_WIDTH = 16;
	const barWidth = $derived(Math.min(MAX_BAR_WIDTH, xScale.bandwidth()));

	function barX(bar) {
		const slotCenter = (xScale(bar.label) ?? 0) + xScale.bandwidth() / 2;
		return slotCenter - barWidth / 2;
	}

	// Colors from the class palette: blue is the default series, orange marks
	// whichever bars the current step is calling out, muted gray fades the rest.
	const COLOR_DEFAULT = '#2a78d6';
	const COLOR_HIGHLIGHT = '#eb6834';
	const COLOR_MUTED = '#c3c2b7';

	function barColor(bar) {
		if (highlight === 'heating-season') return bar.inHeatingSeason ? COLOR_HIGHLIGHT : COLOR_MUTED;
		if (highlight === 'unplanned') return bar.label === 'Unplanned' ? COLOR_HIGHLIGHT : COLOR_MUTED;
		return COLOR_DEFAULT;
	}
</script>

<div class="background">
	<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
		<p class="chart-title">{step.title}</p>
		<svg viewBox="0 0 {width} {height}" preserveAspectRatio="none">
			<!-- y axis -->
			{#each yScale.ticks(5) as tick (tick)}
				<g class="tick" transform="translate(0,{yScale(tick)})">
					<line x1={margin.left} x2={width - margin.right} />
					<text x={margin.left - 8} text-anchor="end" dominant-baseline="middle">{tick}</text>
				</g>
			{/each}

			<!-- one bar per category -->
			{#each bars as bar (bar.label)}
				<rect
					x={barX(bar)}
					y={yScale(bar.value)}
					width={barWidth}
					height={height - margin.bottom - yScale(bar.value)}
					rx="3"
					fill={barColor(bar)}
					transition:fade={{ duration: 250 }}
				/>
				<text
					class="bar-label"
					x={(xScale(bar.label) ?? 0) + xScale.bandwidth() / 2}
					y={height - margin.bottom + 14}
					text-anchor="end"
					transform="rotate(-40 {(xScale(bar.label) ?? 0) + xScale.bandwidth() / 2} {height -
						margin.bottom +
						14})"
				>
					{bar.label}
				</text>
			{/each}
		</svg>
	</div>
</div>

<style>
	.background {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		font-family: system-ui, sans-serif;
		padding: 2rem;
		background: #fcfcfb;
	}

	.chart-title {
		margin: 0 0 0.5rem;
		font-weight: 600;
		color: #0b0b0b;
	}

	.chart {
		flex: 1;
		width: 100%;
		min-height: 0;
	}

	svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	rect {
		transition:
			x 0.5s ease,
			y 0.5s ease,
			height 0.5s ease,
			fill 0.4s ease;
	}

	.tick line {
		stroke: #e1e0d9;
	}

	.tick text,
	.bar-label {
		font-size: 11px;
		fill: #898781;
	}
</style>
