import { getProducts } from "../api";

import { Link as ReactRouterLink } from "react-router-dom";

import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"

import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export async function loader() {
    return await getProducts()
}

const actions = [
    {title: "Create Product", icon: <CreateIcon color="primary" />, link: "/admin/products/create"},
    {title: "Update Product", icon: <EditIcon color="primary" />, link: "/admin/products/update"},
    {title: "Delete Product", icon: <DeleteIcon color="primary" />, link: "/admin/products/delete"},
]
export default function Admin() {
    return (
        <Container maxWidth="lg" sx={{ boxSizing: "border-box", px: {xs: 2, sm: 4, md: 8}, py: "2rem" }}>
            <Grid container spacing={4}>
                {
                actions.map((action, index) =>
                    <Grid key={index} item xs={12} md={6} lg={4}>
                        <Box component={action?.link && ReactRouterLink} to={action?.link}>
                            <Paper variant="elevation" elevation={4} sx={{py: "2rem"}}>
                                <Stack flexDirection="row" justifyContent="center" alignItems="center" gap={{xs: 1, md: 2}} sx={{ h: "8rem" }}>
                                    <Typography color="primary" sx={{textDecoration: "underline"}}>{action.title}</Typography>
                                    {action.icon}
                                </Stack>
                            </Paper>
                        </Box>
                    </Grid>
                )
                }
            </Grid>
        </Container>
    )
}