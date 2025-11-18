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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/reducers";
import { logout } from "../redux/actions/actions/authActions";
import NewsletterDialog from "./NewsletterDialog";


export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openNewsletter, setOpenNewsletter] = useState(false);

  // Auth state from Redux
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Avatar menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#adafafff" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>

        {/* LOGO */}
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

        <Stack direction="row" spacing={2} alignItems="center">
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/search")}>Articles</Button>
          <Button color="inherit" onClick={() => navigate("/books")}>Books</Button>
         <Button color="inherit" onClick={() => navigate("/favorites")}>Favorites</Button>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

    
        <Stack direction="row" spacing={2} alignItems="center">

    
          
          <Button
            sx={{
              bgcolor: "#c00707ff",
              color: "whitesmoke",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#a00505" }
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
                "&:hover": { borderColor: "#a00505", color: "#a00505" }
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
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <MenuItem disabled>
                  {user?.username}
                </MenuItem>

                

                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>
      <NewsletterDialog
        open={openNewsletter}
        onClose={() => setOpenNewsletter(false)}
      />
    </AppBar>
  );
}
