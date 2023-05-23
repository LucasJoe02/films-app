import React, {ReactNode} from "react";
import axios from "axios";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

const FilmGenreFilter = ({ selectedGenres, handleGenreChange}: {
    selectedGenres: number[];
    handleGenreChange: (event: SelectChangeEvent<number[]>, child: ReactNode) => void;
    }) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const [genreList, setGenres] = React.useState<Genre[]>([])

    React.useEffect(() => {
        const fetchGenres = () => {
            axios.get(`${apiUrl}/films/genres`)
                .then((response) => {
                    setGenres(response.data)
                }, (error) => {
                    console.error('Error fetching data:', error)
                })
        }
        fetchGenres()
    },[apiUrl, setGenres])

    return (
        <FormControl style={{minWidth: '230px', marginTop: '1rem'}}>
            <InputLabel>Genre Filter</InputLabel>
            <Select
                style={{marginTop: '0.5rem'}}
                multiple
                value={selectedGenres}
                onChange={handleGenreChange}
                renderValue={(selected) => {
                    const selectedGenresNames = selected.map(id => {
                        const genre = genreList.find(genre => genre.genreId === id);
                        return genre ? genre.name : '';
                    });
                    return selectedGenresNames.join(', ');
                }}
                >
                {genreList.map((genre) => (
                    <MenuItem key={genre.genreId} value={genre.genreId}>
                        {genre.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default FilmGenreFilter;