import {Box, Button, Container, IconButton, InputAdornment, Modal, TextField, Typography} from "@mui/material";
import React from "react";
import AuthStore from "../store/authStore";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";

const ChangePasswordModal = () => {
    const apiUrl = process.env.REACT_APP_API_URL
    const [open, setOpen] = React.useState(false)
    const userId = AuthStore((state) => state.userId)
    const token = AuthStore((state) => state.userToken)
    const [currentPassword, setCurrentPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleOpen = () => {
        setOpen(true)
        setErrorMessage("")
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleTogglePassword = (showPassword: (show: (showPassword: any) => boolean) => void) => {
        showPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleChange = (e: React.FormEvent) => {
        e.preventDefault()
        const body = {
            password: newPassword,
            currentPassword: currentPassword
        }
        const header = {
            headers: {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        }
        axios.patch(`${apiUrl}/users/` + userId, body, header)
            .then(() => {
                setErrorMessage("")
                handleClose()
            }, (error) => {
                setErrorMessage(error.response.statusText)
            })
    }

    return (
        <div>
            <Button variant="contained" onClick={handleOpen} sx={{margin: "0.5rem"}}>
                Change Password
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Container maxWidth="sm" sx={{ mt: 4, p: 4, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Change Password
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleChange}>
                            <TextField
                                label="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type={showCurrentPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleTogglePassword(setShowCurrentPassword)}>
                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                type={showNewPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleTogglePassword(setShowNewPassword)}>
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            <Button variant="contained" type="submit" sx={{ mt: 2, marginRight: "1rem" }}>
                                Confirm
                            </Button>
                            <Button onClick={handleClose} sx={{ mt: 2, color: "red" }}>
                                Cancel
                            </Button>
                        </form>
                    </Box>
                </Container>
            </Modal>
        </div>
    )
}

export default ChangePasswordModal;