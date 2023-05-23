import { useParams, Link} from "react-router-dom";
import React from "react";
import axios from "axios";
import {Avatar, Button, Card, CardContent, Divider, Typography} from "@mui/material";
import CSS from "csstype";

const Film = () => {
    const {id} = useParams();
    const [genres, setGenres] = React.useState<Genre[]>([])
    const [film, setFilm] = React.useState<Film>({filmId:0, title:"", genreId: 0, directorId: 0, directorFirstName: "",
        directorLastName: "", releaseDate: "", ageRating: "", rating: 0, description: ""})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    React.useEffect(() => {
        const getFilm = () => {
            axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films/'+id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilm(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getFilm()
    }, [id])

    React.useEffect(() => {
        const fetchGenres = () => {
            axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films/genres')
                .then((response) => {
                    setGenres(response.data)
                }, (error) => {
                    console.error('Error fetching data:', error)
                })
        }
        fetchGenres()
    },[setGenres])

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

    const filmCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "auto",
        width: "500px",
        margin: "10px",
        padding: "0px",
        marginTop: "1rem"
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
            <Card sx={filmCardStyles}>
                <CardContent>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                        {film.title}
                    </Typography>
                    <img src={'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + film.filmId + '/image'}
                         alt={film.title} style={{ width: '300px', marginBottom: '1rem' }} />
                    <Typography variant="body1" component="p" align="center">
                        {film.description}
                    </Typography>
                    <Divider style={{ margin: '1rem 0' }} />
                    <Typography variant="h6" component="h3" gutterBottom>
                        Director
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0rem' }}>
                        <Avatar
                            src={'https://seng365.csse.canterbury.ac.nz/api/v1/users/' + film.directorId + '/image'}
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
                    <Divider style={{ margin: '1rem 0' }} />
                    <Typography variant="h6" component="h3" gutterBottom>
                        Film Details
                    </Typography>
                    <Typography variant="body2" component="p">
                        Release Date: {formatDate(film.releaseDate)}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Rating: ⭐{film.rating}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Age Rating: {film.ageRating}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Genre: {getGenre(film.genreId)}
                    </Typography>
                    <Divider style={{ margin: '1rem 0' }} />
                    <Button variant="contained" component={Link} to="/films">
                        Back to Films
                    </Button>
                </CardContent>
            </Card>
        )
    }
}

export default Film;