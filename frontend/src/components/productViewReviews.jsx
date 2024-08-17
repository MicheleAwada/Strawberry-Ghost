import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Rating from "@mui/material/Rating"
import Paper from "@mui/material/Paper"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"

import CheckIcon from '@mui/icons-material/CheckCircle';
import Review from "./review"

import { Link as ReactRouterLink } from "react-router-dom"
import { getDefaultProductUrl } from "../routes/reviewsPage"


export default function Reviews({ product }) {
    return (
        <Box sx={{ px: {xs: "0.5rem", sm: "2rem" }, boxSizing: "border-box" }}>
            <Paper variant="outlined" sx={{ p: {xs: 1, sm: 4}}}>
                    <Stack spacing={6}>
                        <Stack alignItems="center" spacing={2}>
                            <Typography variant="h4" textAlign="center">{product.average_rating > 3.5 ? `Happy Customers with ${product.reviews_length} reviews and an average of ${product.average_rating} stars` : `${product.reviews_length} reviews`}</Typography>
                            <Rating readOnly value={product.average_rating} precision={0.1} size="large" />
                        </Stack>
                        <Stack spacing={2} direction={{xs: "column", lg: "row"}} divider={<Box sx={{ boxSizing: "border-box", px: 0 }}><Divider flexItem /></Box>}>
                            {product.recommended_reviews.map((review, index) => <Review review={review} key={review.id} />)}
                        </Stack>
                        <Link component={ReactRouterLink} to={getDefaultProductUrl(product)}><Typography>See More...</Typography></Link>
                    </Stack>
            </Paper>
        </Box>
    )
    
}