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

export function ProductCategory({ categories }) {
	//TODO
}

export function ProductPrice({ price }) {
	const wholeNumber = Math.floor(price);
	const decimalNumber = price - wholeNumber;
	const wholeNumberString = wholeNumber.toString();
	const decimalNumberString = decimalNumber.toString().padStart(2, "0");

	const baseFontSize = 1.5;

	return (
		<Box sx={{ px: 1 }}>
			<Stack
				flexDirection="row"
				sx={{ position: "relative", display: "inline-flex" }}
			>
				<Typography
					color={"initial"}
					fontSize={`${baseFontSize / 2}rem`}
					sx={{
						position: "absolute",
						top: `${baseFontSize / 4}rem`,
						left: `${1 * (baseFontSize / -3.5)}rem`,
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
						position: "absolute",
						top: `${baseFontSize / 4}rem`,
						right: `${2 * (baseFontSize / -3.5)}rem`,
					}}
				>
					{decimalNumberString}
				</Typography>
			</Stack>
		</Box>
	);
}

export default function ProductItem({ info }) {
	return (
		<Grid item xs={12} sm={6} md={4} sx={{ width: "18rem" }}>
			<Card sx={{ height: "100%" }}>
				<a href="#">
					<CardMedia
						component="div"
						sx={{
							pt: "56.25%",
							bgcolor: "inherit",
						}}
						image={info.thumbnail}
					/>
				</a>
				<CardContent sx={{ flexGrow: 1 }}>
					<Link href="#" variant="h5" sx={{ display: "inline-block" }}>
						<Typography variant="h5" component="h2">
							{info.title}
						</Typography>
					</Link>
					<ProductPrice price={info.price} />
				</CardContent>
				<CardActions>
					<Button variant="contained" size="small">
						Add to Cart
					</Button>
				</CardActions>
			</Card>
		</Grid>
	);
}
export function ProductItemStretch({ info }) {
	return (
		<Card sx={{ width: "100%", height: "12rem", display: "flex", flexDirection: "row" }}>
                <CardMedia
                    component="a"
                    href="#"
                    sx={{
                        objectFit: "cover",
                        aspectRatio: "4/3",
                        maxHeight: "100%",
                        bgcolor: "inherit",
                        flexGrow: 1,
                    }}
                    image={info.thumbnail}
                />

			<Box sx={{ display: "flex", flexDirection: "column", pr: {xs: 2, sm: 6} }}>
				<CardContent sx={{ flexGrow: 1 }}>
					<Link href="#" variant="h6" sx={{ display: "inline-block" }}>
						<Typography variant="h6" component="h2">
							{info.title}
						</Typography>
					</Link>
					<ProductPrice price={info.price} />
				</CardContent>
				<CardActions>
					<Button variant="contained" size="small">Add to Cart</Button>
				</CardActions>
			</Box>
		</Card>
	);
}
