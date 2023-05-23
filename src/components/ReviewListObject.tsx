import React from "react";
import {Avatar, ListItem, ListItemText, Typography} from "@mui/material";

interface IReviewProps {
    review: Review
    index: number
}

const ReviewListObject = (props: IReviewProps) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const [review] = React.useState < Review > (props.review)
    const [index] = React.useState < number > (props.index)

    const formatDate = (dateString: string) => {
        const dateTime = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        return dateTime.toLocaleDateString(undefined, options);
    }

    return (
        <ListItem key={index} alignItems="flex-start" sx={{
            border: '1px solid',
            borderRadius: '4px',
            borderColor: 'lightskyblue',
            padding: '8px',
            marginBottom: '1rem',
            maxWidth: '500px'
        }}>
            <ListItemText
                primary={
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0rem' }}>
                        <Avatar
                            src={`${apiUrl}/users/` + review.reviewerId + '/image'}
                            alt={review.reviewerFirstName}
                            sx={{ width: 40, height: 40, marginRight: '1rem'}}
                            onError={(event) => {
                                const imgElement = event.target as HTMLImageElement
                                imgElement.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
                            }}
                        />
                        <Typography variant="h5" fontWeight="bold" component="p">
                            {review.reviewerFirstName}, {review.reviewerLastName}
                        </Typography>
                    </div>
                }
                secondary={
                    <>
                        <Typography
                            component="span"
                            variant="body1"
                            color="text.primary"
                            display="inline"
                            fontWeight="bold"
                        >
                            Rating: ⭐{review.rating}
                        </Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="inline"
                        >
                            { " " + formatDate(review.timestamp)}
                        </Typography>
                        <br />
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="inline"
                        >
                            {review.review || 'No review provided'}
                        </Typography>
                        <br />
                    </>
                }
            />
        </ListItem>
    )
}

export default ReviewListObject;