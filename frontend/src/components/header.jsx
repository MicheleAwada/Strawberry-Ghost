import DarkLogo from "../assets/components/header/logo dark.svg?react";
import LightLogo from "../assets/components/header/logo light.svg?react";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import useMediaQuery from "@mui/material/useMediaQuery";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import SignUpIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';

import { Link as ReactRouterLink, Form, useNavigate, useLocation, useParams } from "react-router-dom"
import { UserContext } from "./user";
import { toSearchString } from "../routes/search";
import { SearchQueryContext } from "../routes/searchValue";

const pages = [{name: "Home", link: "/"}, {name: "Contact us", link: "/contact"}];
const adminPage = [{name: "Admin", link: "/admin"}];
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

export const HeaderHeightContext = React.createContext([0, () => {}]);

export function HeaderHeightProvider({ children }) {
	const [headerHeight, setHeaderHeight] = React.useState(0)
	return (
		<HeaderHeightContext.Provider value={[headerHeight, setHeaderHeight]}>
			{children}
		</HeaderHeightContext.Provider>
	)
}

export default function Header() {
	const navigate = useNavigate()
	const params = useParams()

	const [user] = React.useContext(UserContext)

	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const headerRef = React.useRef(null )
	const fakeHeaderRef = React.useRef(null)

	const [headerHeight, setHeaderHeight] = React.useContext(HeaderHeightContext)

	function handleHeaderHeightOnResize() {
		if (headerRef.current === null || fakeHeaderRef.current === null) return
		const height =  headerRef.current.clientHeight
		fakeHeaderRef.current.style.height = `${height}px`
		setHeaderHeight(height)
	}

	React.useEffect(() => {
		handleHeaderHeightOnResize()
		window.addEventListener("resize", handleHeaderHeightOnResize)

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

	const newPages = user?.is_staff ? [...pages, ...adminPage] : pages
	const settings = user.is_authenticated ? authenticatedSettings : unAuthenticatedSettings

	function Logo({ sx, ...props}) {
		return <Box
		sx={{
			height: "2.5rem",
			width: "auto",
			...sx
		}}
		{...props}
	>
		<ReactRouterLink to="/" style={{ height: "100%", width: "auto" }}>
			<DarkLogo style={{ height: "100%", width: "auto" }} />
		</ReactRouterLink>
	</Box>
	}

	const isSm = useMediaQuery(theme => theme.breakpoints.up('sm'))

	function SearchBar() {
		const [query, setQuery] = React.useContext(SearchQueryContext)
		function onChangeSearchBar(e) {
			const value = e.target.value
			setQuery(value)
		}
		return <Stack component={Form} onSubmit={(e)  => {
					e.preventDefault()
					const query = e.target.search.value
					if (!query) {return}
					navigate(toSearchString(query))
				}} direction="row" sx={{ px: {xs: "0.5rem", md: "1rem", }, boxSizing: "border-box", borderRadius: "0.5rem", width: "100%", bgcolor: 'white', }}>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder={isSm ? "Search StrawBerry Ghost" : "Search"}
						name="search"
						value={query}
						onChange={onChangeSearchBar}
						inputProps={{ 'aria-label': 'search google maps', bgcolor: "white" }}
					/>
					<IconButton type="sumbit" sx={{ p: '10px' }} aria-label="search">
						<SearchIcon color="white" />
					</IconButton>
				</Stack>
	}

	const pathname = useLocation().pathname

	function pathEquals(path) {
		return pathname === path || pathname === `${path}/`
	}

	function currentPage() {
		if (pathEquals("")) {
			return 0
		} else if (pathEquals("/login") && !user.is_authenticated) {
			return 1
		} else if (pathEquals("/signup") && !user.is_authenticated) {
			return 2
		} else if (pathEquals("/cart") && user.is_authenticated) {
			return 1
		} else if (pathEquals("/account") && user.is_authenticated) {
			return 2
		}
	}
	function navigatePage(pagenumber) {
		if (pagenumber === 0) {
			navigate("/")
		}
		if (user.is_authenticated) {
			if (pagenumber === 1) {
				navigate("/cart")
			}
			if (pagenumber === 2) {
				navigate("/account")
			}
		} else {
			if (pagenumber === 1) {
				navigate("/login")
			}
			if (pagenumber === 2) {
				navigate("/signup")
			}
		}
	}


	return (
		<>
			<Paper elevation={14} sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10000, display: {xs: "block", md: "none"} }}>
				<BottomNavigation
					showLabels
					value={currentPage()}
					onChange={(_, newValue) => {
						navigatePage(newValue)
					}}
				>
					<BottomNavigationAction label="Home" icon={<HomeIcon />} />
					{user.is_authenticated ?
							[<BottomNavigationAction label="Cart" icon={<ShoppingCartIcon />} key={1} />,
							<BottomNavigationAction label="Account" icon={<AccountCircleIcon />} key={2} />]
					:
						[<BottomNavigationAction label="Login" icon={<LoginIcon />}    key={1} />,
						<BottomNavigationAction label="Register" icon={<SignUpIcon />} key={2} />]
						}
				</BottomNavigation>
			</Paper>
			<AppBar ref={headerRef} position="fixed" color="primary" sx={{borderRadius: "0 0 0 0"}}>
				<Box  sx={{ bgcolor: "primary.dark" }}>
					<Container maxWidth="md" sx={{ px: {xs: "1rem", sm: "2rem"}}}>
						<Toolbar disableGutters>
							<SearchBar />
						</Toolbar>
					</Container>
				</Box>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Logo sx={{display: { xs: "none", md: "flex" }, mr: 3}} />
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
								{newPages.map((page) => (
									<MenuItem key={page.name} onClick={handleCloseNavMenu} component={ReactRouterLink} to={page.link}>
										<Typography textAlign="center">{page.name}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<Logo sx={{display: { xs: "flex", md: "none" }, mr: 2, }} />
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{newPages.map((page) => (
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
							<Box sx={{ display: { xs: "none", sm: "block" } }}>
								<Tooltip title="Go To cart">
									<IconButton LinkComponent={ReactRouterLink} to="/cart" size="large" color="inherit" sx={{ p: 0 }} aria-label="go to cart">
										<Badge badgeContent={user?.cartitem_set?.length || 0} color="info">
											<ShoppingCartIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
										</Badge>
									</IconButton>
								</Tooltip>
							</Box>
							<Box>
								<Tooltip title="Open settings">
									<IconButton color="inherit" onClick={handleOpenUserMenu} size="large" sx={{ height: "100%", p: 0 }} aria-label="account of current user">
										<Avatar src={user?.avatar || null} sx={{ width: { md: "2rem", lg: "2.5rem" }, height: { md: "2rem", lg: "2.5rem" } }} />
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
			<Box ref={fakeHeaderRef} sx={{ bgcolor: "transparent", opacity: 0, visibility: "hidden" }}>
			</Box>
		</>
		
	);
}
