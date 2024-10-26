import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import AccountIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;


function SideBarAdmin(props) {
    let navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const userRol = localStorage.getItem("rol");
    React.useEffect(() => {
        if (!userRol) {
            navigate("/login");
            return;
        }

        if (userRol != "administrador") {
            navigate("/login");
            return;
        }
    }, [userRol, navigate]);
    
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
    const SIDEBAR_LINKS = [
        { id: 1, path: "/admin", name: "Mi Perfil", icon: <AccountIcon /> },
        { id: 2, path: "/admin/crear", name: "Crear Usuario", icon: <PersonAddIcon />, },
        { id: 3, path: "/admin/editar", name: "Modificar Cuenta", icon: <ManageAccountsIcon />, },
    ];

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {SIDEBAR_LINKS.map((link, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(link.path)}
                        >
                            <ListItemIcon>
                                {link.icon}
                            </ListItemIcon>
                            <ListItemText primary={link.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                    <ListItem key={4} disablePadding>
                        <ListItemButton
                            onClick={ handleLogout }
                        >
                            <ListItemIcon>
                                { <LogoutIcon /> }
                            </ListItemIcon>
                            <ListItemText primary={"Cerrar Sesion"} />
                        </ListItemButton>
                    </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        AYD - Storage
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default SideBarAdmin;
