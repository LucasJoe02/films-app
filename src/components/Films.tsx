import axios from 'axios'
import React from "react";
import {Link} from "react-router-dom";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import CSS from 'csstype'

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

interface HeadCell {
    id: string,
    label: string,
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    { id: 'ID', label: 'Id', numeric: true },
    { id: 'title', label: 'Title', numeric: false},
    { id: 'link', label: 'Link', numeric: false}
]


const Films = () => {

    const [films, setFilms] = React.useState < Array < Film >> ([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    React.useEffect(() => {
        getFilms()
    }, [])

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

    const list_of_films = () => {
        return films.map((item: Film) =>
            <TableRow hover
                tabIndex={-1}
                key={item.filmId}>
                <TableCell>
                    {item.filmId}
                </TableCell>
                <TableCell align="right">{item.title}</TableCell>
                <TableCell align="right"><Link
                    to={"/films/" + item.filmId}>Go to film</Link></TableCell>
            </TableRow>
        )
    }

    if (errorFlag) {
        return (
            <div>
                <h1>Films</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <Paper elevation={3} style={card}>
                <h1>Films</h1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' :
                                            'left'}
                                        padding={'normal'}>
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list_of_films()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }

}

export default Films;