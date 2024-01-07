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

import useMediaQuery from "@mui//material/useMediaQuery"

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
    const isMd = useMediaQuery(theme => theme.breakpoints.up('md'));
	return (
		<Grid item xs={12} sm={6} md={4} lg={3}>
			<Card elevation={4} sx={{ height: "100%", width: "100%" }}>
                <CardMedia
                    component="a"
                    href="#"
                    sx={{
                        pt: "75%", //4/3 aspect ratio
                        bgcolor: "inherit",
                    }}
                    image={info.thumbnail}
                />
				<CardContent sx={{ flexGrow: 1 }}>
					<Link href="#" variant={isMd ? "h5" : "h6"} sx={{ display: "inline-block" }}>
						<Typography variant={isMd ? "h5" : "h6"} component="h2">
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
