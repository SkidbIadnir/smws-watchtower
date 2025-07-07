export interface Whiskey {
	id: number;
	name: string;
	fullcode: string;
	distillery_code: string;
	cask_no: string;
	price: string;
	profile: string;
	abv: string | null;
	age: string;
	cask_type: string;
	distillery: string;
	region: string;
	available: string;
	url: string;
	is_new: boolean;
	created_at: string;
	updated_at: string;
}

export class ApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export async function fetchWhiskies(): Promise<Whiskey[]> {
	try {
		const response = await fetch('https://api.skidhub.fr/scraping/smws/get-all');

		if (!response.ok) {
			throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
		}

		const data = await response.json();

		if (!Array.isArray(data)) {
			throw new ApiError('Invalid response format: expected array');
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof TypeError && error.message.includes('fetch')) {
			throw new ApiError(
				'Network error: Unable to connect to the API. Make sure the server is running on localhost:3000'
			);
		}

		throw new ApiError(error instanceof Error ? error.message : 'An unknown error occurred');
	}
}

export function formatPrice(price: string): string {
	return price.replace('€', '€ ');
}

export function getProfileColor(profile: string): string {
	// Normalize the profile string by trimming and handling variations
	const normalizedProfile = profile.trim();

	const colors: Record<string, string> = {
		'Young & Spritely': 'badge-young-spritely',
		'Sweet Fruity & Mellow': 'badge-sweet-fruity',
		'Sweet, Fruity & Mellow': 'badge-sweet-fruity', // Handle comma variation
		'Spicy & Sweet': 'badge-spicy-sweet',
		'Spicy & Dry': 'badge-spicy-dry',
		'Deep Rich & Dried Fruits': 'badge-deep-rich',
		'Deep, Rich & Dried Fruits': 'badge-deep-rich', // Handle comma variation
		'Old & Dignified': 'badge-old-dignified',
		'Light & Delicate': 'badge-light-delicate',
		'Juicy Oak & Vanilla': 'badge-juicy-oak',
		'Juicy, Oak & Vanilla': 'badge-juicy-oak', // Handle comma variation
		'Oily & Coastal': 'badge-oily-coastal',
		'Lightly Peated': 'badge-lightly-peated',
		Peated: 'badge-peated',
		'Heavily Peated': 'badge-heavily-peated'
	};

	return colors[normalizedProfile] || 'badge-no-profile';
}

export function sortWhiskies(whiskies: Whiskey[], sortBy: string): Whiskey[] {
	const sorted = [...whiskies];

	switch (sortBy) {
		case 'name':
			return sorted.sort((a, b) => a.name.localeCompare(b.name));
		case 'price':
			return sorted.sort((a, b) => {
				const priceA = parseFloat(a.price.replace(/[€,]/g, ''));
				const priceB = parseFloat(b.price.replace(/[€,]/g, ''));
				return priceA - priceB;
			});
		case 'age':
			return sorted.sort((a, b) => {
				const ageA = parseInt(a.age.split(' ')[0]);
				const ageB = parseInt(b.age.split(' ')[0]);
				return ageA - ageB;
			});
		case 'distillery':
			return sorted.sort((a, b) => a.distillery.localeCompare(b.distillery));
		case 'region':
			return sorted.sort((a, b) => a.region.localeCompare(b.region));
		case 'newest':
			return sorted.sort(
				(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
		default:
			return sorted;
	}
}
