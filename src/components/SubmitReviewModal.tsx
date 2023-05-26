import AuthStore from "../store/authStore";
import {
    Box,
    Button,
    Container,
    Modal, Rating,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";


interface SubmitReviewModalProps {
    film: Film,
    handleReviewsReload: () => void
}

const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ film, handleReviewsReload }) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const [filmId, setFilmId] = React.useState(film.filmId)
    const [open, setOpen] = React.useState(false)
    const token = AuthStore((state) => state.userToken)
    const [rating, setRating] = React.useState(0)
    const [review, setReview] = React.useState("")
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleOpen = () => {
        setErrorMessage("")
        setRating(0)
        setReview("")
        setOpen(true)
        setFilmId(film.filmId)
    }

    const handleClose = () => {
        handleReviewsReload()
        setOpen(false)
    }

    const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
        if (newValue !== null) {
            setRating(newValue);
        }
    };

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault()
        let body: { review?: string; rating: number } = {
            rating: rating
        };

        if (review) {
            body = {
                ...body,
                review: review
            };
        }
        const header = {
            headers: {
                'X-Authorization': token
            }
        }
        axios.post(`${apiUrl}/films/` + filmId + "/reviews", body, header)
            .then(() => {
                setErrorMessage("")
                handleClose()
            }, (error) => {
                setErrorMessage(error.response.statusText)
            })
        }


    return (
        <>
            {token ? (
                <Button variant="contained" color="info" onClick={handleOpen}
                        sx={{paddingTop: "0px", paddingBottom: "0px", paddingLeft: "7px", paddingRight: "7px"}}>
                    Review Film
                </Button>
            ) : (
                <Button variant="contained" color="info" component={Link} to="/login"
                        sx={{paddingTop: "0px", paddingBottom: "0px", paddingLeft: "7px", paddingRight: "7px"}}>
                    Login To Review
                </Button>
            )}
            <Modal open={open} onClose={handleClose}>
                <Container maxWidth="sm" sx={{ mt: 4, p: 4, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Review Film
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <form onSubmit={handleReview}>
                            <Rating
                                name="film-rating"
                                value={rating}
                                onChange={handleRatingChange}
                                precision={1}
                                max={10}
                                size="large"
                            />
                            <TextField
                                label="Review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
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
        </>
    )
}

export default SubmitReviewModal;