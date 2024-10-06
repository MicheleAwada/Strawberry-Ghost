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