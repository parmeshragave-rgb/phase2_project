import { AppBar, Toolbar, Typography, Button ,Box,Stack, colors} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#adafafff" }}>
      <Toolbar>
        
          <Box onClick={() => navigate("/")}>
              <Stack direction={"row"}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#c00707ff",
                    cursor: "pointer",
                  }}
                >
                  News
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "black",
                    cursor: "pointer",
                    
                  }}
                >
                  ly.
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1 }} >
              <Stack
              direction="row"
              spacing={2}
            
            >
        <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
        <Button color="inherit" onClick={() => navigate("/search")}>Articles</Button>
        <Button color="inherit" onClick={() => navigate("/sports")}>Sports</Button>
        <Button color="inherit" onClick={() => navigate("/technology")}>Technology</Button>
        <Button color="inherit" onClick={() => navigate("/bookmarks")}>Bookmarks</Button>
            </Stack>
            </Box>
 <Box sx={{ flexGrow: 1 }} >
  <Button sx={{bgcolor: "#c00707ff",color:"whitesmoke",fontWeight:"bold"}}>
    Subscribe
  </Button>
 </Box>


        

       
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
