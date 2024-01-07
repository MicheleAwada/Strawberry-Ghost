import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

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
				<CardMedia
					component="div"
					sx={{
						pt: "56.25%",
                        bgcolor: "#eee"
					}}
					image={info.thumbnail}
				/>
				<CardContent sx={{ flexGrow: 1 }}>
					<Typography gutterBottom variant="h5" component="h2">
						{info.title}
					</Typography>
					<Typography>
						{info.price}
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small">View</Button>
					<Button size="small">Edit</Button>
				</CardActions>
			</Card>
		</Grid>
	);
}
