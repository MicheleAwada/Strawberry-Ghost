import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Rating from "@mui/material/Rating"
import Paper from "@mui/material/Paper"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"

import CheckIcon from '@mui/icons-material/CheckCircle';


export default function Review({ review, variant="elevation", elevation=(variant==="elevation" ? 4 : 0) }) {
    const name = review.user.first_name + " " + review.user.last_name
    return <Box key={review.id} sx={{ width: "100%"}}>
    <Paper variant={variant} elevation={elevation} sx={{ p: 2, bgcolor: "background.default" }}>
        <Stack spacing={2}>
            <Stack display={{ xs: "none", sm: "flex" }} direction="row" alignItems="center" spacing={2}>
                <Avatar src={review.user.avatar} />
                <Stack>
                    <Typography>{name}</Typography>
                    <Chip label="Verified Buyer" icon={<CheckIcon color="primary" />} />
                </Stack>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Rating readOnly value={review.rating} precision={0.5} />
            </Stack>
            <Stack display={{ xs: "flex", sm: "none" }} alignItems="flex-start" spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Avatar src={review.user.avatar} />
                    <Typography>{name}</Typography>
                </Stack>
                <Box display="flex" flexWrap="wrap" flexDirection="row" gap={2} alignItems="center" justifyContent="flex-start">
                    <Chip label="Verified Buyer" icon={<CheckIcon color="primary" />} />
                    <Rating readOnly value={review.rating} precision={0.5} />
                </Box>
                <Divider orientation="horizontal" variant="middle" flexItem />
            </Stack>
            {/* <Box sx={{ display: { xs: "none", sm: "block"} }} width="100%">
                <Divider orientation="horizontal" variant="middle" />
            </Box> */}
            <Typography>{review.body}</Typography>
        </Stack>
    </Paper>
</Box>
}
// export default function Review({ review, variant="elevation", elevation=(variant==="elevation" ? 4 : 0) }) {
//     const name = review.user.first_name + " " + review.user.last_name
//     return <Box key={review.id} sx={{ width: "100%"}}>
//     <Paper variant={variant} elevation={elevation} sx={{ p: 2, bgcolor: "background.default" }}>
//         <Stack spacing={2}>
//             <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
//                 <Avatar src={review.user.avatar} />
//                 <Stack>
//                     <Typography>{name}</Typography>
//                     <Chip label="Verified Buyer" icon={<CheckIcon color="primary" />} />
//                 </Stack>
//                 <Divider orientation="vertical" variant="middle" flexItem />
//                 <Rating readOnly value={review.rating} precision={0.5} />
//             </Box>
//             <Typography>{review.body}</Typography>
//         </Stack>
//     </Paper>
// </Box>
// }