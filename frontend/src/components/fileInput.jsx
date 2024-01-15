import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from '@mui/material/Typography'


export default function FileInput({ text="Upload Image", error, name, id, inputProps, buttonProps }) {
    return (
        <label htmlFor={id}>
                    <input
                        style={{ opacity: '0', width:"1px", height:"1px" }}
                        id={id}
                        name={name}
                        type="file"
                        {...inputProps}
                    />

                    <Stack>
                        <Button color="primary" variant="contained" component="span" {...buttonProps}>
                            {text}
                        </Button>
                        {error && <Typography variant="body1" color="initial">
                            {error}
                        </Typography>}
                    </Stack>
                </label>
    )
}