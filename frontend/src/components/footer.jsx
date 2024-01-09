import DarkLogo from "../assets/components/header/logo dark.svg?react";
import LightLogo from "../assets/components/header/logo light.svg?react";

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as ReactRouterLink } from "react-router-dom"



const info = [
    ["about us", "careers", "investors", "sustainability", "press", "social impact"],
    ["contact us", "faq", "shipping", "returns", "warranty", "affiliates", "corporate sales"],
    ["privacy policy", "terms of use", "cookie policy", "shipping", "returns", "warranty", "corporate sales", "corporate sales"],
    ["terms of service", "shipping", "returns", "warranty", "corporate sales", "corporate sales"],
]

export default function Footer() {
    return (
        <Box component="footer" sx={{ width: "100%", bgcolor: "primary.dark", mt: "8rem", borderRadius: "4rem 4rem 0 0" }}>
            <Stack>
                <Box sx={{ px: {xs: "1rem", sm: "2rem", md: "4rem"}, pt: "6rem", pb: "3rem", boxSizing: "border-box", }}>
                    <Stack justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
                        <ReactRouterLink to="/" style={{}}>
                            <DarkLogo style={{ height: "4rem", width: "auto",  }} />
                        </ReactRouterLink>
                    </Stack>
                </Box>
                <Stack flexDirection="row" justifyContent="space-around" flexWrap="wrap" gap={8} sx={{ px: {xs: "1rem", sm: "2rem", md: "4rem"}, pb: "2rem", boxSizing: "border-box", }}>
                    {info.map((column, index) =>
                        <List key={index} >
                            {column.map((text, index) => <ListItem key={index} sx={{my:"0.5rem"}}><Link component={ReactRouterLink} to={`/${text}`} variant="h6" sx={{ textAlign: "center", width: "100%" }} color="primary.contrastText">{text}</Link></ListItem>)}
                        </List>
                        )}
                </Stack>
                <Box sx={{ bgcolor: "primary.extraDark", px: {xs: "1rem", sm: "2rem", md: "4rem"}, boxSizing: "border-box", borderRadius: "4rem 4rem 0 0" }}>
                    <Typography variant="body1" color="primary.contrastText" sx={{ mt:"8rem", mb: "4rem" }}>
                        Strawberry Ghost. All rights probably reserved.
                    </Typography>
                </Box>
            </Stack>
        </Box>
    )
}