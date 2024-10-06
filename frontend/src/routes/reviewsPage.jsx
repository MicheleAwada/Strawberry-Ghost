import Stack from "@mui/material/Stack"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from "@mui/material/Slider"
import Collapse from "@mui/material/Collapse"
import Button from "@mui/material/Button"

import BackIcon from "@mui/icons-material/ArrowBack"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import StarIcon from '@mui/icons-material/Star';
import PaletteIcon from '@mui/icons-material/Palette';

import { useLoaderData, useNavigate } from "react-router-dom"
import { getProduct, get_reviews } from "../api"
import axios from "axios";
import { useState } from "react";
import VariantSelect from "../components/variantSelect";
import Review from "../components/review";

export async function loader({ params }) {
    const productSlug = params.product_slug
    const variantId = params.variant_id
    const ratingFilterLTE = params.rating_filter_lte
    const ratingFilterGTE = params.rating_filter_gte
    let data = { "productslug": productSlug }
    if (variantId!=="null") {data["variantid"] = parseInt(variantId)}
    data["ratinglte"] = parseFloat(ratingFilterLTE)
    data["ratinggte"] = parseFloat(ratingFilterGTE)
    // data will be sent using url params
    const [{value: reviews_response}, {value: product}] = await Promise.allSettled([get_reviews({}, {}, data), getProduct({ slug: productSlug })])
    if (!reviews_response.succeeded) {
        throw new Error(reviews_response.errorMessage)
    }
    return [reviews_response.response, product]
}

export function getDefaultProductUrl(product) {
    return `/reviews/${product.slug}/null/0.5/5`
}

export default function ReviewsPage() {
    const [reviews, product] = useLoaderData()
    const [ratingSlider, setRatingSlider] = useState([0.5, 5])
    function ratingSliderHandleChange(e) {
        setRatingSlider(e.target.value)
    }

    const [ratingOpen, setRatingOpen] = useState(false)
    const [variantOpen, setVariantOpen] = useState(false)
    const variantIdState = useState(-1)

    function applyFilters() {
        const newLink = `/reviews/${product.slug}/${variantIdState[0]===-1 ? "null" : variantIdState[0]}/${ratingSlider[0]}/${ratingSlider[1]}`
        navigate(newLink)
        
    }

    const navigate = useNavigate()
    return <Box>
        <Grid container>
            <Grid item xs={12} sm={12} md={4} lg={3}>
                <List aria-labelledby="filter-reviews-subheader" subheader={<ListSubheader sx={{ pt: 2, boxSizing: "border-box"}}>Filter Reviews</ListSubheader>}>
                    <ListItem>
                        <ListItemButton onClick={() => setVariantOpen(!variantOpen)}>
                            <ListItemIcon>
                                <PaletteIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                Variant
                            </ListItemText>
                            {variantOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={variantOpen} sx={{width: "100%"}}>
                        <Box sx={{ px: 4 }}>
                            <VariantSelect variantState={variantIdState} variants={[{ id: -1, name: "all"}, ...product.variants]} id="reviews-page-filter" />
                        </Box>
                    </Collapse>
                    <ListItem>
                        <ListItemButton onClick={() => setRatingOpen(!ratingOpen)}>
                            <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Rating Slider
                            </ListItemText>
                            {ratingOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={ratingOpen}>
                        <Box sx={{ px: 4 }}>
                            <Slider
                            getAriaLabel={() => 'Reviews Rating range'}
                            value={ratingSlider}
                            onChange={ratingSliderHandleChange}
                            valueLabelDisplay="auto"
                            max={5}
                            min={0.5}
                            step={0.5}
                            marks
                            getAriaValueText={() => `${ratingSlider[0]}-${ratingSlider[1]}`}
                            />
                        </Box>
                    </Collapse>
                    <Box sx={{ px: 2, boxSizing: "border-box" }} onClick={applyFilters}>
                        <Button variant="contained" fullWidth startIcon={<FilterAltIcon />}>
                            Apply Filters
                        </Button>
                    </Box>
                </List>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={9}>
                <Box sx={{ boxSizing: "border-box", p: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction="row" alignItems="center">
                            <IconButton onClick={() => navigate(-1)}><BackIcon /></IconButton>
                            <Typography>{reviews.length} Reviews found for the product {product.title}</Typography>
                        </Stack>
                        {reviews.map((review, index) =>
                            <Review review={review} key={review.id} />
                            )}
                    </Stack>
                </Box>
            </Grid>
        </Grid>
    </Box>
}