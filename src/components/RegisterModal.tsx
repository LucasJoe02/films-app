import React from "react";
import {
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Input,
    InputAdornment,
    Link,
    Modal,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import AuthStore from "../store/authStore";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
    const [profileImage, setProfileImage] = React.useState<File | null>(null);

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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setProfileImage(file);
        }
    };

    const setProfilePicture = (userId: string, token: string) => {
        if (profileImage) {
            const header = {
                headers: {
                    'X-Authorization': token,
                    'Content-Type': profileImage.type
                }
            }
            axios.put(`${apiUrl}/users/` + userId + '/image', profileImage, header)
                .then(() => {
                    setErrorMessage("")
                    setProfileImage(null)
                }, (error) => {
                    setErrorMessage(error.response.statusText)
                    setProfileImage(null)
                })
        }
    }

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
                setProfilePicture(response.data.userId, response.data.token)
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
                            <div>
                                <Input
                                    type="file"
                                    inputProps={{ accept: 'image/jpeg, image/png, image/gif' }}
                                    id="profileImage"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="profileImage">
                                    <Button component="span" startIcon={<CloudUploadIcon />}>
                                        Set Image
                                    </Button>
                                </label>
                            </div>
                            {profileImage && <Avatar src={URL.createObjectURL(profileImage)} alt="Selected"
                                                     sx={{ width: 100, height: 100}}/>}
                            <br/>
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