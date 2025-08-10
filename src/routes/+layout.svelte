<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-base-200">
	<div class="navbar bg-base-100 shadow-lg">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl"> 🥃 SMWS Watchtower </a>
		</div>
		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost">
					Theme
					<svg
						width="12px"
						height="12px"
						class="h-2 w-2 fill-current opacity-60 inline-block"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 2048 2048"
					>
						<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
					</svg>
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
					<li>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label="Default"
							value="default"
						/>
					</li>
					<li>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label="Dark"
							value="dark"
						/>
					</li>
					<li>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label="Light"
							value="light"
						/>
					</li>
					<li>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label="Cupcake"
							value="cupcake"
						/>
					</li>
					<li>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label="Corporate"
							value="corporate"
						/>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<main>
		{@render children()}
	</main>

	<footer class="footer footer-center p-10 bg-base-300 text-base-content">
		<div>
			<p>Built with ❤️ for whisky enthusiasts</p>
			<p class="text-sm opacity-70">Data from Scotch Malt Whisky Society</p>
		</div>
	</footer>
</div>
