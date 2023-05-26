import {Alert, AlertTitle, Avatar, Box, CardContent, Divider, List, Paper, Typography} from "@mui/material";
import React from "react";
import CSS from "csstype";
import axios from "axios";
import AuthStore from "../store/authStore";
import EditUserModal from "./EditUserModal";
import ChangePasswordModal from "./ChangePasswordModal";
import FilmListObject from "./FilmListObject";
import {useNavigate} from "react-router-dom";

const User = () => {
    const navigate = useNavigate()
    const apiUrl = process.env.REACT_APP_API_URL
    const userId = AuthStore((state) => state.userId);
    const token = AuthStore((state) => state.userToken);
    const [user, setUser] = React.useState<User>({firstName: "", lastName: "", email: ""})
    const [films, setFilms] = React.useState<Film[]>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [avatarReloadKey, setAvatarReloadKey] = React.useState(0);

    React.useEffect(() => {
        const fetchData = () => {
            axios.all([
                axios.get(`${apiUrl}/films?reviewerId=${userId}`),
                axios.get(`${apiUrl}/films?directorId=${userId}`)
            ])
            .then(
                axios.spread((filmsReviewedResponse, filmsDirectedResponse) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilms([...filmsReviewedResponse.data.films, ...filmsDirectedResponse.data.films])
                }), (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })
        }
        fetchData()
    }, [apiUrl, setFilms])

    React.useEffect(() => {

        const header = {
            headers: {
                'X-Authorization': token
            }
        }
        const fetchUser = () => {
            axios.get(`${apiUrl}/users/` + userId, header)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setUser(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })
        }
        fetchUser()
    },[apiUrl, token, userId, setUser])

    const handleAvatarReload = () => {
        setAvatarReloadKey((prevKey) => prevKey + 1);
    };

    const renderFilmRows = () => {
        if (films.length > 0) {
            return films.map((film: Film) => <FilmListObject onCardClick={handleCardClick} key={ film.filmId + film.title} film={film}/>)
        } else {
            return <h3 style={{color: "red"}}>Review or direct a film to show your films.</h3>
        }
    }

    const handleCardClick = (filmId: string ) => {
        navigate('/films/' + filmId)
    }

    const userPaperStyle: CSS.Properties = {
        display: "inline-block",
        height: "auto",
        width: "500px",
        margin: "10px",
        padding: "0px",
        marginTop: "1rem",
        overflow: 'auto'
    }
    return (
        <Paper sx={userPaperStyle}>
                {errorFlag ? (
                    <Alert severity = "error">
                        <AlertTitle> Error </AlertTitle>
                        { errorMessage }
                    </Alert>
                ) : (
                    <CardContent>
                        <Box sx={{display: "flex", justifyContent: "center",
                            alignItems: "center"}}>
                            <Avatar
                                key={avatarReloadKey}
                                src={`${apiUrl}/users/` + userId + '/image'}
                                alt={user.firstName}
                                sx={{ width: 100, height: 100}}
                            />
                        </Box>
                        <Typography variant="h3" component="h2" align="center" gutterBottom>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="h6" component="h2" align="center" gutterBottom>
                            Email: {user.email}
                        </Typography>
                        <EditUserModal user={user} setUser={setUser} handleAvatarReload={handleAvatarReload}/>
                        <ChangePasswordModal/>
                        <Divider style={{ margin: '0.5rem 0' }} />
                        <Typography variant="h6" component="h3" gutterBottom>
                            Films Directed or Reviewed
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
                )}
        </Paper>
    )
}

export default User;