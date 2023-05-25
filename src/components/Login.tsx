import CSS from "csstype";
import {Button, CardContent, Paper, TextField, Typography} from "@mui/material";
import React from "react";
import axios from "axios";
import AuthStore from "../store/authStore";
import RegisterModal from "./RegisterModal";

const Login = () => {
    const apiUrl = process.env.REACT_APP_API_URL
    const setToken = AuthStore((state) => state.setUserToken)
    const setUserId = AuthStore((state) => state.setUserId)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        const requestBody = {
            email: email,
            password: password,
        }
        axios.post(`${apiUrl}/users/login`, requestBody)
            .then((response) => {
                setErrorMessage("")
                setUserId(response.data.userId)
                setToken(response.data.token)
            }).catch((error) => {
            setErrorMessage(error.response.statusText)
        })
        setEmail('');
        setPassword('');
    };

    const filmPaperStyle: CSS.Properties = {
        display: "inline-block",
        height: "auto",
        width: "500px",
        margin: "10px",
        padding: "0px",
        marginTop: "1rem",
        overflow: 'auto'
    }
    return (
        <Paper sx={filmPaperStyle}>
            <CardContent>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        sx={{ marginTop: '1rem' }}
                    >
                        Login
                    </Button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <Typography variant="body2" align="center" sx={{ marginTop: '1rem' }}>
                    Don't have an account?{' '}
                    <RegisterModal/>
                </Typography>
            </CardContent>
        </Paper>
    )
}

export default Login;