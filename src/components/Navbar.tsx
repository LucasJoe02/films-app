import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean}) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Button component={Link} to="/" color="inherit">
                    Home
                </Button>
                <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'center'}}>
                    Movie Central
                </Typography>

                {isLoggedIn ? (
                    <>
                        <Button component={Link} to="/profile" color="inherit">
                            View Profile
                        </Button>
                        <Button color="inherit">Logout</Button>
                    </>
                ) : (
                    <Button component={Link} to="/login" color="inherit">
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;