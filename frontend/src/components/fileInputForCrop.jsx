import React, { useRef } from "react";

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"


function FileInput({ onImageSelected, emptyNameIfNull, name, error, helperText, inputRef = useRef(), inputProps={}, buttonProps={}, hideButton=false, buttonText="Choose Image" }) {

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function (e) {
        onImageSelected(reader.result);
      };
    }
  };

  const onChooseImg = () => {
    inputRef.current.click();
  };

  const nameShouldBeEmpty = Boolean(emptyNameIfNull && inputRef?.current?.value === "")
  const inputName = nameShouldBeEmpty ? undefined : (name || inputProps.name)
  const newInputProps = {...inputProps}
  delete newInputProps.name
  return (
    <Stack flexDirection="row">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ opacity: 0, height: 0, width: 0 }}
        name={inputName}
        {...newInputProps}
      />

      {!hideButton && <Button variant="outlined" color={error ? "error" : "primary"} {...buttonProps} onClick={onChooseImg}>
        {buttonText}
      </Button>}
      {helperText && <Typography color={error ? "error" : "initial"}>{helperText}</Typography>}
    </Stack>
  );
}

export default FileInput;
