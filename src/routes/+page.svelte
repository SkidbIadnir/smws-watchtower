<script lang="ts">
	import { onMount } from 'svelte';
	import {
		fetchWhiskies,
		formatPrice,
		getProfileColor,
		sortWhiskies,
		type Whiskey,
		ApiError
	} from '$lib/api';

	let whiskies: Whiskey[] = [];
	let loading = true;
	let error: string | null = null;
	let searchTerm = '';
	let selectedRegion = '';
	let selectedProfile = '';
	let sortBy = 'newest';

	// Reactive filtered and sorted whiskies
	$: filteredWhiskies = whiskies.filter((whiskey) => {
		const matchesSearch =
			whiskey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			whiskey.distillery.toLowerCase().includes(searchTerm.toLowerCase()) ||
			whiskey.fullcode.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesRegion = selectedRegion === '' || whiskey.region === selectedRegion;
		const matchesProfile = selectedProfile === '' || whiskey.profile === selectedProfile;

		return matchesSearch && matchesRegion && matchesProfile;
	});

	$: sortedWhiskies = sortWhiskies(filteredWhiskies, sortBy);

	// Get unique regions and profiles for filters
	$: regions = [...new Set(whiskies.map((w) => w.region).filter(Boolean))].sort();
	$: profiles = [...new Set(whiskies.map((w) => w.profile).filter(Boolean))].sort();

	onMount(async () => {
		try {
			whiskies = await fetchWhiskies();
		} catch (err) {
			if (err instanceof ApiError) {
				error = err.message;
			} else {
				error = 'An unexpected error occurred';
			}
		} finally {
			loading = false;
		}
	});

	function clearFilters() {
		searchTerm = '';
		selectedRegion = '';
		selectedProfile = '';
		sortBy = 'newest';
	}
</script>

<svelte:head>
	<title>SMWS Watchtower - Whisky Collection</title>
	<meta
		name="description"
		content="Browse the Scotch Malt Whisky Society's current whisky collection"
	/>
</svelte:head>

