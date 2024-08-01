import Typography from "@mui/material/Typography"

export default function ErrorTypography({children}) {
    return <Typography color="error" component="span" sx={{ maxWidth: {xs: "12rem", sm: "20rem"}}}>
        {children}
    </Typography>
}