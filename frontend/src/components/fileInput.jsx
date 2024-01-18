import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from '@mui/material/Typography'

import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useState } from "react";
import Box from '@mui/material/Box'

export default function FileInput({ text="Upload Image", url, error, helperText, name, id, inputProps, buttonProps }) {
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    const handleFileChange = (event) => {
      const files = event.target.files;
      setIsFileUploaded(files.length > 0);
      // Add any other file handling logic here if needed
    };

    const providedInputOnChange = inputProps.onChange || (() => {})
    const inputOnChange = (event) => {
        providedInputOnChange(event)
        handleFileChange(event)
    }
    inputProps.onChange = inputOnChange
    return (
        <label htmlFor={id}>
                    <input
                        style={{ opacity: '0', width:"1px", height:"1px" }}
                        id={id}
                        name={name}
                        type="file"
                        {...inputProps}
                    />
                    <Stack flexDirection="row" gap="2rem" justifyContent="center" alignItems="center" sx={{height: "100%"}}>
                        <Stack alignItems="center" gap="2rem" justifyContent="center">
                            <Button color={error ? "error" : "primary"} variant="contained" component="span" {...buttonProps} startIcon={<FileUploadIcon />}>
                                {text}
                            </Button>
                            {error && <Typography variant="body1" color="initial">
                                {helperText}
                            </Typography>}
                        </Stack>
                        {isFileUploaded && <img component="img" src={url} style={{ aspectRatio: "4/3", objectFit: "cover", width: "3rem", height: "auto" }}>
                        </img>}
                    </Stack>
                </label>
    )
}