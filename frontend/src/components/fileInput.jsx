import Button from "@mui/material/Button"


export default function FileInput({ text="Upload Image", name, id, inputProps, buttonProps }) {
    return (
        <label htmlFor={id}>
                    <input
                        style={{ display: 'none' }}
                        id={id}
                        name={name}
                        type="file"
                        {...inputProps}
                    />

                    <Button color="primary" variant="contained" component="span" {...buttonProps}>
                        {text}
                    </Button>
                </label>
    )
}