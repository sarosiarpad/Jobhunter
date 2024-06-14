import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetJobByIdQuery, useApplyForJobMutation, useGetJobsForApplicantQuery, useRemoveApplicationMutation } from '../services/api';
import { CircularProgress, Alert, Typography, Button } from '@mui/material';
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

  const notify = () => {
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
  }

  const handleApply = async () => {
    try {
      await applyForJob({"jobId": parseInt(id)});
      notify();
      refetch();
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  }

  const handleUnapply = async () => {
    try {
      await removeApplication(id);
      notify("apply");
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

  if (user.userInfo.role === "jobseeker" && applied) {
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
            <Typography variant="h4">{job.position}</Typography>
            <Typography variant="h6">Company: {job.company}</Typography>
            <Typography variant="subtitle1">Salary: {job.salaryFrom} - {job.salaryTo} HUF</Typography>
            <Typography variant="body1">Type: {job.type}</Typography>
            <Typography variant="body1">Location: {job.city}</Typography>
            <Typography variant="body2">Description: {job.description}</Typography>
            <Button onClick={handleUnapply}>Unapply</Button>
          </>
        ) : (
          <Typography variant="h6">Job not found</Typography>
        )}
      </div>
    );
  } else if (user.userInfo.role === "jobseeker") {
    return (
      <div>
        {job ? (
          <>
            <Typography variant="h4">{job.position}</Typography>
            <Typography variant="h6">Company: {job.company}</Typography>
            <Typography variant="subtitle1">Salary: {job.salaryFrom} - {job.salaryTo} HUF</Typography>
            <Typography variant="body1">Type: {job.type}</Typography>
            <Typography variant="body1">Location: {job.city}</Typography>
            <Typography variant="body2">Description: {job.description}</Typography>
            <Button onClick={handleApply}>Apply</Button>
          </>
        ) : (
          <Typography variant="h6">Job not found</Typography>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {job ? (
          <>
            <Typography variant="h4">{job.position}</Typography>
            <Typography variant="h6">Company: {job.company}</Typography>
            <Typography variant="subtitle1">Salary: {job.salaryFrom} - {job.salaryTo} HUF</Typography>
            <Typography variant="body1">Type: {job.type}</Typography>
            <Typography variant="body1">Location: {job.city}</Typography>
            <Typography variant="body2">Description: {job.description}</Typography>
          </>
        ) : (
          <Typography variant="h6">Job not found</Typography>
        )}
      </div>
    );
  }
};

export default JobDetails;
