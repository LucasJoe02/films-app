import {AppBar, Button, Grid, Toolbar, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import axios from "axios";
import AuthStore from "../store/authStore";

const Navbar = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL
    const token = AuthStore((state) => state.userToken);
    const setUserToken = AuthStore((state) => state.setUserToken);
    const setUserId = AuthStore((state) => state.setUserId);

    const handleLogout = () => {
        const header = {
            headers: {
                'X-Authorization': token
            }
        }
        axios.post(`${apiUrl}/users/logout`, null, header)
            .then(() => {
                setUserToken("")
                setUserId("0")
                navigate('/films')
            }).catch((error) => {
            console.log(error)
        })

    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item sx={{ flex: '1 1 33.33%'}}>
                        <Button component={Link} to="/" color="inherit">
                            Home
                        </Button>
                    </Grid>
                    <Grid item sx={{ flex: '1 1 33.33%'}}>
                        <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'center'}}>
                            Movie Central
                        </Typography>
                    </Grid>
                    <Grid item sx={{ flex: '1 1 33.33%'}}>
                        {token ? (
                            <>
                                <Button component={Link} to="/profile" color="inherit">
                                    View Profile
                                </Button>
                                <Button color="inherit" onClick={handleLogout} sx={{color: "red"}}>Logout</Button>
                            </>
                        ) : (
                            <Button component={Link} to="/login">
                                Login
                            </Button>
                        )}
                    </Grid>

                </Grid>




            </Toolbar>
        </AppBar>
    )
}

export default Navbar;