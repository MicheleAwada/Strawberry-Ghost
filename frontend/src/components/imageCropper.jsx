import React, { useState } from "react";
import Cropper from "react-easy-crop";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

function ImageCropper({ aspectRatio = 4/3, image, onCropDone, onCropCancel, buttonCancelProps={}, buttonDoneProps={} }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };


  return (
        <Paper elevation={10} sx={{ overflow: "hidden", borderRadius: "2rem", height: "80vh", width: { xs: "80vw", lg: "40vw" }, position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000000  }}>
        <Stack
        alignItems="center"
        sx={{height: "100%", width: "100%" }}
        >
            <Box sx={{ width: "100%", flexGrow: 1, position: "relative", backgroundColor: "#ffffff" }}>
                <Cropper
                    image={image}
                    aspect={aspectRatio}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    showGrid={true  }
                    style={{
                        containerStyle: {
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ffffff",
                        },
                    }}
                />
            </Box>
          <Box sx={{ width: "100%", px: "2rem", boxSizing: "border-box", pt: "2rem" }}>
            <Typography textAlign="center">Zoom</Typography>
            <Slider value={zoom} min={1} max={10} step={0.1} onChange={(event, zoom) => setZoom(zoom)} />
          </Box>
          <Stack direction="row" justifyContent="end" gap={4} sx={{ width: "100%", py: "2rem", px: "3rem", boxSizing: "border-box" }}>
            <Button color="primary" variant="outlined"
                onClick={onCropCancel}
                {...buttonCancelProps}
            >
                Cancel
            </Button>
            <Button
                color="primary"
                variant="contained"
                onClick={() => {
                    onCropDone(croppedArea);
                }}
                {...buttonDoneProps}
            >
              Done
            </Button>
          </Stack>
        </Stack>
    </Paper>
  );
}

export default ImageCropper;
