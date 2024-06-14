import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetJobByIdQuery, useApplyForJobMutation, useGetJobsForApplicantQuery, useRemoveApplicationMutation } from '../services/api';
import { CircularProgress, Alert, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  if (!user.token)
    return <Navigate to="/" />;

  const { data: job, jobError, jobIsLoading } = useGetJobByIdQuery(parseInt(id));
  const [applyForJob] = useApplyForJobMutation();
  const [removeApplication] = useRemoveApplicationMutation();
  
  const { data: appliedJobs, error: appliedJobsError, isLoading: appliedJobsIsLoading, refetch } = useGetJobsForApplicantQuery(user.userInfo.id);

  const applied = appliedJobs?.some((appliedJob) => appliedJob.jobId === parseInt(id));

  const handleApply = async () => {
    try {
      await applyForJob({"jobId": parseInt(id)});
      toast.success('Successfully applied to this job!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      refetch();
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  }

  const handleUnapply = async () => {
    try {
      await removeApplication(id);
      toast.info('Successfully unapplied from this job!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      refetch();
    } catch (error) {
      console.error('Failed to remove application:', error);
    }
  };

  if (!user?.userInfo) {
    return <Navigate to="/login" />;
  }

  if (jobIsLoading) return <CircularProgress />;
  if (jobError) return <Alert severity="error">Error fetching job: {jobError.message}</Alert>;

  if (appliedJobsIsLoading) return <CircularProgress />;
  if (appliedJobsError) return <Alert severity="error">Error fetching applied jobs: {appliedJobsError.message}</Alert>;

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {job ? (
        <>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">{job.position}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Company: {job.company}</Typography>                  
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Salary: {job.salaryFrom} - {job.salaryTo} HUF</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Type: {job.type}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Location: {job.city}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">Description: {job.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  {user.userInfo.role === "jobseeker" ? 
                    applied ? 
                      <Button variant="contained" color="primary" onClick={handleUnapply}>Unapplay</Button>
                    :
                    <Button variant="contained" color="success" onClick={handleApply}>Apply</Button>
                  :
                    ""
                  }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      ) : (
        <Typography variant="h6">Job not found</Typography>
      )}
    </div>
  );
};

export default JobDetails;
