// Carrega filmes e locações a partir do arquivo JSON de dados
import data from './data/conteudo.json';

const initialMovies = data.movies || [];
export const INITIAL_RENTALS = data.initialRentals || [];
export const USERS = data.users || [];

export function getMovies() {
	try {
		const overrides = JSON.parse(localStorage.getItem('locadora_movies') || '[]');
		const removed = JSON.parse(localStorage.getItem('locadora_removed') || '[]');

		const initialIds = new Set(initialMovies.map(m => m.id));

		// base = filmes iniciais sem os ids removidos
		let base = initialMovies.filter(m => !removed.includes(m.id));

		// aplica substituições (overrides) para filmes iniciais
		const overrideMap = new Map((overrides || []).map(o => [o.id, o]));
		base = base.map(m => (overrideMap.has(m.id) ? overrideMap.get(m.id) : m));

		// filmes adicionados são overrides que não existiam entre os iniciais
		const added = (overrides || []).filter(o => !initialIds.has(o.id));

		return [...base, ...added];
	} catch (e) {
		return [...initialMovies];
	}
}

export function addMovie(movie) {
	try {
		const stored = JSON.parse(localStorage.getItem('locadora_movies') || '[]');
		const removed = JSON.parse(localStorage.getItem('locadora_removed') || '[]');

		// calcular o próximo id numérico considerando todos os filmes conhecidos (iniciais + overrides)
		const all = [...initialMovies.filter(m => !removed.includes(m.id)), ...(stored || [])];
		let maxId = 0;
		all.forEach(m => {
			const n = Number(m.id);
			if (!Number.isNaN(n) && n > maxId) maxId = n;
		});
		const nextId = maxId + 1;
		const movieWithId = { ...movie, id: String(nextId) };
		stored.push(movieWithId);
		localStorage.setItem('locadora_movies', JSON.stringify(stored));
		if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
			window.dispatchEvent(new Event('movies:updated'));
		}
		return movieWithId;
	} catch (e) {
		return null;
	}
}

export function updateMovie(movie) {
	try {
		const stored = JSON.parse(localStorage.getItem('locadora_movies') || '[]');
		const idx = (stored || []).findIndex(m => String(m.id) === String(movie.id));
		if (idx >= 0) {
			stored[idx] = movie;
		} else {
			// adiciona como override (edição de filme inicial ou novo)
			stored.push(movie);
		}
		localStorage.setItem('locadora_movies', JSON.stringify(stored));
		if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
			window.dispatchEvent(new Event('movies:updated'));
		}
		return movie;
	} catch (e) {
		return null;
	}
}

export function deleteMovie(id) {
	try {
		const stored = JSON.parse(localStorage.getItem('locadora_movies') || '[]');
		const removed = JSON.parse(localStorage.getItem('locadora_removed') || '[]');

		const initialIds = new Set(initialMovies.map(m => m.id));

		// se presente nas substituições armazenadas, remove daí e retorna o objeto excluído
		const idx = (stored || []).findIndex(m => String(m.id) === String(id));
		if (idx >= 0) {
			const deleted = stored.splice(idx, 1)[0];
			localStorage.setItem('locadora_movies', JSON.stringify(stored));
			if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
				window.dispatchEvent(new Event('movies:updated'));
			}
			return deleted;
		}

		// se for um filme inicial, marca como removido e retorna o filme original
		if (initialIds.has(String(id))) {
			const original = initialMovies.find(m => String(m.id) === String(id));
			if (!removed.includes(String(id))) {
				removed.push(String(id));
				localStorage.setItem('locadora_removed', JSON.stringify(removed));
				if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
					window.dispatchEvent(new Event('movies:updated'));
				}
			}
			return original || { id: String(id) };
		}

		return null;
	} catch (e) {
		return null;
	}
}

export function restoreMovie(movie) {
	try {
		if (!movie || !movie.id) return false;
		const stored = JSON.parse(localStorage.getItem('locadora_movies') || '[]');
		const removed = JSON.parse(localStorage.getItem('locadora_removed') || '[]');

		// se o movie.id estava em removed (filmes iniciais), remove-o de lá
		const remIdx = (removed || []).findIndex(r => String(r) === String(movie.id));
		if (remIdx >= 0) {
			removed.splice(remIdx, 1);
			localStorage.setItem('locadora_removed', JSON.stringify(removed));
			if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
				window.dispatchEvent(new Event('movies:updated'));
			}
			return true;
		}

		// caso contrário, re-adiciona aos overrides armazenados se não estiver presente
		const idx = (stored || []).findIndex(m => String(m.id) === String(movie.id));
		if (idx === -1) {
			stored.push(movie);
			localStorage.setItem('locadora_movies', JSON.stringify(stored));
			if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
				window.dispatchEvent(new Event('movies:updated'));
			}
		}
		return true;
	} catch (e) {
		return false;
	}
}

export default getMovies;
