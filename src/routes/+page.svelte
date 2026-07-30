<script>
	import Scroller from '$lib/components/Scroller.svelte';
	import OutageChart from '$lib/components/OutageChart.svelte';

	let index = $state(0);
	let count = $state(0);
</script>

<main class="page">
	<header class="intro">
		<h1>When the Heat Goes Out</h1>
		<p class="dek">
			Since October 2024, New York City public housing has logged 6,395 heat and hot-water
			outages — an average of 8.6 hours before each one was fixed. Scroll to see where, when, and
			how often the heat has gone out.
		</p>
		<p class="source">
			Data: NYCHA outage reports, Oct. 2024–Jan. 2026, scraped and aggregated from
			<a href="https://my.nycha.info/Outages/Outages.aspx" target="_blank" rel="noreferrer"
				>NYCHA's public outage tracker</a
			>.
		</p>
	</header>

	<section class="scroller-section">
		<Scroller top={0} bottom={1} bind:index bind:count>
			{#snippet background()}
				<OutageChart {index} {count} />
			{/snippet}

			{#snippet foreground()}
				<div class="step">
					<p>
						Outages aren't rare in NYCHA buildings — they're routine. Over 16 months, residents
						filed reports of heat or hot water going out more than 6,000 times.
					</p>
				</div>

				<div class="step">
					<p>
						They also aren't spread evenly across the year. Outages cluster in the six-month
						heating season, October through March. One month stands out: March 2025 alone saw
						1,202 outages — more than double any other month in the data.
					</p>
				</div>

				<div class="step">
					<p>
						Some boroughs bear the brunt more than others. Manhattan's NYCHA developments logged
						the most outages of any borough, with Brooklyn and the Bronx close behind. Staten
						Island and Queens, which have far fewer public housing developments, saw a small
						fraction of that total.
					</p>
				</div>

				<div class="step">
					<p>
						Zoom in further and a handful of individual developments stand out as repeat
						offenders. Throggs Neck, East River, and Pomonok each logged over 100 heat or
						hot-water outages on their own — in the same 16-month window.
					</p>
				</div>

				<div class="step">
					<p>
						Perhaps most striking: nearly 3 in 5 outages — 60.8% — were <em>unplanned</em>. That
						means most of the time, residents got no advance warning before losing heat or hot
						water.
					</p>
				</div>
			{/snippet}
		</Scroller>
	</section>

	<footer class="outro">
		<p>
			Built with Svelte and D3 for a data journalism course scrollytelling assignment. The
			underlying scraper and full dataset live in a companion repo.
		</p>
	</footer>
</main>

<style>
	.page {
		font-family: system-ui, sans-serif;
		color: #111;
	}

	.intro,
	.outro {
		max-width: 40rem;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: 2rem;
	}

	.dek {
		font-size: 1.1rem;
		line-height: 1.6;
		color: #333;
		margin: 0 0 1rem;
	}

	.source {
		font-size: 0.85rem;
		color: #666;
	}

	.source a {
		color: #457b9d;
	}

	.scroller-section {
		max-width: none;
	}

	.step {
		height: 100vh;
		display: flex;
		align-items: center;
	}

	.step p {
		max-width: 26rem;
		margin: 0 2rem;
		padding: 1.5rem;
		border-radius: 0.5rem;
		background: white;
		box-shadow: 0 4px 20px rgb(0 0 0 / 0.12);
		font-size: 1.05rem;
		line-height: 1.6;
	}

	.outro {
		font-size: 0.9rem;
		color: #666;
	}
</style>
