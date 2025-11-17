import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Newsly
        </Typography>

        <Button color="inherit" >Home</Button>

        <Button color="inherit" >Politics</Button>
        <Button color="inherit" >Sports</Button>
        <Button color="inherit" >Technology</Button>

        <Button color="inherit" >Bookmarks</Button>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar