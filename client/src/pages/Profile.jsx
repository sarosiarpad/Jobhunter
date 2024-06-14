import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetAllJobsQuery,
  useDeleteJobMutation,
  useModifyJobMutation
} from '../services/api';
import { 
  CircularProgress, Alert, Typography,
  Card, CardContent, Grid, Button, 
  Box, Stack, Pagination,
  TextField
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import JobseekerProfileExperience from '../components/JobseekerProfileExperience';
import CompanyProfileJobs from '../components/CompanyProfileJobs';

const Profile = () => {
  const user = useSelector((state) => state.user.userInfo);

  if (!user) {
    return (<Navigate to="/login" />);
  }

  if (user.role === "jobseeker") {
    return (
      <div>
        <Typography variant="h4" gutterBottom>Profile</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom mt={4}>Personal datas</Typography>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">Name:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>{user.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Email:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>{user.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Role:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>{user.role}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom mt={4}>Previous Experiences</Typography>
            <JobseekerProfileExperience />
          </Grid>
        </Grid>
      </div>
    );
  } else if (user.role === "company") {

    return (
      <div>
        <Typography variant="h4" gutterBottom>Profile</Typography>
        <CompanyProfileJobs />
      </div>
    );
  }
};

export default Profile;
