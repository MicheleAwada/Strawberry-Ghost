import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

import LogoutIcon from '@mui/icons-material/Logout';

import { Link as ReactRouterLink } from 'react-router-dom';
import React, { useContext } from 'react';
import { UserContext } from '../components/user';

export default function Account() {
    const [user] = useContext(UserContext)
    const [isAuthenticated, setIsAuthenticated] = React.useState(true)
    React.useEffect(() => {
        setIsAuthenticated(user.is_authenticated)
    }, [user])

    function DividedContents({children}) {
        const contents = React.Children.toArray(children)
        return <Stack spacing={2} sx={{ py: 6, px: {xs: 1, sm: 8} }} alignItems="flex-start">
            {contents.map((element, index) => (<React.Fragment key={index}>{element}{(index!==(contents.length-1)) && <Divider flexItem />}</React.Fragment>))}
        </Stack>
    }

    if (!isAuthenticated) {
        return <Typography variant='h3' sx={{ textAlign: "center", py: 6 }}>
            You must be logged in to change your password
        </Typography>
    }

    return <DividedContents>
        <Typography variant="h3">Account Details</Typography>
        <Link variant='body1' component={ReactRouterLink} to="/orders">View Orders</Link>
        <Link variant='body1' component={ReactRouterLink} to="/cart">View Cart</Link>
        <Link variant='body1' component={ReactRouterLink} to="/account/change_account_info">Change Details</Link>
        <Link variant='body1' component={ReactRouterLink} to="/account/change_email">Change Email</Link>
        <Link variant='body1' component={ReactRouterLink} to="/account/change_password">Change Password</Link>
        <Link variant='body1' component={ReactRouterLink} to="/account/delete_account">Delete Account</Link>
        <Button variant='text' LinkComponent={ReactRouterLink} to="/logout" startIcon={<LogoutIcon />}>Logout</Button>
    </DividedContents>
}