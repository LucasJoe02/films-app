import {
    Avatar,
    Box,
    Button,
    Container,
    FormControlLabel,
    Input,
    Modal,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import axios from "axios";
import AuthStore from "../store/authStore";
import User from "./User";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface EditUserModalProps {
    user: User,
    setUser: (user: User) => void,
    handleAvatarReload: () => void
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, setUser, handleAvatarReload }) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const [open, setOpen] = React.useState(false)
    const [firstName, setFirstName] = React.useState(user.firstName)
    const [lastName, setLastName] = React.useState(user.lastName)
    const [email, setEmail] = React.useState(user.email)
    const userId = AuthStore((state) => state.userId)
    const token = AuthStore((state) => state.userToken)
    const [deleteProfileImage, setDeleteProfileImage] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState<File | null>(null);
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleOpen = () => {
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setEmail(user.email)
        setOpen(true)
        setDeleteProfileImage(false)
        setErrorMessage("")
    }

    const handleClose = () => {
        setProfileImage(null)
        handleAvatarReload()
        setOpen(false)
    }

    const handleDeleteProfileImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeleteProfileImage(event.target.checked)
        setProfileImage(null)
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setProfileImage(file);
        }
    };

    const changeProfilePicture = () => {
        if (deleteProfileImage) {
            const header = {
                headers: {
                    'X-Authorization': token
                }
            }
            axios.delete(`${apiUrl}/users/` + userId + '/image', header)
                .then(() => {
                    setErrorMessage("")
                    editUser()
                }, (error) => {
                    setErrorMessage(error.response.statusText)
                })
        } else if (profileImage) {
            const header = {
                headers: {
                    'X-Authorization': token,
                    'Content-Type': profileImage.type
                }
            }
            axios.put(`${apiUrl}/users/` + userId + '/image', profileImage, header)
                .then(() => {
                    setErrorMessage("")
                    editUser()
                }, (error) => {
                    setErrorMessage(error.response.statusText)
                })
        } else {
            editUser()
        }

    }

    const editUser = () => {
        const body = {
            firstName: firstName,
            lastName: lastName,
            email: email
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
                setUser({
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                })
                handleClose()
            }, (error) => {
                setErrorMessage(error.response.statusText)
            })
    }

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault()
        changeProfilePicture()
    }

    return (
        <div>
            <Button variant="contained" onClick={handleOpen} sx={{margin: "0.5rem"}}>
                Edit Profile
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Container maxWidth="sm" sx={{ mt: 4, p: 4, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Edit Profile
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleEdit}>
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
                            <div>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={deleteProfileImage}
                                            onChange={handleDeleteProfileImage}
                                            color="primary"
                                        />
                                    }
                                    label="Delete Profile Image"
                                />
                                {!deleteProfileImage && (
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
                                                Change Image
                                            </Button>
                                        </label>
                                    </div>

                                )}
                                {profileImage && <Avatar src={URL.createObjectURL(profileImage)} alt="Selected"
                                                         sx={{ width: 100, height: 100}}/>}
                            </div>
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

export default EditUserModal;