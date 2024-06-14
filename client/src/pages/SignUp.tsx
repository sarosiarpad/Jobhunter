import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { Button, Box, Grid, TextField, Container, FormLabel, Radio, RadioGroup, Avatar, FormControlLabel, FormControl, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useAuthenticateUserMutation, useAddExperienceMutation } from '../services/api';
import { setUserInfo, setUserToken } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
  const [authenticateUser] = useAuthenticateUserMutation();
  const [addExperience] = useAddExperienceMutation();

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [password, setPassword] = useState("");
  const [experiences, setExperiences] = useState([{ position: "", time: "", companyname: "" }]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleExperienceChange = (index, event) => {
    const values = [...experiences];
    values[index][event.target.name] = event.target.value;
    setExperiences(values);
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, { position: "", time: "", companyname: "" }]);
  };

  const handleRemoveExperience = (index) => {
    const values = [...experiences];
    values.splice(index, 1);
    setExperiences(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: registerData } = await registerUser({ 
        email, 
        password, 
        fullname: name,
        role
      });
  
      if (registerData) {
        const { data: authData } = await authenticateUser({
          email: email,
          password: password,
          strategy: "local"
        });
  
        if(authData) {
          dispatch(setUserToken(authData.accessToken));
          dispatch(setUserInfo({
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.fullname,
            role: authData.user.role
          }));
  
          if (role === "jobseeker" && experiences.length > 0) {
            await Promise.all(experiences.map(async (experience) => {
              if(experience.companyname && experience.position && experience.time){
                await addExperience({
                  company: experience.companyname,
                  title: experience.position,
                  interval: experience.time
                });
              }
            }));
          }
  
          navigate("/");
        }
      }
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="firstName"
                  label="Full Name"
                  autoFocus
                  onChange={handleNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Account Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="account-type-label"
                    name="account-type"
                    value={role}
                    onChange={handleRoleChange}
                  >
                    <FormControlLabel value="jobseeker" control={<Radio />} label="Jobseeker" />
                    <FormControlLabel value="company" control={<Radio />} label="Company" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {role === "jobseeker" && (
                <Grid item xs={12}>
                  <Typography component="h6" variant="h6">
                    Experience
                  </Typography>
                  {experiences.map((experience, index) => (
                    <Card sx={{ mt: 2, mb: 2 }} key={index}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              required
                              fullWidth
                              name="time"
                              label="Time"
                              value={experience.time}
                              onChange={(event) => handleExperienceChange(index, event)}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              required
                              fullWidth
                              name="companyname"
                              label="Company"
                              value={experience.companyname}
                              onChange={(event) => handleExperienceChange(index, event)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              required
                              fullWidth
                              name="position"
                              label="Position"
                              value={experience.position}
                              onChange={(event) => handleExperienceChange(index, event)}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <IconButton color="secondary" onClick={() => handleRemoveExperience(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddExperience}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Add Experience
                  </Button>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
