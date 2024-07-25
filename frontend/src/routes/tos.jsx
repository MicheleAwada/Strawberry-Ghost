import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import tosText from "../assets/routes/tos/tos.txt?raw"

export default function TOS() {
    let stuff;
    try {
        stuff = (<Container maxWidth="lg" sx={{boxSizing: "border-box", px: {xs: 2, sm: 4, md: 8}, py: "2rem"}}>
            <Typography variant="h2" sx={{textAlign: "center"}}>Terms of Service Agreement</Typography>
            <br />
            <Typography variant="h3">This Terms of Service Agreement ("Agreement") is a legal agreement between you ("User") and Strawberry Ghost ("Company") governing the use of the Strawberry Ghost website ("Website"). By accessing or using the Website, you agree to be bound by the terms and conditions of this Agreement.</Typography>
            <br />
            <br />
            <br />
            <br />
            <Box>   
                <Typography variant="h3">
                    1. Acceptance of Terms
                </Typography>
                <Typography variant="body1">
                    By accessing or using the Website, you agree to be bound by the terms and conditions of this Agreement. If you do not agree with any part of this Agreement, you may not access or use the Website.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    2. Use of the Website
                </Typography>
                <Typography variant="body1">
                    The Website is provided for your personal, non-commercial use only. You may not use the Website for any illegal or unauthorized purpose. You agree to comply with all applicable laws and regulations regarding your use of the Website.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    3. Account Registration
                </Typography>
                <Typography variant="body1">
                    In order to access certain features of the Website, you may be required to create an account. You agree to provide accurate and complete information when creating an account and to update your information as necessary to keep it accurate and current. You are responsible for maintaining the security of your account credentials and for any activities that occur under your account.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    4. Orders and Purchases
                </Typography>
                <Typography variant="body1">
                    By placing an order through the Website, you agree to pay all charges incurred for the order, including any applicable taxes, fees, and shipping costs. You agree to provide accurate and complete billing information and to update your information as necessary to keep it accurate and current. Orders are subject to acceptance by the Company and may be canceled or refused at any time.
                    and
                    When checking out, you agree to verify and acknowledge any adjustments to your cart, even if prompted by potential errors such as a product deletion necessitating the removal of a corresponding item from your cart.
                    and
                    You agree that you are the rightful holder or possess the necessary authorization for any credit methods utilized.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    5. Intellectual Property
                </Typography>
                <Typography variant="body1">
                    The Website and its content, including text, graphics, images, logos, and software, are the property of the Company and are protected by copyright and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of the Website or its content without the Company's prior written consent.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    6. Privacy Policy
                </Typography>
                <Typography variant="body1">
                    Your use of the Website is subject to the Company's Privacy Policy, which is incorporated into this Agreement by reference. By using the Website, you consent to the collection, use, and disclosure of your personal information as described in the Privacy Policy. When reviewing a product you also consent to the collection, use, and disclosure of your personal information as described in the Privacy Policy.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    7. Disclaimer of Warranties
                </Typography>
                <Typography variant="body1">
                    THE WEBSITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, THE COMPANY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    8. Limitation of Liability
                </Typography>
                <Typography variant="body1">
                    UNDER NO CIRCUMSTANCES SHALL THE COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF THE WEBSITE.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    9. Indemnification
                </Typography>
                <Typography variant="body1">
                    You agree to indemnify and hold the Company harmless from any claims, damages, losses, or liabilities arising from your use of the Website, including any violation of this Agreement.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    10. Termination
                </Typography>
                <Typography variant="body1">
                    The Company may terminate or suspend your access to the Website at any time, with or without cause, and with or without notice. Upon termination, your right to use the Website will immediately cease.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    11. Modifications to the Agreement
                </Typography>
                <Typography variant="body1">
                    The Company reserves the right to modify or update this Agreement at any time, with or without prior notice. Your continued use of the Website after any such modifications or updates shall constitute your acceptance of the revised Agreement.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    12. Governing Law and Jurisdiction
                </Typography>
                <Typography variant="body1">
                    This Agreement shall be governed by and construed in accordance with the laws of France. Any dispute arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the courts of France.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    13. Severability
                </Typography>
                <Typography variant="body1">
                    If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    14. Accounts and Security
                </Typography>
                <Typography variant="body1">
                    You agree that you are the withholder of the account or have permission to use this account when browsing this site
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    15. Stripe
                </Typography>
                <Typography variant="body1">
                    By using our services, you also consent to abide by Stripe's Privacy Policy and Terms of Service when proceeding with any checkout transactions.
                </Typography>
            </Box>
            <Box>
                <Typography variant="h3">
                    16. Contact Information
                </Typography>
                <Typography variant="body1">
                    If you have any questions or concerns about this Agreement, please contact us at info@strawberryghost.org  .
                </Typography>
            </Box>
        </Container>)
    }
    catch (e) {
        return (
            <p>Something went wrong however that does not consitute to this TOS being invalid, if this error occured than do not use out site and optionally contact us about the issue at info@strawberryghost.org </p>
        )
    }
    return stuff
}