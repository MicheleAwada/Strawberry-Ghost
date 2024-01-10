import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Collapse from "@mui/material/Collapse";

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';


import useMediaQuery from "@mui//material/useMediaQuery"

import { Link as ReactRouterLink } from "react-router-dom"
import IconButton from '@mui/material/IconButton'
import { useEffect, useRef, useState } from "react";


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

const DefaultProductCardActions = () => {
	const [open, setOpen] = useState(false)
	function handleClick() {
		setOpen(!open)
	}
	const rootRef = useRef()
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (rootRef.current && !rootRef.current.contains(event.target)) {
				setOpen(false);
			}
		  };
	  
		  document.addEventListener('mouseup', handleClickOutside);
	  
		  return () => {
			document.removeEventListener('mouseup', handleClickOutside);
		  };
	}, [])
	return <Stack ref={rootRef} flexDirection="row" sx={{ bgcolor: "primary.main", borderRadius: "1000rem" }}>
		<IconButton aria-label={open ? "add to cart" : "cancel"} sx={{ color: "primary.contrastText" }} onClick={handleClick} >
			{open ? <RemoveShoppingCartOutlinedIcon /> : <AddShoppingCartIcon />}
		</IconButton>
		<Collapse in={open} orientation="horizontal" >
			<Stack flexDirection="row" alignItems="center" >
				<Typography color="primary.contrastText">HII</Typography>
				<IconButton aria-label="" sx={{ color: "primary.contrastText" }} onClick={handleClick} >
					<AddShoppingCartIcon />
				</IconButton>
			</Stack>
		</Collapse>
	</Stack>
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
