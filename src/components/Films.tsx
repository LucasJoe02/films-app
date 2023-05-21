import axios from "axios";
import React, {ChangeEvent, useState} from "react";
import CSS from 'csstype';
import {Paper, AlertTitle, Alert, Pagination, TextField, Grid} from "@mui/material";
import FilmListObject from "./FilmListObject"
import Film from "./Film";
import {useFilmStore} from "../store";
import FilmOrderDropdown from "./FilmOrderDropdown";

const Films = () => {
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [orderTerm, setOrderTerm] = useState('')
    React.useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films')
                const filmsData = response.data.films;

                const updatedFilms = await Promise.all(filmsData.map(async (film: Film) => {
                    const filmResponse = await axios.get(`https://seng365.csse.canterbury.ac.nz/api/v1/films/${film.filmId}`)
                    const filmData = filmResponse.data
                    return { ...film, description: filmData.description}
                }))
                setFilms(updatedFilms)
            } catch (error: any) {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            }
        })()
    },[setFilms])

    const filteredFilms = films.filter((film) =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
    const totalPages = Math.ceil(filteredFilms.length / cardsPerPage)
    const startIndex = (currentPage - 1) * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const renderFilmRows = () => {
        if (orderedFilms.length > 0) {
            return orderedFilms.slice(startIndex, endIndex).map((film: Film) => <FilmListObject key={ film.filmId + film.title} film={film}/>)
        } else {
            return <h3 style={{color: "red"}}>No films match search</h3>
        }

    }
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page)
    }

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleDropdownChange = (selectedValue: string) => {
        setOrderTerm(selectedValue);
    };

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
    }
    return (
        <Paper elevation={3} style={card} >
            <h1>Film List</h1>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={false} sm={1} />
                <Grid item xs={12} sm={1.5}>
                    <TextField
                        label="Search Films"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                </Grid>
                <Grid item xs={false} sm={1}>
                    <FilmOrderDropdown onChange={handleDropdownChange}/>
                </Grid>
            </Grid>
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