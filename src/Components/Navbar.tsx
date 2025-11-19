import React, { useEffect, useState } from "react";
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

import type { RootState } from "../redux/index";
import { logout } from "../redux/auth/authActions";
import NewsletterDialog from "./NewsletterDialog";
import { setSubscribed } from "../redux/subscription/subscriptionActions";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const isSubscribed = useSelector((s: RootState) => s.subscription.subscribed);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openNewsletter, setOpenNewsletter] = useState(false);

  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  
  const [dateTime, setDateTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAvatarClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/");
  };

 
  const handleSubscribeButton = () => {
    if (isSubscribed) {
    
      dispatch(setSubscribed(false));
      return;
    }
 
    setOpenNewsletter(true);
  };

  const handleSubscribedSuccess = () => {
    dispatch(setSubscribed(true));
    setOpenNewsletter(false);
  };

  
  const drawer = (
    <Box sx={{ width: 260, p: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 1, textAlign: "center", color: "#c00707" }}
      >
        Newsly
      </Typography>

      <Divider />

      <List>
        {[
          { label: "Home", to: "/" },
          { label: "Articles", to: "/search" },
          { label: "Books", to: "/books" },
          { label: "Favorites", to: "/favorites" },
        ].map((item) => (
          <ListItem
      
            key={item.to}
            onClick={() => {
              navigate(item.to);
              setDrawerOpen(false);
            }}
            sx={{ cursor: "pointer" }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        <ListItem
          onClick={() => {
            handleSubscribeButton();
            setDrawerOpen(false);
          }}
          sx={{ cursor: "pointer" }}
        >
          <ListItemText
            primary={isSubscribed ? "Unsubscribe" : "Subscribe"}
          />
        </ListItem>

        {!isAuthenticated ? (
          <ListItem
            onClick={() => {
              navigate("/login");
              setDrawerOpen(false);
            }}
            sx={{ cursor: "pointer" }}
          >
            <ListItemText primary="Login / Sign Up" />
          </ListItem>
        ) : (
          <ListItem
            onClick={() => {
              handleLogout();
              setDrawerOpen(false);
            }}
            sx={{ cursor: "pointer" }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "black",
          borderBottom: "1px solid #ddd",
          height: "65px",
          justifyContent: "center",
          
        }}
      >
        <Toolbar sx={{ display: "flex" }}>
        
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              display: { xs: "none", md: "block" },
            }}
          >
            {dateTime}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          
          <Box
            sx={{
              cursor: "pointer",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onClick={() => navigate("/")}
          >
            <Stack direction="row" alignItems="center">
              <Typography
                variant="h4"
                sx={{ fontWeight: "900", color: "#c00707" }}
              >
                News
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "900" }}>
                ly.
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              sx={{
                bgcolor: isSubscribed ? "gray" : "#c00707",
                color: "white",
                px: 2,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#a00505" },
              }}
              onClick={handleSubscribeButton}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>

            {!isAuthenticated && (
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#c00707",
                  color: "#c00707",
                  fontWeight: "bold",
                  "&:hover": { borderColor: "#a00505", color: "#a00505" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
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
                  sx={{zIndex:2000}}
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

      
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: "65px",
          bgcolor: "black",
          height: "45px",
          justifyContent: "center",
          zIndex: 1999,
        }}
      >
        <Toolbar
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 4,
          }}
        >
          {[
            { label: "Home", to: "/" },
            { label: "Articles", to: "/search" },
            { label: "Books", to: "/books" },
            { label: "Favorites", to: "/favorites" },
          ].map((item) => (
            <Typography
              key={item.to}
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </Typography>
          ))}
        </Toolbar>
      </AppBar>

  
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{zIndex: 2000}}>
        {drawer}
      </Drawer>

    
      <NewsletterDialog
        open={openNewsletter}
        onClose={() => setOpenNewsletter(false)}
        onSuccess={handleSubscribedSuccess}
      />

      
      <Box sx={{ height: "110px" }} />
    </>
  );
}