<div class="container mx-auto p-4">
	<div class="text-center mb-8">
		<h1
			class="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent"
		>
			SMWS Watchtower
		</h1>
		<p class="text-xl text-base-content/80 max-w-2xl mx-auto">
			Discover exceptional single cask whiskies from the Scotch Malt Whisky Society's exclusive
			collection
		</p>
	</div>

	{#if loading}
		<div class="flex justify-center items-center min-h-64">
			<div class="text-center">
				<span class="loading loading-spinner loading-lg text-primary"></span>
				<p class="mt-4 text-lg">Loading whisky collection...</p>
			</div>
		</div>
	{:else if error}
		<div class="alert alert-error max-w-2xl mx-auto">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<div>
				<h3 class="font-bold">Connection Error</h3>
				<div class="text-sm">{error}</div>
			</div>
		</div>
	{:else}
		<!-- Filters and Controls -->
		<div class="card bg-base-100 shadow-xl mb-6">
			<div class="card-body">
				<div class="flex justify-between items-center mb-4">
					<h2 class="card-title">Search & Filter</h2>
					<button class="btn btn-outline btn-sm" on:click={clearFilters}> Clear All </button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div class="form-control">
						<label class="label" for="search">
							<span class="label-text">Search</span>
						</label>
						<input
							id="search"
							type="text"
							placeholder="Name, distillery, cask code..."
							class="input input-bordered w-full"
							bind:value={searchTerm}
						/>
					</div>

					<div class="form-control">
						<label class="label" for="region">
							<span class="label-text">Region</span>
						</label>
						<select id="region" class="select select-bordered w-full" bind:value={selectedRegion}>
							<option value="">All Regions</option>
							{#each regions as region}
								<option value={region}>{region}</option>
							{/each}
						</select>
					</div>

					<div class="form-control">
						<label class="label" for="profile">
							<span class="label-text">Profile</span>
						</label>
						<select id="profile" class="select select-bordered w-full" bind:value={selectedProfile}>
							<option value="">All Profiles</option>
							{#each profiles as profile}
								<option value={profile}>{profile}</option>
							{/each}
						</select>
					</div>

					<div class="form-control">
						<label class="label" for="sort">
							<span class="label-text">Sort By</span>
						</label>
						<select id="sort" class="select select-bordered w-full" bind:value={sortBy}>
							<option value="newest">Newest First</option>
							<option value="name">Name (A-Z)</option>
							<option value="price">Price (Low to High)</option>
							<option value="age">Age (Young to Old)</option>
							<option value="distillery">Distillery (A-Z)</option>
							<option value="region">Region (A-Z)</option>
						</select>
					</div>
				</div>
			</div>
		</div>

		<!-- Results Summary -->
		<div class="stats shadow mb-6 w-full">
			<div class="stat">
				<div class="stat-figure text-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-8 h-8 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				</div>
				<div class="stat-title">Total Collection</div>
				<div class="stat-value text-primary">{whiskies.length}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-8 h-8 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
						></path>
					</svg>
				</div>
				<div class="stat-title">Filtered Results</div>
				<div class="stat-value text-secondary">{filteredWhiskies.length}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-accent">
					<div class="badge badge-accent badge-lg">NEW</div>
				</div>
				<div class="stat-title">New Arrivals</div>
				<div class="stat-value text-accent">{whiskies.filter((w) => w.is_new).length}</div>
			</div>
		</div>

		<!-- Profile Legend -->
		<div class="card bg-base-100 shadow-xl mb-6">
			<div class="card-body">
				<h2 class="card-title mb-4">Flavor Profile Guide</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
					<div class="flex items-center gap-2">
						<div class="badge badge-young-spritely badge-sm">Young & Spritely</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-sweet-fruity badge-sm">Sweet Fruity & Mellow</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-spicy-sweet badge-sm">Spicy & Sweet</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-spicy-dry badge-sm">Spicy & Dry</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-deep-rich badge-sm">Deep Rich & Dried Fruits</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-old-dignified badge-sm">Old & Dignified</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-light-delicate badge-sm">Light & Delicate</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-juicy-oak badge-sm">Juicy Oak & Vanilla</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-oily-coastal badge-sm">Oily & Coastal</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-lightly-peated badge-sm">Lightly Peated</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-peated badge-sm">Peated</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="badge badge-heavily-peated badge-sm">Heavily Peated</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Whiskey Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each sortedWhiskies as whiskey (whiskey.id)}
				<div
					class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
				>
					<div class="card-body p-4">
						<div class="flex justify-between items-start mb-3">
							<h2 class="card-title text-base leading-tight line-clamp-2">{whiskey.name}</h2>
							{#if whiskey.is_new}
								<div class="badge badge-accent badge-sm">NEW</div>
							{/if}
						</div>

						<div class="space-y-3">
							<div class="flex justify-between items-center">
								<span class="font-semibold text-primary text-sm">{whiskey.fullcode}</span>
								<span class="font-bold text-lg text-accent">{formatPrice(whiskey.price)}</span>
							</div>

							<div class="grid grid-cols-2 gap-1 text-xs">
								<div class="truncate" title={whiskey.distillery}>
									<strong>Distillery:</strong>
									{whiskey.distillery}
								</div>
								<div title={whiskey.region}>
									<strong>Region:</strong>
									{whiskey.region}
								</div>
								<div>
									<strong>Age:</strong>
									{whiskey.age}
								</div>
								<div>
									<strong>ABV:</strong>
									{whiskey.abv || 'N/A'}
								</div>
							</div>

							<div class="divider my-2"></div>

							<div>
								<div class="badge {getProfileColor(whiskey.profile)} badge-sm mb-2 w-full">
									{whiskey.profile}
								</div>
								<p class="text-xs text-base-content/70 line-clamp-2" title={whiskey.cask_type}>
									{whiskey.cask_type}
								</p>
							</div>
						</div>

						<div class="card-actions justify-end mt-4">
							<a
								href={whiskey.url}
								target="_blank"
								rel="noopener noreferrer"
								class="btn btn-primary btn-sm w-full"
							>
								View Details
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if sortedWhiskies.length === 0}
			<div class="text-center py-16">
				<div class="text-8xl mb-6">🥃</div>
				<h3 class="text-3xl font-bold mb-4">No whiskies found</h3>
				<p class="text-lg text-base-content/70 mb-6">
					Try adjusting your search criteria or filters to discover more whiskies.
				</p>
				<button class="btn btn-primary" on:click={clearFilters}> Clear Filters </button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Custom profile badge styles */
	:global(.badge-young-spritely) {
		background-color: #d8b2d8;
		color: #2d1b2e;
		border: none;
	}

	:global(.badge-sweet-fruity) {
		background-color: #b084a3;
		color: #ffffff;
		border: none;
	}

	:global(.badge-spicy-sweet) {
		background-color: #b084a3;
		color: #ffffff;
		border: none;
	}

	:global(.badge-spicy-dry) {
		background-color: #e8a853;
		color: #2d1f0a;
		border: none;
	}

	:global(.badge-deep-rich) {
		background-color: #cc6b5a;
		color: #ffffff;
		border: none;
	}

	:global(.badge-old-dignified) {
		background-color: #a5374a;
		color: #ffffff;
		border: none;
	}

	:global(.badge-light-delicate) {
		background-color: #9bd3d1;
		color: #1a2e2d;
		border: none;
	}

	:global(.badge-juicy-oak) {
		background-color: #5b9bc4;
		color: #ffffff;
		border: none;
	}

	:global(.badge-oily-coastal) {
		background-color: #2e5f6b;
		color: #ffffff;
		border: none;
	}

	:global(.badge-lightly-peated) {
		background-color: #a8c99a;
		color: #1f2b1c;
		border: none;
	}

	:global(.badge-peated) {
		background-color: #7ba373;
		color: #ffffff;
		border: none;
	}

	:global(.badge-heavily-peated) {
		background-color: #5a7a52;
		color: #ffffff;
		border: none;
	}

	:global(.badge-no-profile) {
		background-color: #6b7280;
		color: #ffffff;
		border: none;
	}

	/* Hover effects for better interactivity */
	:global(.badge-young-spritely:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-sweet-fruity:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-spicy-sweet:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-spicy-dry:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-deep-rich:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-old-dignified:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-light-delicate:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-juicy-oak:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-oily-coastal:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-lightly-peated:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-peated:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-heavily-peated:hover) {
		filter: brightness(0.9);
	}
	:global(.badge-no-profile:hover) {
		filter: brightness(0.9);
	}
</style>
