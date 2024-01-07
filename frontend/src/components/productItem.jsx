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

export function ProductCategory({ categories}) {
    //TODO
}

export function ProductPrice({ price }) {
    //TODO
}

export default function ProductItem({ info }) {
	return (
		<Grid item xs={12} sm={6} md={4} sx={{ width: "18rem"}}>
			<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <a href="#">
                    <CardMedia
                        component="div"
                        sx={{
                            pt: "56.25%",
                            bgcolor: "inherit"
                        }}
                        image={info.thumbnail}
                    />
                </a>
                <CardContent sx={{ flexGrow: 1 }}>
                        <Link href="#" gutterBottom variant="h5">
                            <Typography gutterBottom variant="h5" component="h2">{info.title}</Typography>
                        </Link>
                    <Typography>
                        {info.price}
                    </Typography>
                </CardContent>
				<CardActions>
					<Button variant="contained" size="small">Add to Cart</Button>
				</CardActions>
			</Card>
		</Grid>
	);
}
