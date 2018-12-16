export namespace LocaleStorage {
    export function setItem(key: string, value: any): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	export function getItem<T = any>(key: string): T {
		return JSON.parse(localStorage.getItem(key)) as T;
	}

	export function removeItem(key: string): void {
		if (this.contains(key)) {
			localStorage.removeItem(key);
		}
	}

	export function contains(key: string): boolean {
		return !!localStorage.getItem(key);
	}

	export function clear(): void {
		localStorage.clear();
	}
}
