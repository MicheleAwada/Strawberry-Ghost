import DarkLogo from "../assets/components/header/logo dark.svg?react";
import LightLogo from "../assets/components/header/logo light.svg?react";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import SignUpIcon from '@mui/icons-material/PersonAdd';

import { Link as ReactRouterLink } from "react-router-dom"
import { UserContext } from "./user";

const pages = [{name: "Home", link: "/"}, {name: "Products", link: "/products"}, {name: "Contact us", link: "/contact"}];
const authenticatedSettings = [
	{ name: "Account", icon: <AccountCircleIcon />, link: "/account", isDivider: false },
	{ name: "Cart", icon: <ShoppingCartIcon />, link: "/cart", isDivider: false },
	{ name: "Orders", icon: <ReceiptLongIcon />, link: "/orders", isDivider: false },
	{ name: null, icon: null, link: null, isDivider: true },
	{ name: "Logout", icon: <LogoutIcon />, link: "/logout", isDivider: false }
  ];
const unAuthenticatedSettings = [
	{ name: "Login", icon: <LoginIcon />, link: "/login", isDivider: false },
	{ name: "Register", icon: <SignUpIcon />, link: "/signup", isDivider: false }
  ];

export default function Header() {
	const [user] = React.useContext(UserContext)

	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const headerRef = React.useRef()
	const fakeHeaderRef = React.useRef()

	React.useEffect(() => {
		const height =  headerRef.current.clientHeight
		fakeHeaderRef.current.style.height = `${height}px`
	}, [])

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};


	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const settings = user.is_authenticated ? authenticatedSettings : unAuthenticatedSettings
	return (
		<>
			<AppBar ref={headerRef} position="fixed" sx={{borderRadius: "0 0 1rem 1rem"}}>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								height: "2.5rem",
								width: "auto",
								mr: 3,
							}}
						>
							<ReactRouterLink to="/" style={{ height: "100%", width: "auto" }}>
								<DarkLogo style={{ height: "100%", width: "auto" }} />
							</ReactRouterLink>
						</Box>
						<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
							<IconButton
								sie="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									<MenuItem key={page.name} onClick={handleCloseNavMenu} component={ReactRouterLink} to={page.link}>
										<Typography textAlign="center">{page.name}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<Box
							sx={{
								display: { xs: "flex", md: "none" },
								height: "2.5rem",
								width: "auto",
								mr: 3,
							}}
						>
							<ReactRouterLink to="/" style={{ height: "100%", width: "auto" }}>
								<DarkLogo style={{ height: "100%", width: "auto" }} />
							</ReactRouterLink>
						</Box>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button
									key={page.name}
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: "white", display: "block" }}
									LinkComponent={ReactRouterLink}
									to={page.link}
								>
									{page.name}
								</Button>
							))}
						</Box>
						<Stack flexDirection="row" gap={2} sx={{ flexGrow: 0, mr: {md: "1rem", lg: "2rem"} }}>
							<Box>
								<Tooltip title="Go To cart">
									<IconButton LinkComponent={ReactRouterLink} to="/cart" size="large" color="inherit" sx={{ p: 0 }} aria-label="go to cart">
										<ShoppingCartIcon sx={{ width: { md: "2rem", lg: "2.5rem" }, height: { md: "2rem", lg: "2.5rem" } }} />
									</IconButton>
								</Tooltip>
							</Box>
							<Box>
								<Tooltip title="Open settings">
									<IconButton color="inherit" onClick={handleOpenUserMenu} size="large" sx={{ height: "100%", p: 0 }} aria-label="account of current user">
										<AccountCircleIcon sx={{ width: { md: "2rem", lg: "2.5rem" }, height: { md: "2rem", lg: "2.5rem" } }} />
									</IconButton>
								</Tooltip>
								<Menu
									anchorEl={anchorElUser}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>	
								{settings.map(({name, icon, link, isDivider}, index) => (
									isDivider ? <Divider key={index} /> : <MenuItem key={index} onClick={handleCloseUserMenu} component={ReactRouterLink} href={link} to={link} >
										<ListItemIcon>
											{icon}
										</ListItemIcon>
										{name}
									</MenuItem>
								))}
								</Menu>
							</Box>
						</Stack>
					</Toolbar>
				</Container>
			</AppBar>
			<Box ref={fakeHeaderRef} sx={{ bgcolor: "transparent", borderRadius: "0 0 1rem 1rem", visibility: "hidden" }}>
			</Box>
		</>
		
	);
}
