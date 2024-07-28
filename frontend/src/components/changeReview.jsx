import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Rating from "@mui/material/Rating"
import Dialog from "@mui/material/Dialog"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import { useContext, useEffect, useState } from "react"
import { useFetcher } from "react-router-dom"
import { MessagesContext } from "./messages"
import { change_review, create_review } from "../api"
import VariantSelect from "./variantSelect"
import Spinner from "./spinner"
import { getFullError } from "./errorMessage"

export async function updateReviewAction({ request }) {
    const formData = await request.formData()
    console.log(formData)
    return await change_review(formData)
}
export async function createReviewAction({ request }) {
    const formData = await request.formData()
    console.log(formData)
    return await create_review(formData)
}

export default function ChangeReview({ product, }) {
    // PROD
    const productValidVariants = product.variants.filter(variant => variant.can_review)
    if (!productValidVariants) {
        throw new Error("No variants to review please go to home or go back or try again")
    }

    const variantState = useState(productValidVariants[0].id)
    const actualVariant = product.variants.find(variant => variant.id === variantState[0])
    if (actualVariant === undefined) {
        throw new Error("Variant not found")
    }

    const oldReview = actualVariant.posted_review
    const update = Boolean(oldReview)
    const fetcher = useFetcher()
    const fetcher_loading = fetcher.state==="loading"
    const { simpleAddMessage } = useContext(MessagesContext)

    const [error, setError] = useState({})

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.succeeded) {
                simpleAddMessage(`Review ${update ? "Updated" : "Posted"}`, { severity: "success" })
                setError({})
            } else {
                simpleAddMessage(fetcher.data.errorMessage, { severity: "error" })
                setError(fetcher.data.error)
            }
        }
    }, [fetcher.data])



    function getFromName(name) {
        const gotError = getFullError(error, name)
        return { name: name, helperText: gotError.error, error: gotError.isError }
    }

    return <fetcher.Form action={update ? "/update_review" :"/create_review"} method="POST">
        <Stack spacing={4} alignItems="center">
            {update && <input name="id" value={oldReview?.id} hidden type="hidden" aria-hidden />}
            <Typography variant="h6" color="primary.main">{update ? "Change" : "Post"} Review Of This Product</Typography>
            <TextField fullWidth label="Body" {...getFromName("body")} defaultValue={update && oldReview.body || ""} required aria-required={true} placeholder="Tell us about your thoughts on this product" multiline minRows={4} maxRows={8} />
            <Box>
                <Typography color="text.secondary">Enter Your rating</Typography>
                <Rating precision={0.5} max={5} name="rating" defaultValue={update ? oldReview.rating : 5} aria-required={true} />
                <Typography>{getFromName("rating").helperText}</Typography>
            </Box>
            <VariantSelect id="review-form-variant-select" variantState={variantState} variants={productValidVariants} inputProps={{ name: "variant" }}/>
            <Button variant="contained" fullWidth type="submit" startIcon={fetcher_loading && <Spinner />}>Submit</Button>
        </Stack>
    </fetcher.Form>
}

export function ChangeReviewDialog({ openState = useState(false), changeReviewProps={} }) {
    const [open, setOpen] = openState
    return <Box>
        <Dialog open={open} onClose={() => setOpen(false)}>
            <Paper sx={{ px: {xs: 4, sm: 4}, py: 3 }}>
                <ChangeReview {...changeReviewProps} />
            </Paper>
        </Dialog>
    </Box>
}