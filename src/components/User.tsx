import {Alert, AlertTitle, Avatar, Box, CardContent, Paper, Typography} from "@mui/material";
import React from "react";
import CSS from "csstype";
import axios from "axios";
import AuthStore from "../store/authStore";
import EditUserModal from "./EditUserModal";
import ChangePasswordModal from "./ChangePasswordModal";

const User = () => {
    const apiUrl = process.env.REACT_APP_API_URL
    const userId = AuthStore((state) => state.userId);
    const token = AuthStore((state) => state.userToken);
    const [user, setUser] = React.useState<User>({firstName: "", lastName: "", email: ""})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [avatarReloadKey, setAvatarReloadKey] = React.useState(0);

    const handleAvatarReload = () => {
        setAvatarReloadKey((prevKey) => prevKey + 1);
    };

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
                    </CardContent>
                )}
        </Paper>
    )
}

export default User;