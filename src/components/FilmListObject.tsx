import React from "react";
import CSS from "csstype";
import {Avatar, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import axios from "axios";

interface IFilmProps {
    film: Film
}



const FilmListObject = (props: IFilmProps) => {
    const [film] = React.useState < Film > (props.film)
    const [genres, setGenres] = React.useState<Genre[]>([])
    const navigate = useNavigate();

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

    const handleCardClick = () => {
        navigate('/films/' + film.filmId)
    }

    const filmCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "360px",
        width: "300px",
        margin: "10px",
        padding: "0px",
        cursor: 'pointer'
    }
    return (
        <Card sx={filmCardStyles}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={handleCardClick}
            >
            <CardMedia
                component="img"
                height="200"
                width="200"
                sx={{objectFit:"cover"}}
                image={'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + film.filmId + '/image'}
                alt={film.title + ' image'}
            />
            <CardContent>
                <Typography variant="h5">
                    {film.title}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0rem' }}>
                    <Avatar
                        src={'https://seng365.csse.canterbury.ac.nz/api/v1/users/' + film.directorId + '/image'}
                        alt="Profile Picture"
                        sx={{ width: 40, height: 40, marginRight: '1rem'}}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0 }}>
                        Director: {film.directorFirstName}, {film.directorLastName}
                    </Typography>
                </div>
                <Typography variant="body2" color="text.secondary">
                    ⭐{film.rating} ⏺ {formatDate(film.releaseDate)} ⏺ {film.ageRating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {getGenre(film.genreId)}
                </Typography>
            </CardContent>
        </Card>
    )
}
export default FilmListObject