

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewsletterDialog({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubscribe = () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    // SUCCESS
    setSuccess("You have successfully subscribed!");
    setEmail("");

    // You can also store in API/localStorage/etc
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Subscribe to our Newsletter</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />

        {success && (
          <Typography color="green" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#c00707ff", color: "white" }}
          onClick={handleSubscribe}
        >
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
}
