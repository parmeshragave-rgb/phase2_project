import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/reducers";
import { logout } from "../redux/actions/actions/authActions";
import NewsletterDialog from "./NewsletterDialog";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openNewsletter, setOpenNewsletter] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleClose();
    navigate("/");
  };

 
  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
      >
        Newsly
      </Typography>

      <Divider />

      <List>
        <ListItem
          button
          onClick={() => {
            navigate("/");
            setDrawerOpen(false);
          }}
        >
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            navigate("/search");
            setDrawerOpen(false);
          }}
        >
          <ListItemText primary="Articles" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            navigate("/books");
            setDrawerOpen(false);
          }}
        >
          <ListItemText primary="Books" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            navigate("/favorites");
            setDrawerOpen(false);
          }}
        >
          <ListItemText primary="Favorites" />
        </ListItem>

        <Divider sx={{ my: 2 }} />

        <ListItem
          button
          onClick={() => {
            setOpenNewsletter(true);
            setDrawerOpen(false);
          }}
        >
          <ListItemText primary="Subscribe" />
        </ListItem>

        {!isAuthenticated ? (
          <ListItem
            button
            onClick={() => {
              navigate("/login");
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Login / Sign Up" />
          </ListItem>
        ) : (
          <ListItem
            button
            onClick={() => {
              handleLogout();
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#adafafff" }}>
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
            <Stack direction="row" alignItems="center">
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#c00707ff" }}
              >
                News
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                ly.
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={5}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button color="inherit" onClick={() => navigate("/")} sx={{fontFamily:"sans-serif",fontWeight:"bold",fontSize:"15px",color:"black"}}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate("/search")} sx={{fontFamily:"sans-serif",fontWeight:"bold",fontSize:"15px",color:"black"}}>
            Article
            </Button>
            <Button color="inherit" onClick={() => navigate("/books")} sx={{fontFamily:"sans-serif",fontWeight:"bold",fontSize:"15px",color:"black"}}>
              Books
            </Button>
            <Button color="inherit" onClick={() => navigate("/favorites")} sx={{fontFamily:"sans-serif",fontWeight:"bold",fontSize:"15px",color:"black"}}>
              Favorites
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              sx={{
                bgcolor: "#c00707ff",
                color: "whitesmoke",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#a00505" },
              }}
              onClick={() => setOpenNewsletter(true)}
            >
              Subscribe
            </Button>

            {!isAuthenticated && (
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#c00707ff",
                  color: "#c00707ff",
                  fontWeight: "bold",
                  "&:hover": { borderColor: "#a00505", color: "#a00505" },
                }}
                onClick={() => navigate("/login")}
              >
                Login / Sign Up
              </Button>
            )}

            {isAuthenticated && (
              <>
                <IconButton onClick={handleAvatarClick}>
                  <Avatar src={user?.picture}>
                    {user?.username?.charAt(0)}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <MenuItem disabled>{user?.username}</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Stack>

          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawer}
      </Drawer>

      <NewsletterDialog
        open={openNewsletter}
        onClose={() => setOpenNewsletter(false)}
      />
    </>
  );
}
