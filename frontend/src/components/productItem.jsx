import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';


import useMediaQuery from "@mui//material/useMediaQuery"

import { Link as ReactRouterLink } from "react-router-dom"
import IconButton from '@mui/material/IconButton'


export function ProductPrice({ price, sx, ...props }) {
	const wholeNumber = Math.floor(price);
	const decimalNumber = Math.floor((price - wholeNumber)*100);
	const wholeNumberString = wholeNumber.toString();
	const decimalNumberString = decimalNumber.toString().padStart(2, "0");

	const baseFontSize = 1.5;

	return (
		<Box sx={{ display: "inline", ...sx }} {...props} >
			<Stack flexDirection="row">
				<Typography
					color={"initial"}
					fontSize={`${baseFontSize / 2}rem`}
					sx={{
						position: "relative",
						top: `${baseFontSize / 4}rem`,
						left: 0,
					}}
				>
					{"$"}
				</Typography>
				<Typography color={"initial"} fontSize={`${baseFontSize}rem`}>
					{wholeNumberString}
				</Typography>
				<Typography
					color={"initial"}
					fontSize={`${baseFontSize / 2}rem`}
					sx={{
						position: "relative",
						top: `${baseFontSize / 4}rem`,
						right: 0,
					}}
				>
					{decimalNumberString}
				</Typography>
			</Stack>
		</Box>
	);
}

const DefaultProductCardActions = ({product}) => {

	const defaultQuantity = 1
	const defaultVariant = product.variants.find((variant) => variant.default) || product.variants[0]
	return <IconButton color="primary" aria-label="add to cart" >
			<AddShoppingCartIcon />
		</IconButton>
}
const DefaultProductCardExtras = ({ children }) => <Stack flexDirection="row" flexWrap="wrap" alignItems="center" mt="0.5rem">{children}</Stack>
export default function ProductItem({ product, ProductCartActions=DefaultProductCardActions, ProductCardExtras = DefaultProductCardExtras }) {
    const isMd = useMediaQuery(theme => theme.breakpoints.up('md'));
	const productLink = `/products/${product.id}`
	return (
		<Grid item xs={12} sm={6} md={4} lg={3}>
			<Card elevation={4} sx={{ height: "100%", width: "100%" }}>
                <CardMedia
                    component={ReactRouterLink}
                    to={productLink}
                    sx={{
						aspectRatio: "4/3",
						width: "100%",
                        bgcolor: "inherit",
                    }}
                    image={product.thumbnail}
                />
				<CardContent sx={{ flexGrow: 1 }}>
					<Link to={productLink} component={ReactRouterLink} variant={isMd ? "h5" : "h6"} sx={{ display: "inline-block" }}>
						<Typography variant={isMd ? "h5" : "h6"} component="h2">
							{product.title}
						</Typography>
					</Link>
					<ProductCardExtras product={product}>
						<ProductPrice price={product.price} sx={{ pr: 4}} />
					</ProductCardExtras>
				</CardContent>
				<CardActions>
					<ProductCartActions product={product} />
				</CardActions>
			</Card>
		</Grid>
	);
}
