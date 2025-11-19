import { Box, Typography, Stack, Divider } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        bgcolor: "#f5f5f5",
        borderTop: "1px solid #ddd",
        py: 3,
        px: { xs: 2, md: 6 },
      }}
    >
      <Stack
        spacing={2}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#c00707" }}
        >
          Newsly.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            px: { xs: 1, md: 10 },
          }}
        >
          Your personalized gateway to global news, powered by the New York Times API.
          Stay updated. Stay informed.
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography
          variant="caption"
          sx={{ color: "text.secondary" }}
        >
          © {new Date().getFullYear()} Newsly. All rights reserved.
        </Typography>
      </Stack>
    </Box>
  );
}
