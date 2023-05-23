import axios from "axios";
import React, {ChangeEvent, useState} from "react";
import CSS from 'csstype';
import {Paper, AlertTitle, Alert, Pagination, TextField, Button} from "@mui/material";
import FilmListObject from "./FilmListObject"
import Film from "./Film";
import {useFilmStore} from "../store";
import FilmOrderDropdown from "./FilmOrderDropdown";
import FilmGenreFilter from "./FilmGenreFilter";
import FilmAgeRatingFilter from "./FilmAgeRatingFilter";
import {useNavigate} from "react-router-dom";

const Films = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [orderTerm, setOrderTerm] = useState('')
    const [selectedGenres, setSelectedGenres] = React.useState<number[]>([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = React.useState<string[]>([]);
    React.useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${apiUrl}/films`)
                const filmsData = response.data.films;

                const updatedFilms = await Promise.all(filmsData.map(async (film: Film) => {
                    const filmResponse = await axios.get(`${apiUrl}/films/${film.filmId}`)
                    const filmData = filmResponse.data
                    return { ...film, description: filmData.description}
                }))
                setFilms(updatedFilms)
                setErrorFlag(false)
                setErrorMessage("")
            } catch (error: any) {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            }
        })()
    },[apiUrl, setFilms])

    const searchedFilms = films.filter((film) =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredFilms = searchedFilms.filter(film => {
        const hasMatchingGenre = selectedGenres.length === 0 || selectedGenres.includes(film.genreId)
        const hasMatchingAgeRating = selectedAgeRatings.length === 0 || selectedAgeRatings.includes(film.ageRating)
        return hasMatchingAgeRating && hasMatchingGenre
    })

    const orderedFilms = [...filteredFilms].sort((a, b) => {
        if (orderTerm === 'title-asc') {
            return a.title.localeCompare(b.title);
        } else if (orderTerm === 'title-desc') {
            return b.title.localeCompare(a.title);
        } else if (orderTerm === 'rating-asc') {
            return a.rating - b.rating;
        } else if (orderTerm === 'rating-desc') {
            return b.rating - a.rating;
        } else if (orderTerm === 'releaseDate-asc') {
            return a.releaseDate.localeCompare(b.releaseDate);
        } else if (orderTerm === 'releaseDate-desc') {
            return b.releaseDate.localeCompare(a.releaseDate);
        }
        return 0;
    })

    const cardsPerPage = 10
    const totalPages = Math.ceil(orderedFilms.length / cardsPerPage)
    const startIndex = (currentPage - 1) * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const renderFilmRows = () => {
        if (orderedFilms.length > 0) {
            return orderedFilms.slice(startIndex, endIndex).map((film: Film) => <FilmListObject onCardClick={handleCardClick} key={ film.filmId + film.title} film={film}/>)
        } else {
            return <h3 style={{color: "red"}}>No films match search</h3>
        }
    }

    const handleCardClick = (filmId: string) => {
        navigate('/films/' + filmId);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page)
    }

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    const handleDropdownChange = (selectedValue: string) => {
        setOrderTerm(selectedValue);
    };

    const handleGenreChange = (event: { target: { value: any; }; }) => {
        const selectedGenreIds = event.target.value;
        setSelectedGenres(selectedGenreIds);
        setCurrentPage(1)
    }

    const handleAgeRatingChange = (event: { target: { value: any; }; }) => {
        const selectedAgeRatings = event.target.value;
        setSelectedAgeRatings(selectedAgeRatings);
        setCurrentPage(1)
    }

    const handleClearFilters = () => {
        setSelectedGenres([]);
        setSelectedAgeRatings([]);
    };

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
    }
    return (
        <Paper elevation={3} style={card} >
            <h1>Film List</h1>
            <div style={{ display: "flex", justifyContent: 'center', marginTop: '0rem' }}>
                    <TextField
                        label="Search Films"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                    <FilmOrderDropdown onChange={handleDropdownChange}/>
            </div>
            <div style={{ display: "inline-block", justifyContent: 'center', marginTop: '0rem' }}>
                <FilmGenreFilter
                    selectedGenres={selectedGenres}
                    handleGenreChange={handleGenreChange}/>
                <FilmAgeRatingFilter
                    selectedAgeRatings={selectedAgeRatings}
                    handleAgeRatingChange={handleAgeRatingChange}/>
                <Button variant="outlined" onClick={handleClearFilters} style={{ bottom: '0', minHeight: "3.5rem", marginTop: "1.5rem"}}>
                    Clear Filters
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0rem' }}>
                <Pagination
                    showFirstButton
                    showLastButton
                    count={totalPages}
                    page={currentPage}
                    color="primary"
                    onChange={handlePageChange}
                    style={{ marginTop: '1rem'}}
                />
            </div>
            <div style={{ display: "inline-block", maxWidth: "965px", minWidth: "320"}}>
                {errorFlag?
                    <Alert severity = "error">
                        <AlertTitle> Error </AlertTitle>
                        { errorMessage }
                    </Alert>: ""}
                { renderFilmRows() }
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0rem' }}>
                <Pagination
                    showFirstButton
                    showLastButton
                    count={totalPages}
                    page={currentPage}
                    color="primary"
                    onChange={handlePageChange}
                    style={{ marginTop: '1rem'}}
                />
            </div>
        </Paper>
    )
}

export default Films;