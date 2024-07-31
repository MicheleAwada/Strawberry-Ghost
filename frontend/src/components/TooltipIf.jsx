import Tooltip from "@mui/material/Tooltip"
import Box from "@mui/material/Box"

export default function TooltipIf({ tooltipText, placement="bottom",  condition, children }) {

    return (
        condition ? <Tooltip title={tooltipText} placement={placement}>
            <Box>{children}</Box>
        </Tooltip> : <Box>{children}</Box>
    )
}