import React, { useRef } from "react";

import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"


function FileInput({ onImageSelected, inputRef = useRef(), inputProps={}, buttonProps={}, hideButton=false, buttonText="Choose Image" }) {

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

  return (
    <Stack flexDirection="row">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ opacity: 0, height: 0, width: 0 }}
        {...inputProps}
      />

      {!hideButton && <Button variant="outlined" {...buttonProps} onClick={onChooseImg}>
        {buttonText}
      </Button>}
    </Stack>
  );
}

export default FileInput;
