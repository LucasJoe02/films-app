import { useParams, Link, useNavigate} from "react-router-dom";
import React from "react";
import axios from "axios";
import {
    Alert,
    AlertTitle,
    Avatar,
    Button,
    CardContent,
    Divider,
    List,
    Paper,
    Typography,
} from "@mui/material";
import CSS from "csstype";
import ReviewsModal from "./ReviewsModal";
import FilmListObject from "./FilmListObject";

const Film = () => {
    const navigate = useNavigate()
    const apiUrl = process.env.REACT_APP_API_URL
    const { id: filmId } = useParams();
    const [genres, setGenres] = React.useState<Genre[]>([])
    const [film, setFilm] = React.useState<Film>({filmId:0, title:"", genreId: 0, directorId: 0, directorFirstName: "",
        directorLastName: "", releaseDate: "", ageRating: "", rating: 0, description: ""})
    const [films, setFilms] = React.useState<Film[]>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    React.useEffect(() => {
        const fetchData = () => {
            axios
                .all([
                    axios.get(`${apiUrl}/films/`+filmId),
                    axios.get(`${apiUrl}/films/genres`),
                    axios.get(`${apiUrl}/films`)
                ])
                .then(
                    axios.spread((filmResponse, genresResponse, filmsResponse) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilm(filmResponse.data)
                    setGenres(genresResponse.data)
                    setFilms(filmsResponse.data.films)
                }), (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        fetchData()
    }, [apiUrl, filmId, setFilm, setGenres, setFilms])

    const genreDictionary: { [key: number]: string} = {};
    genres.forEach(genre => {
        genreDictionary[genre.genreId] = genre.name;
    });

    const formatDate = (dateString: string) => {
        const dateTime = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        return dateTime.toLocaleDateString(undefined, options);
    }

    const getGenre = (genreId: number) => {
        return genreDictionary[genreId];
    }

    const filteredFilms = films.filter(filmListItem => {
        const hasMatchingGenre = film.genreId === filmListItem.genreId
        const hasMatchingDirector = film.directorId === filmListItem.directorId
        const notThisFilm = film.filmId !== filmListItem.filmId
        return (hasMatchingDirector || hasMatchingGenre) && notThisFilm
    })

    const renderFilmRows = () => {
        if (filteredFilms.length > 0) {
            return filteredFilms.map((film: Film) => <FilmListObject onCardClick={handleCardClick} key={ film.filmId + film.title} film={film}/>)
        } else {
            return <h3 style={{color: "red"}}>No similar films</h3>
        }
    }

    const handleCardClick = (filmId: string ) => {
        navigate('/films/' + filmId)
    }

    const filmPaperStyle: CSS.Properties = {
        display: "inline-block",
        height: "auto",
        width: "500px",
        margin: "10px",
        padding: "0px",
        marginTop: "1rem",
        overflow: 'auto'
    }
    if (errorFlag) {
        return (
            <div>
                <h1>Film</h1>
                <div style={{ color: "red"}}>
                    {errorMessage}
                </div>
                <Link to={"/films"}>Back to films</Link>
            </div>
        )
    } else {
        return (
            <Paper sx={filmPaperStyle}>
                <CardContent>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                        {film.title}
                    </Typography>
                    <img src={`${apiUrl}/films/` + film.filmId + '/image'}
                         alt={film.title} style={{ width: '300px', marginBottom: '1rem' }} />
                    <Typography variant="body1" component="p" align="center">
                        {film.description}
                    </Typography>
                    <Divider style={{ margin: '0.5rem 0' }} />
                    <Typography variant="h6" component="h3" gutterBottom>
                        Director
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0rem' }}>
                        <Avatar
                            src={`${apiUrl}/users/` + film.directorId + '/image'}
                            alt={film.directorFirstName}
                            sx={{ width: 40, height: 40, marginRight: '1rem'}}
                            onError={(event) => {
                                const imgElement = event.target as HTMLImageElement
                                imgElement.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
                            }}
                        />
                        <Typography variant="body2" component="p">
                            {film.directorFirstName}, {film.directorLastName}
                        </Typography>
                    </div>
                    <Divider style={{ margin: '0.5rem 0' }} />
                    <Typography variant="h6" component="h3" gutterBottom>
                        Film Details
                    </Typography>
                    <Typography variant="body2" component="p">
                        Release Date: {formatDate(film.releaseDate)}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Age Rating: {film.ageRating}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Genre: {getGenre(film.genreId)}
                    </Typography>
                    <Typography variant="body2" component="p" style={{marginTop: "0.5rem"}}>
                        Rating: ⭐{film.rating} <ReviewsModal filmId={filmId}></ReviewsModal>
                    </Typography>
                    <Divider style={{ margin: '0.5rem 0' }} />
                    <Button variant="contained" component={Link} to="/films">
                        Back to Films
                    </Button>
                    <Divider style={{ margin: '0.5rem 0' }} />
                    <Typography variant="h6" component="h3" gutterBottom>
                        Similar Films
                    </Typography>
                    <List
                        sx={{ display: "flex", flexWrap: 'noWrap', maxHeight: "460px", width: "100%",
                            overflowX: 'auto', scrollbarWidth: 'thin', scrollbarPlacement: 'top',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                marginRight: '10px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'lightskyblue',
                                borderRadius: '4px',
                            }}}>
                        {errorFlag?
                            <Alert severity = "error">
                                <AlertTitle> Error </AlertTitle>
                                { errorMessage }
                            </Alert>: ""}
                        { renderFilmRows() }
                    </List>
                </CardContent>
            </Paper>
        )
    }
}

export default Film;