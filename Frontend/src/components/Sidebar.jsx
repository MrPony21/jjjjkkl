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
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountIcon from '@mui/icons-material/AccountCircleRounded';
import Toolbar from "@mui/material/Toolbar";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../logic/constants";
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';


const drawerWidth = 240;

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function SideBar(props) {
    let navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [progress, setProgress] = React.useState(10);
    const userRol = localStorage.getItem("rol");
    const userSpaceTier = localStorage.getItem("space_tier");
    const userSpace = parseInt(localStorage.getItem("space"));
    React.useEffect(() => {
        if (!userRol) {
            navigate("/login");
            return;
        }
        
        if (userRol != "cliente") {
            navigate("/login");
            return;
        }

    }, [userRol, navigate]);
    
    const handleLogout = async () => {


        try {
            const response = await fetch(`${apiURL}/files/colas`, {
                method: 'DELETE',
            });
    
            if (response.status != 200 ) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const result = await response.json();

        } catch (error) {
            console.error('Error al crear el archivo:', error);

        }

        localStorage.clear();
        navigate("/login");
    };

    const SIDEBAR_LINKS = [
        { id: 1, path: "/cloud", name: "Dashboard", icon: <DashboardIcon /> },
        { id: 2, path: "/cloud/usuario", name: "Mi Perfil", icon: <AccountIcon />, },
        { id: 3, path: "/cloud/papelera", name: "Papelera", icon: <DeleteIcon />, },
        { id: 4, path: "/cloud/ajustes", name: "Ajustes", icon: <BuildIcon />, },
        { id: 5, path: "/cloud/recientes", name: "Abiertos recientemente", icon: <FolderOpenRoundedIcon/>},
        { id: 6, path: "/cloud/subidos", name: "Subidos Recientemente", icon: <UploadFileRoundedIcon/>}
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
                    <ListItem key={5} disablePadding>
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
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" >
                            {userSpace}GB de {userSpaceTier}GB en Uso
                        </Typography>
                        <LinearProgressWithLabel value={userSpace} />
                    </Box>    
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

export default SideBar;
