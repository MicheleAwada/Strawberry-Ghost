import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';


import useMediaQuery from "@mui//material/useMediaQuery"

import { Link as ReactRouterLink, useFetcher } from "react-router-dom"
import IconButton from '@mui/material/IconButton'
import Spinner from "./spinner";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./user";
import { MessagesContext } from "./messages";
import { getInitialVariant } from "../routes/productView"
import Tooltip from "@mui/material/Tooltip";


export function ProductPrice({ price, sx, textColor="initial", ...props }) {
	const wholeNumber = Math.floor(price);
	const decimalNumber = Math.round((price - wholeNumber)*100);
	const wholeNumberString = wholeNumber.toString();
	const decimalNumberString = decimalNumber.toString().padStart(2, "0");

	const baseFontSize = 1.5;

	return (
		<Box sx={{ ...sx }} {...props} >
			<Stack flexDirection="row">
				<Typography
					color={textColor}
					fontSize={`${baseFontSize / 2}rem`}
					sx={{
						position: "relative",
						top: `${baseFontSize / 4}rem`,
						left: 0,
					}}
				>
					{"€"}
				</Typography>
				<Typography color={textColor} fontSize={`${baseFontSize}rem`}>
					{wholeNumberString}
				</Typography>
				<Typography
					color={textColor}
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
	const [user, setUser] = useContext(UserContext)
	const is_authenticated = user.is_authenticated

	const { simpleAddMessage } = useContext(MessagesContext)

	const defaultQuantity = 1
	const initalVariant = getInitialVariant(product)
	const initalVariantId = initalVariant?.id
	const allOutOfStock = initalVariant.stock <=0
	function getCartItem() {
		if (!user.is_authenticated) return false
		const cartItem = user.cartitem_set.find((cartItem) => initalVariantId === cartItem.variant) || false
		return cartItem
	}
	const [cartItem, setCartItem] = useState(getCartItem())


	const fetcher = useFetcher();
	const sumbitting = fetcher.state === "submitting";
	useEffect(() => {
		if (fetcher.data && fetcher.data.succeeded) {
			cartItem ? simpleAddMessage("Removed from cart", {severity: "success"}) : simpleAddMessage("Woohoo, added to cart", {severity: "success"})
			setUser(oldUser => ({...oldUser, ...fetcher.data.response}))
		}
	}, [fetcher.data])

	useEffect(() => {
		setCartItem(getCartItem())
	}, [user])

	return <fetcher.Form action={cartItem ? "/deleteCart" : "/addToCart"} method={cartItem ? "DELETE" : "POST"}>
		<input type="hidden" name="id" value={cartItem ? cartItem.id : 0} />
		<input type="hidden" name="quantity" value={defaultQuantity} />
		<input type="hidden" name="variant" value={initalVariantId} />
		<input type="hidden" name="product" value={product.id} />
		<Tooltip placement="right" title={allOutOfStock ? (!is_authenticated ? "Out of stock, and Login required" : "Out of stock") : !is_authenticated ? "Login required" : (cartItem ? "Remove from cart" : "Add to cart")} >
			<IconButton color="primary" aria-label="add to cart" type={allOutOfStock ? "button" : is_authenticated ? "submit" : "button"} onClick={() => {
				if (!is_authenticated) {
					simpleAddMessage("You cannot add to cart before you login", {severity: "error"})
				}
				if (allOutOfStock) {
					simpleAddMessage("Out of stock", {severity: "error"})
				}
			}} >
				{sumbitting ? <Spinner /> : cartItem ? <RemoveShoppingCartIcon /> : <AddShoppingCartIcon />}
			</IconButton>
		</Tooltip>
	</fetcher.Form>
}
const DefaultProductCardExtras = ({ children }) => <Stack flexDirection="row" flexWrap="wrap" alignItems="center" mt={2} gap={2}>{children}</Stack>

export default function ProductItem({ product, titleVariant="h6", ProductCardActions=DefaultProductCardActions, ProductCardExtras = DefaultProductCardExtras }) {
	const productLink = `/products/${product.slug}`

	return (
			<Card elevation={4} sx={{ height: "100%", width: "100%" }}>
                <CardMedia
                    component={ReactRouterLink}
                    to={productLink}
                    sx={{
						aspectRatio: "4/3",
						width: "100%",
                        bgcolor: "inherit",
                    }}
                >
					<Box component="img" alt={product.thumbnail_alt || (`${product.title}'s thumbnail`)} src={product.thumbnail} sx={{ objectFit: "cover", width: "100%", height: "100%" }} />
				</CardMedia>
				<CardContent sx={{ flexGrow: 1 }}>
					<Link to={productLink} component={ReactRouterLink} variant={titleVariant} >
						<Typography variant={titleVariant} component="h2" sx={{ wordWrap: "break-word", lineClamp: 2, WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} lineHeight="1.8rem" height="3.6rem" textOverflow="ellipsis" overflow="hidden" >
							{product.title}
						</Typography>
					</Link>
					<ProductCardExtras product={product}>
						<ProductPrice price={product.price} />
						{product.new && <Chip label="New" color="primary" variant='outlined' />}
					</ProductCardExtras>
				</CardContent>
				<CardActions>
					<ProductCardActions product={product} />
				</CardActions>
			</Card>
	);
}
