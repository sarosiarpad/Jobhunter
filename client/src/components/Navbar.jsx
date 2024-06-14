import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../slices/userSlice';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("savedUser");
    dispatch(clearUser());
  };

  const pages = user?.userInfo ? (
    user.userInfo.role === "jobseeker" ? {
      "Home": {
        "name": "Home",
        "link": "/",
        "onClick": null
      },
      "profile": {
        "name": "Profile",
        "link": "/profile",
        "onClick": null
      },
      "logout": {
        "name": "Logout",
        "link": "/",
        "onClick": handleLogout
      }
    } : {
      "Home": {
        "name": "Home",
        "link": "/",
        "onClick": null
      },
      "profile": {
        "name": "Profile",
        "link": `/profile`,
        "onClick": null
      },
      "add-job": {
        "name": "Add Job",
        "link": "/add-job",
        "onClick": null
      },
      "logout": {
        "name": "Logout",
        "link": "/",
        "onClick": handleLogout
      }
    }
  ) : {
    "Home": {
        "name": "Home",
        "link": "/",
        "onClick": null
      },
    "signin": {
      "name": "Sign In",
      "link": "/login",
      "onClick": null
    },
    "signup": {
      "name": "Sign Up",
      "link": "/register",
      "onClick": null
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Jobhunter
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {Object.keys(pages).map((key) => (
              <Button
                key={key}
                component={Link}
                to={pages[key].link}
                onClick={pages[key].onClick}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {pages[key].name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
