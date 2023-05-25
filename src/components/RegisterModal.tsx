import React from "react";
import {Box, Button, Container, IconButton, InputAdornment, Link, Modal, TextField, Typography} from "@mui/material";
import axios from "axios";
import AuthStore from "../store/authStore";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const RegisterModal = () => {
    const apiUrl = process.env.REACT_APP_API_URL
    const [open, setOpen] = React.useState(false)
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")
    const setUserId = AuthStore((state) => state.setUserId)
    const setToken = AuthStore((state) => state.setUserToken)

    const handleOpen = () => {
        setOpen(true)
        setErrorMessage("")
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const login = () => {
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
        handleClose()
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()

        const registerBody = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
        axios.post(`${apiUrl}/users/register`, registerBody)
            .then((response) => {
                setErrorMessage("")
                setUserId(response.data.userId)
                login()
            }).catch((error) => {
            setErrorMessage(error.response.statusText)
        })

        setPassword('');
    }

    return (
        <div>
            <Link onClick={handleOpen} sx={{cursor: 'pointer'}}>
                Sign up
            </Link>
            <Modal open={open} onClose={handleClose}>
                <Container maxWidth="sm" sx={{ mt: 4, p: 4, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Register
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleRegister}>
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type="email"
                            />
                            <TextField
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                                Register
                            </Button>
                        </form>
                    </Box>
                </Container>
            </Modal>
        </div>
    )

}

export default RegisterModal;