import axios from "axios";
import React from "react";
import CSS from 'csstype';
import { Paper, AlertTitle, Alert } from "@mui/material";
import FilmListObject from "./FilmListObject"
import Film from "./Film";
import {useFilmStore} from "../store";

const FilmList = () => {
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    React.useEffect(() => {
        const getFilms = () => {
            axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilms(response.data.films)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getFilms()
    },[setFilms])

    const film_rows = () => films.map((film: Film) => <FilmListObject key={ film.filmId + film.title} film={film}/>)
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
    }
    return (
        <Paper elevation={3} style={card} >
            <h1>Film List</h1>
            <div style={{ display: "inline-block", maxWidth: "965px", minWidth: "320"}}>
                {errorFlag?
                    <Alert severity = "error">
                        <AlertTitle> Error </AlertTitle>
                        { errorMessage }
                    </Alert>: ""}
                { film_rows() }
            </div>
        </Paper>
    )
}

export default FilmList;