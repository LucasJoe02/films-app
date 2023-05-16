import React from "react";
interface IFilmProps {
    film: Film
}
const FilmListObject = (props: IFilmProps) => {
    const [film] = React.useState < Film > (props.film)
    return (
        <h3>{film.title}</h3>
    )
}
export default FilmListObject