import { useState, useEffect } from "react";
import { 
    useDeleteJobMutation, 
    useModifyJobMutation, 
    useGetAllJobsQuery,
    useGetApplicantsForJobQuery 
} from "../services/api";
import { 
    CircularProgress, Alert, Grid, 
    Card, CardContent, Typography, 
    Button, Stack, Pagination,
    TextField, Box, FormControl,
    InputLabel, Select, Checkbox,
    MenuItem, FormControlLabel, Modal
} from "@mui/material";
import { useSelector } from "react-redux";

const CompanyProfileJobs = () => {
    const user = useSelector((state) => state.user.userInfo);

    const [editJobId, setEditJobId] = useState(null);
    const [editedJob, setEditedJob] = useState({});
    const [selectedJobId, setSelectedJobId] = useState(null);

    const [deleteJob] = useDeleteJobMutation();
    const [modifyJob] = useModifyJobMutation();

    const [page, setPage] = useState(1);
    const [modalState, setModalState] = useState(false);
    const [applicantsForJob, setApplicantsForJob] = useState([]);

    const { data: jobs, error, isLoading, refetch } = useGetAllJobsQuery(`userId=${user.id}&$limit=6&$skip=${(page - 1) * 6}`);
    const { data: applicantsData } = useGetApplicantsForJobQuery(selectedJobId);

    useEffect(() => {
        if (applicantsData) {
            setApplicantsForJob(applicantsData);
        }
    }, [applicantsData]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleModalOpen = () => { setModalState(true); }
    const handleModalClose = () => { setModalState(false); }

    const handleJobChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedJob((prevState) => ({
          ...prevState,
          [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleModifyJob = (job) => {
        setEditJobId(job.id);
        setEditedJob(job);
    };

    const handleCancelJobEdit = () => {
        setEditJobId(null);
        setEditedJob({});
    };

    const handleJobModifySubmit = async () => {
        await modifyJob({ 
            id: editJobId,
            jobData: {
                "company": editedJob.company,
                "position": editedJob.position,
                "description": editedJob.description,
                "salaryFrom": parseInt(editedJob.salaryFrom), 
                "salaryTo": parseInt(editedJob.salaryTo),
                "type": editedJob.type,
                "city": editedJob.city,
                "homeOffice": !!editedJob.homeOffice
            }
         })
          .then((response) => {
            if (response) {
              handleCancelJobEdit();
              refetch();
            }
          })
          .catch((error) => {
            console.error("Failed to modify job.", error);
          });
    };
    
    const handleDeleteJob = async (jobId) => {
        await deleteJob(jobId)
          .then((response) => {
            if (response) {
              handleCancelJobEdit();
              refetch();
            }
          })
          .catch((error) => {
            console.error("Failed to delete job.", error);
          });
    };

    const handleWatchJob = (jobId) => {
        setSelectedJobId(jobId);
        handleModalOpen();
    }

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error fetching jobs: {error.message}</Alert>;
    
    return ( 
        <Grid container spacing={2} >
            <Grid item xs={12} >
                <Stack>
                    <Pagination count={Math.ceil(jobs.total / 6)} page={page} onChange={handlePageChange} color="primary" />
                </Stack>
            </Grid>
            <Grid container spacing={1}>
                {jobs.data.map((job) => (
                    <Grid item xs={6} key={job.id}>
                        {editJobId === job.id ? (
                            <Card>
                                <CardContent>  
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="position"
                                                label="Position"
                                                value={editedJob.position}
                                                onChange={handleJobChange}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="company"
                                                label="Company"
                                                value={editedJob.company}
                                                onChange={handleJobChange}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="city"
                                                label="Location"
                                                value={editedJob.city}
                                                onChange={handleJobChange}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="salaryFrom"
                                                label="Salary From"
                                                type="number"
                                                value={editedJob.salaryFrom}
                                                onChange={handleJobChange}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="salaryTo"
                                                label="Salary To"
                                                type="number"
                                                value={editedJob.salaryTo}
                                                onChange={handleJobChange}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth required>
                                                <InputLabel>Type</InputLabel>
                                                <Select
                                                    name="type"
                                                    label="Type"
                                                    value={editedJob.type}
                                                    onChange={handleJobChange}
                                                >
                                                    <MenuItem value="full-time">Full time</MenuItem>
                                                    <MenuItem value="part-time">Part time</MenuItem>
                                                    <MenuItem value="internship">Internship</MenuItem>
                                                    <MenuItem value="contract">Contract</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="homeOffice"
                                                        checked={!!editedJob.homeOffice}
                                                        onChange={handleJobChange}
                                                    />
                                                }
                                                label="Home office"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Button variant="contained" color="secondary" onClick={handleJobModifySubmit}>Save</Button>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button variant="contained" color="error" onClick={handleCancelJobEdit}>Cancel</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{job.position}</Typography>
                                    <Typography variant="body2">Company: {job.company}</Typography>
                                    <Typography variant="body2">Location: {job.city}</Typography>
                                    <Typography variant="body2">Salary: {job.salaryFrom} - {job.salaryTo}</Typography>
                                    <Typography variant="body2">Type: {job.type}</Typography>
                                    <Typography variant="body2">Home office: {job.homeOffice ? 'Yes' : 'No'}</Typography>
                                    <Box mt={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Button variant="contained" color="secondary" onClick={() => handleModifyJob(job)}>Modify</Button>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Button variant="contained" color="primary" onClick={() => handleWatchJob(job.id)}>Watch</Button>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Button variant="contained" color="error" onClick={() => handleDeleteJob(job.id)}>Delete</Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                ))}
            </Grid>
            <Modal
                open={modalState}
                onClose={handleModalClose}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 1,
                    scrollBehavior: "smooth"
                }}>
                    <Grid container spacing={3}>
                        {applicantsForJob.map((data) => (
                            <Grid item xs={12} md={6} key={data.user.id}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">Name:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant='h6'>{data.user.fullname}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">Email:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant='h6'>{data.user.email}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant='h6'>Role:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant='h6'>{data.user.role}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button onClick={(handleModalClose)} variant="contained" color="primary">Back</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
    );
}

export default CompanyProfileJobs;
