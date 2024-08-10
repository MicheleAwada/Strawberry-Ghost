// import * as React from 'react';
// import SpinnerComponent from "../assets/components/spinner/spinner.svg?react"
// import Box from '@mui/material/Box'

// export default function Spinner({ show=true, sx, ...props }) {
//     return (
//         <Box {...props} component={SpinnerComponent} sx={{
//             animation: "spin 2s linear infinite",
//             "@keyframes spin": {
//             "0%": {
//                 transform: "rotate(360deg)",
//             },
//             "100%": {
//                 transform: "rotate(0deg)",
//             },
//             },
//             height: "100%",
//             aspectRatio: "1/1",
//             ...sx
//         }}>
//         </Box>
//     )
// }
import LoopIcon from '@mui/icons-material/Loop';
const Spinner = ({ sx, clockwise=false, ...props}) => <LoopIcon
  sx={{
    animation: `${clockwise ? "clockwisespin" : "spin"} 2s linear infinite`,
    transform: ``, 
    "@keyframes spin": {
      "0%": {
        transform: `rotate(360deg) scaleX(1)`, 
      },
      "100%": {
        transform: `rotate(0deg) scaleX(1)`,
      },
    },
    "@keyframes clockwisespin": {
      "0%": {
        transform: `rotate(-360deg) scaleX(-1)`, 
      },
      "100%": {
        transform: `rotate(0deg) scaleX(-1)`,
      },
    },

    ...sx
  }}
  {...props}
/>


export default Spinner