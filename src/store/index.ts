import create from 'zustand'

interface FilmState {
    films: Film[];
    setFilms: (film: Array<Film>) => void;
}
const useStore = create<FilmState>((set) => ({
    films: [],
    setFilms: (films: Array<Film>) => set(() => {
        return { films: films}
    })
}))
export const useFilmStore = useStore;