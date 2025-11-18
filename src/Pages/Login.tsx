
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/actions/actions/authActions";
import type { User } from "../models/Auth";

interface DecodedToken {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) newErrors.username = "Username required";
    if (!password.trim()) newErrors.password = "Password required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 chars";

    if (!isLogin) {
      if (!email.trim()) newErrors.email = "Email required";
      else if (!/\S+@\S+\.\S+/.test(email))
        newErrors.email = "Invalid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (!user) {
      setMessage("Invalid username or password!");
      return;
    }

    const reduxUser: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture || "",
    };

    dispatch(loginSuccess(reduxUser, "local-token"));
    localStorage.setItem("token", "true");
    localStorage.setItem("loggedInUser", JSON.stringify(reduxUser));

    navigate("/");
  };

  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const reduxUser: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      picture: "",
    };

    dispatch(loginSuccess(reduxUser, "local-token"));
    localStorage.setItem("token", "true");

    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLogin) handleLocalLogin();
    else handleSignup();
  };

  const handleGoogleSuccess = (res: any) => {
    const token = res.credential;
    const decoded: DecodedToken = jwtDecode(token);

    const user: User = {
      username: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      id: decoded.sub,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    dispatch(loginSuccess(user, token));
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #ece9e6, #ffffff)",
      }}
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          {isLogin ? "Login" : "Sign Up"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {!isLogin && (
              <TextField
                label="Email"
                value={email}
                error={!!errors.email}
                helperText={errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            <TextField
              label="Username"
              value={username}
              error={!!errors.username}
              helperText={errors.username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              error={!!errors.password}
              helperText={errors.password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="contained" color="error">
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <Typography textAlign="center">OR</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  width="100%"
                  theme="outline"
                  size="large"
                  type="standard"
                  shape="rectangular"
                  
                />
              </Box>

            
          </Stack>
        </form>

        <Typography
          sx={{ mt: 2, cursor: "pointer" }}
          onClick={() => setIsLogin(!isLogin)}
          textAlign="center"
          color="error"
        >
          {isLogin ? "New user? Sign up" : "Already have an account?"}
        </Typography>

        {message && <Typography>{message}</Typography>}
      </Paper>
    </Box>
  );
}
