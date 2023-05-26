import React, {useState} from "react";
import AuthStore from "../store/authStore";
import {
    Avatar,
    Box,
    Button,
    Container,
    Input, InputLabel, MenuItem,
    Modal,
    Rating, Select,
    TextField,
    TextFieldProps,
    Typography
} from "@mui/material";
import {DatePicker} from "@mui/lab"
import {useNavigate} from "react-router-dom"
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

interface CreateFilmModalProps {
    handleFilmsReload: () => void
}

const CreateFilmModal: React.FC<CreateFilmModalProps> = ({ handleFilmsReload }) => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL
    const [open, setOpen] = useState(false);
    const token = AuthStore((state) => state.userToken)
    const userId = AuthStore((state) => state.userId)
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [genreId, setGenreId] = React.useState<number | undefined>(undefined)
    const [releaseDate, setReleaseDate] = React.useState("")
    const [ageRating, setAgeRating] = React.useState("")
    const [runtime, setRuntime] = React.useState<number | undefined>(undefined)
    const [filmImage, setFilmImage] = React.useState<File | null>(null)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [genreList, setGenres] = React.useState<Genre[]>([])
    const ageRatingList = ["G", "PG", "M", "R13", "R16", "R18", "TBC"]

    React.useEffect(() => {
        const fetchGenres = () => {
            axios.get(`${apiUrl}/films/genres`)
                .then((response) => {
                    setGenres(response.data)
                }, (error) => {
                    console.error('Error fetching data:', error)
                })
        }
        fetchGenres()
    },[apiUrl, setGenres])

    const handleOpen = () => {
        setErrorMessage("")
        setOpen(true)
    }

    const handleClose = () => {
        handleFilmsReload()
        setOpen(false)
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReleaseDate(event.target.value);
    };

    const handleGenreChange = (event: { target: { value: any; }; }) => {
        setGenreId(event.target.value);
    }

    const handleRuntimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value
        const parsedValue = parseInt(inputValue)
        if (isNaN(parsedValue)) {
            setRuntime(undefined)
        } else {
            setRuntime(parsedValue)
        }
    }

    const handleAgeRatingChange = (event: { target: { value: any; }; }) => {
        setAgeRating(event.target.value);
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setFilmImage(file);
        }
    }

    const formatDate = (inputDate: string): string => {
        const date = new Date(inputDate)
        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const formattedDate = `${year}-${month}-${day} 12:00:00`

        return formattedDate;
    }

    const setFilmPicture = (filmId: string) => {
        if (filmImage) {
            const header = {
                headers: {
                    'X-Authorization': token,
                    'Content-Type': filmImage.type
                }
            }
            axios.put(`${apiUrl}/films/` + filmId + '/image', filmImage, header)
                .then(() => {
                    setErrorMessage("")
                    setFilmImage(null)
                }, (error) => {
                    setErrorMessage(error.response.statusText)
                    setFilmImage(null)
                })
        }
    }

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(releaseDate)
        if (filmImage) {
            let filmData: { title: string; description: string; genreId: number | undefined; releaseDate?: string;
                ageRating?: string; runtime?: number | undefined } =
                {
                    title: title,
                    description: description,
                    genreId: genreId
                }
            if (releaseDate) {
                filmData.releaseDate = formatDate(releaseDate);
            }
            if (ageRating) {
                filmData.ageRating = ageRating;
            }
            if (runtime) {
                filmData.runtime = runtime;
            }
            const header = {
                headers: {
                    'X-Authorization': token
                }
            }
            axios.post(`${apiUrl}/films`, filmData, header)
                .then((response) => {
                    setErrorMessage("")
                    setFilmPicture(response.data.filmId)
                    setTitle("")
                    setDescription("")
                    setGenreId(undefined)
                    setReleaseDate("")
                    setAgeRating("")
                    setRuntime(undefined)
                    handleClose()
                }).catch((error) => {
                setErrorMessage(error.response.statusText)
            })
        } else {
            setErrorMessage("Image must be provided")
        }

    }

    return (
        <>
            {token &&
                <Button variant="contained" onClick={handleOpen} sx={{marginTop: "0.5rem"}}>
                    Create New Film
                </Button>
            }
            <Modal open={open} onClose={handleClose}>
                <Container maxWidth="sm" sx={{ mt: 4, p: 4, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Create New Film
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleCreate}>
                            <TextField
                                label="Title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                margin="dense"
                                variant="outlined"
                            />
                            <TextField
                                label="Description"
                                required
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                margin="dense"
                                variant="outlined"
                            />
                            <InputLabel>Genre*</InputLabel>
                            <Select
                                required
                                margin="dense"
                                fullWidth
                                value={genreId}
                                onChange={handleGenreChange}
                                renderValue={() => {
                                    const selectedGenre = genreList.find((genre) => genre.genreId === genreId);
                                    return selectedGenre ? selectedGenre.name : '';
                                }}>
                                {genreList.map((genre) => (
                                    <MenuItem key={genre.genreId} value={genre.genreId}>
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <TextField
                                label="Release Date (future)"
                                type="date"
                                margin="dense"
                                value={releaseDate}
                                onChange={handleDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <InputLabel>Age Rating</InputLabel>
                            <Select
                                required
                                margin="dense"
                                fullWidth
                                value={ageRating}
                                onChange={handleAgeRatingChange}
                                renderValue={(selected) => selected}>
                                {ageRatingList.map((ageRating) => (
                                    <MenuItem key={ageRating} value={ageRating}>
                                        {ageRating}
                                    </MenuItem>
                                ))}
                            </Select>
                            <TextField
                                label="Runtime (minutes)"
                                type="number"
                                value={runtime}
                                inputProps={{
                                    min: 1,
                                    step: 1,
                                }}
                                onChange={handleRuntimeChange}
                                margin="dense"
                                fullWidth
                            />
                            <div>
                                <Input
                                    type="file"
                                    required
                                    inputProps={{ accept: 'image/jpeg, image/png, image/gif' }}
                                    id="profileImage"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="profileImage">
                                    <Button component="span" startIcon={<CloudUploadIcon />}>
                                        Set Image*
                                    </Button>
                                </label>
                            </div>
                            {filmImage && <img src={URL.createObjectURL(filmImage)} alt="Selected"
                                                     style={{ width: 200, height: 200}}/>}
                            <br/>
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
        </>
    )
}

export default CreateFilmModal;