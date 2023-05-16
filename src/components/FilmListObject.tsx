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
                <Typography variant="h4">
                    {film.title}
                    <div>
                        <Link to={"/films/" + film.filmId}>Go to film</Link>
                    </div>
                </Typography>
            </CardContent>
        </Card>
    )
}
export default FilmListObject