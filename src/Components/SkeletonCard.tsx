import { Card, CardContent, Skeleton } from "@mui/material";
import React from "react";
export default function SkeletonCard({
  width = "100%",
  height = 250,
  variant = "vertical", 
   sx = {},  
}) {
  return (
    <Card
      sx={{
        width,
        height,
        display: "flex",
        flexDirection: variant === "vertical" ? "column" : "row",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        ...sx,
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: variant === "vertical" ? "100%" : "45%",
          height: variant === "vertical" ? "60%" : "100%",
        }}
      />

      <CardContent sx={{ flex: 1 }}>
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width="90%" height={22} />
        <Skeleton variant="text" width="70%" height={22} />
      </CardContent>
    </Card>
  );
}
