import { Box, Button, Menu, MenuItem,Toolbar } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useState } from "react";

interface Props {
  listName: string;
  onChange: (value: string) => void;
}

const BOOK_LISTS = [
  { label: "Hardcover Fiction", value: "hardcover-fiction" },
  { label: "Hardcover Nonfiction", value: "hardcover-nonfiction" },
  { label: "Paperback Trade Fiction", value: "trade-fiction-paperback" },
  { label: "Combined Print & E-Book Fiction", value: "combined-print-and-e-book-fiction" },
  { label: "Combined Print & E-Book Nonfiction", value: "combined-print-and-e-book-nonfiction" },
  { label: "Young Adult Hardcover", value: "young-adult-hardcover" },
  { label: "Children's Middle Grade Hardcover", value: "childrens-middle-grade-hardcover" },
];

export default function BooksCategoryDropdown({ listName, onChange }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentLabel =
    BOOK_LISTS.find((x) => x.value === listName)?.label || "Select Category";

  return (
    <>
    
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
        py: 1,
      }}
    >
      <Button
        variant="contained"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          bgcolor: "#c00707ff",
              color: "whitesmoke",
          fontWeight: "bold",
          borderRadius: "10px",
          display: "flex",
          gap: 1,
          px: 2,
        }}
      >
        <FilterAltIcon />
        {currentLabel}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            mt: 1,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onChange("hardcover-fiction");
          }}
        >
          All
        </MenuItem>

        {BOOK_LISTS.map((item) => (
          <MenuItem
            key={item.value}
            onClick={() => {
              setAnchorEl(null);
              onChange(item.value);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
    <Toolbar></Toolbar>
    </>
  );
}
