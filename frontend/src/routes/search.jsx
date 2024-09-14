import { getProducts, search } from "../api";
import { useLoaderData, redirect, useNavigation, useNavigate, useSearchParams, useParams } from "react-router-dom"
import ProductListView from "../components/productListView";
import Spinner from "../components/spinner";

import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Slider from "@mui/material/Slider"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import Drawer from '@mui/material/Drawer';

import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { useState } from "react";

export async function loader({ request, params }) {
    const search_query = params.search_query
    const url_params = new URL(request.url).searchParams
    const array = await Promise.allSettled([getProducts(), search({search_query}, {}, url_params)])
    if (!array[1].value?.succeeded) {
        throw new Error("Failed to load search products, perhaps our server is down")
    }
    return [array[0].value, array[1].value.response]
}

export function toSearchString(value) {
    return (`/search/${value}`)
}

export default function Search() {
    const navigation = useNavigation();
    const loading = navigation.state === "loading"
    const loaderData = useLoaderData();
    const [products, search] = loaderData
    let search_products = search?.map((productid) => {
        return products.find((product) => (productid === product.id)) || null
    }) || []
    search_products = search_products.filter((product) => product !== null)


    const [sortByMenuAnchorEl, setSortByMenuAnchorEl] = useState(null)
    const open = Boolean(sortByMenuAnchorEl)
    const handleOpenSortByMenu = (event) => {
        setSortByMenuAnchorEl(event.currentTarget)
    }
    const handleCloseSortByMenu = () => {
        setSortByMenuAnchorEl(null)
    }
    let [searchParams, setSearchParams] = useSearchParams();
    const selectedMenuSx = { color: "primary.main"}
    function getSelectedMenuSx(index) {
        if (1 === index && searchParams.has("price_high_to_low")) {
            return selectedMenuSx
        } else if (2 === index && searchParams.has("price_low_to_high")) {
            return selectedMenuSx
        } else if (3 === index && searchParams.has("reviews_high_to_low")) {
            return selectedMenuSx
        } else if (4 === index && searchParams.has("latest")) {
            return selectedMenuSx
        } else if (0 === index && !(searchParams.has("price_high_to_low") || searchParams.has("price_low_to_high") || searchParams.has("reviews_high_to_low") || searchParams.has("latest"))) {
            return selectedMenuSx
        }
        return {}
    }
    function MenuOnClick(index) {
        setSearchParams((oldSearchParams) => {
            let strippedSearchParams = {...oldSearchParams}
            delete strippedSearchParams["price_high_to_low"]
            delete strippedSearchParams["price_low_to_high"]
            delete strippedSearchParams["reviews_high_to_low"]
            delete strippedSearchParams["latest"]
            if (index===0) {
                return strippedSearchParams
            }
            return {
                ...strippedSearchParams,
                [index === 1 ? "price_high_to_low" : index === 2 ? "price_low_to_high" : index === 3 ? "reviews_high_to_low" : index===4 ? "latest" : undefined]: "true"
            }

        })
        handleCloseSortByMenu()
    }
    function getAllForMenu(index) {
        return {onClick: e => MenuOnClick(index), sx: getSelectedMenuSx(index)}
    }

    const [priceSlider, setPriceSlider] = useState([0, 500])
    function priceSliderHandleChange(e) {
        setPriceSlider(e.target.value)
    }
    const [ratingSlider, setRatingSlider] = useState([0.5, 5])
    function ratingSliderHandleChange(e) {
        setRatingSlider(e.target.value)
    }
    function applyFilters() {
        setSearchParams((oldSearchParams) => ({...oldSearchParams, rating_range: `${ratingSlider[0]},${ratingSlider[1]}`}))
        setSearchParams((oldSearchParams) => ({...oldSearchParams, price_range: `${priceSlider[0]},${priceSlider[1]}`}))
    }

    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

    return (loading ? <Box sx={{ py: "4rem"}}><Spinner color="primary" size="3rem" /></Box> : <Box sx={{ py: "1rem" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pr: "2rem", }}>
                <Typography variant="body1" sx={{ p: "1rem"}}>Found {search_products.length} products</Typography>
                <Box display="flex" flexWrap="wrap" gap="1rem">
                    <Button variant="outlined" onClick={() => setFilterDrawerOpen(true)} startIcon={<FilterAltIcon />} sx={{ display: { lg: "none"} }}>Filter</Button>
                    <Button variant="contained" onClick={handleOpenSortByMenu} startIcon={<SortIcon />}>Sort By</Button>
                </Box>
                <Menu open={open} anchorEl={sortByMenuAnchorEl} onClose={handleCloseSortByMenu}>
                    <MenuItem {...getAllForMenu(0)}>Featured</MenuItem>
                    <MenuItem {...getAllForMenu(1)}>Price High To Low</MenuItem>
                    <MenuItem {...getAllForMenu(2)}>Price Low To High</MenuItem>
                    <MenuItem {...getAllForMenu(3)}>Rating</MenuItem>
                    <MenuItem {...getAllForMenu(4)}>Latest</MenuItem>
                </Menu>
            </Stack>
            <Drawer anchor="bottom" onClose={() => setFilterDrawerOpen(false)} open={filterDrawerOpen}>
                <Box sx={{ pb: "4rem", bgcolor: "#f3f3f3" }}>
                <List sx={{ borderRight: "1px solid #e0e0e0", bgcolor: "inherit", pr: "2rem" }} subheader={<ListSubheader sx={{ pt: 2, bgcolor: "inherit", boxSizing: "border-box"}}>Filters</ListSubheader>}>
                        <ListItem>
                            <Stack sx={{ width: "100%" }}>
                                <Typography>Filter Price</Typography>
                                <Slider
                                    sx={{ pt: "4rem" }}
                                    getAriaLabel={() => 'Price range'}
                                    value={priceSlider}
                                    onChange={priceSliderHandleChange}
                                    valueLabelDisplay="auto"
                                    max={500}
                                    min={0}
                                    step={1}
                                    getAriaValueText={() => `${priceSlider[0]}-${priceSlider[1]}`}
                                />
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Stack sx={{ width: "100%" }}>
                                <Typography>Filter Rating</Typography>
                                <Slider
                                    sx={{ pt: "4rem" }}
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
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" onClick={applyFilters} startIcon={<FilterAltIcon />}>Apply Filters</Button>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Grid container>
                <Grid item xs={12} lg={3} sx={{ display: { xs: "none", lg: "initial"} }}>
                    <List sx={{ borderRight: "1px solid #e0e0e0", pr: "2rem" }} subheader={<ListSubheader sx={{ pt: 2, boxSizing: "border-box"}}>Filters</ListSubheader>}>
                        <ListItem>
                            <Stack sx={{ width: "100%" }}>
                                <Typography>Filter Price</Typography>
                                <Slider
                                    sx={{ pt: "4rem" }}
                                    getAriaLabel={() => 'Price range'}
                                    value={priceSlider}
                                    onChange={priceSliderHandleChange}
                                    valueLabelDisplay="auto"
                                    max={500}
                                    min={0}
                                    step={1}
                                    getAriaValueText={() => `${priceSlider[0]}-${priceSlider[1]}`}
                                />
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Stack sx={{ width: "100%" }}>
                                <Typography>Filter Rating</Typography>
                                <Slider
                                    sx={{ pt: "4rem" }}
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
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" onClick={applyFilters} startIcon={<FilterAltIcon />}>Apply Filters</Button>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} lg={9}>
                    <ProductListView products={search_products} paginated />
                </Grid>
            </Grid>
        </Box>
    )
}