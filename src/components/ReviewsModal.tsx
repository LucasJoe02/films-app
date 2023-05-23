import {Button, Modal, Box, Typography, List, Link, Alert, AlertTitle} from '@mui/material'
import React, {useState} from "react";
import axios from "axios";
import ReviewListObject from "./ReviewListObject";

interface IFilmProps {
    filmId: string | undefined
}

const ReviewsModal = (props: IFilmProps) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const [filmId, setFilmId] = React.useState < string | undefined > (props.filmId)
    const [open, setOpen] = useState(false);
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const fetchReviews = () => {
            axios.get(`${apiUrl}/films/` + filmId + "/reviews")
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setReviews(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        fetchReviews()
    },[apiUrl, filmId, setReviews])

    React.useEffect(() => {
        setFilmId(props.filmId);
    }, [props.filmId]);

    const renderReviewRows = () => {
        if (reviews.length > 0) {
            return reviews.map((review: Review, index) => <ReviewListObject key={ review.reviewerId + review.timestamp} review={review} index={index}/>)
        } else {
            return <h3 style={{color: "red"}}>No reviews found</h3>
        }

    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Link onClick={handleOpen} sx={{cursor: 'pointer'}}>{reviews.length} Reviews</Link>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '80%', maxWidth: 600, bgcolor: 'background.paper', boxShadow: 24,
                    borderRadius: '20px', p: 4}}>
                    <Typography variant="h5" mb={2}>Reviews</Typography>
                    <List sx={{ maxHeight: 400, overflow: 'auto', marginBottom: '2rem',
                        scrollbarWidth: 'thin',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            marginRight: '10px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'lightskyblue',
                            borderRadius: '4px',
                        },}}>
                        {errorFlag?
                            <Alert severity = "error">
                                <AlertTitle> Error </AlertTitle>
                                { errorMessage }
                            </Alert>: ""}
                        {renderReviewRows()}
                    </List>
                    <Button variant="contained" sx={{position: "fixed", bottom: '1rem', right: '50%', transform: 'translate(50%, 0%)'}}
                            onClick={handleClose}>Close</Button>
                </Box>
            </Modal>
        </div>
    )

}

export default ReviewsModal;