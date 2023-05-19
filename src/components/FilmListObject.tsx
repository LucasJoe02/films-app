import React from "react";
import CSS from "csstype";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";

interface IFilmProps {
    film: Film
}
const FilmListObject = (props: IFilmProps) => {
    const [film] = React.useState < Film > (props.film)

    const filmCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "300px",
        margin: "10px",
        padding: "0px"
    }

    const formatDate = (dateString: string) => {
        const dateTime = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        return dateTime.toLocaleDateString(undefined, options);
    }

    //TODO Get genres from API to display
    const getGenre = (genreId: number) => {

        return "";
    }

    return (
        <Card sx={filmCardStyles}>
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
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    Director: {film.directorFirstName}, {film.directorLastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ⭐{film.rating} ⏺ {film.ageRating} ⏺ {formatDate(film.releaseDate)} ⏺ {getGenre(film.genreId)}

                </Typography>

                    <div>
                        <Link to={"/films/" + film.filmId}>Go to film</Link>
                    </div>
            </CardContent>
        </Card>
    )
}
export default FilmListObject