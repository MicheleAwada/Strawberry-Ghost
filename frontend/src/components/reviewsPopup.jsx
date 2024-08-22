import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Popover from "@mui/material/Popover"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import Avatar from "@mui/material/Avatar"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import useMediaQuery from "@mui/material/useMediaQuery"
import Rating from '@mui/material/Rating';


import StarIcon from '@mui/icons-material/Star';



import CheckIcon from '@mui/icons-material/CheckCircle';

import { useState } from "react"
import { Link as ReactRouterLink } from "react-router-dom"
import Review from "./review"
import { getDefaultProductUrl } from "../routes/reviewsPage"

export default function Reviews({ product }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

  
    const open = Boolean(anchorEl);
    const id = open ? 'review-popover' : undefined;

   
    const isLg = useMediaQuery(theme => theme.breakpoints.up("lg"))


    return <Box>
        <Stack alignItems="flex-start">
            <Button onClick={handleClick} aria-describedby={id} variant="contained" sx={{ width: "auto" }}>
                <Box display="flex" alignItems="normal" flexWrap="wrap" gap={2}>
                    <Typography variant="body1">{product.average_rating===null ? "No Reviews" : "Reviews"}</Typography>
                    {product.average_rating!==null && <Rating readOnly value={product.average_rating} precision={0.1} />}
                </Box>
            </Button>
        </Stack>
        <Popover
            id={id} 
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ horizontal: isLg ? "right" : "left", vertical: isLg ? "top" : "bottom"}}
            transformOrigin={{ horizontal: "left", vertical: "top"}}
            // disableScrollLock
        >
            <Stack spacing={2} sx={{ p: 2 ,overflow: "auto", maxHeight: "calc(60vh - 4rem)" }}>
                <Typography textAlign="center" fontWeight={600}>{product.reviews_length} reviews with a average of {product.average_rating} Stars</Typography>
                <Stack spacing={2}>
                    {product.recommended_reviews.filter((_, i) => i < 2).map((review, index) => {
                        return <Box sx={{ flexGrow: 1, }} key={review.id}>
                            <Review variant="outlined" review={review} />
                        </Box>
                    })}
                </Stack>
                <Link component={ReactRouterLink} to={getDefaultProductUrl(product)}><Typography>See More...</Typography></Link>
            </Stack>
        </Popover>
    </Box>
}