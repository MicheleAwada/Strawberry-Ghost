import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"

import ThankyouImageSrc from "../../assets/components/stripe/success/THANK YOU.png"
import { Link as ReactRouterLink } from "react-router-dom"
import { useContext } from "react"
import { HeaderHeightContext } from "../header"


const Success = () => {
  const [headerHeight] = useContext(HeaderHeightContext)

  return (
    <Stack alignItems="center" pt={2} px={{xs: 0, sm: 2, md: 4}}>
      <Paper sx={{ borderRadius: 4, p:{xs: 1, sm: 2, md: 4} }} elevation={12}>
        <Stack gap={4} alignItems="center">
            <Box component="img" src={ThankyouImageSrc} sx={{ borderRadius: 4, maxWidth: "100%", maxHeight: {xs: `calc(100vh - ${headerHeight}px)`, lg: `calc(100vh - 8rem - ${headerHeight}px)`}, objectFit: "contain" }} />
            <Typography gutterBottom sx={{ textAlign: "center" }}>Dear Sir/Madam, Your payment has been successfully placed, our team here at strawberry ghost thanks you for your order.</Typography>
            <Stack flexDirection="row" alignItems="center" gap={2}>
              {/* <Typography color="primary" variant="body1">How would you rate our service?</Typography> */}
              <Button variant="outlined" LinkComponent={ReactRouterLink} to="/contact">Rate our Services?</Button>
            </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default Success