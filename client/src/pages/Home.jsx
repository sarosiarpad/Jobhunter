import React, { useState, useEffect } from "react";
import { 
    Grid, CircularProgress, Alert, 
    Slider, Checkbox, FormControlLabel, 
    TextField, FormControl, FormLabel, 
    FormGroup, RadioGroup, Radio, 
    Button, Typography, Card, 
    CardContent
 } from "@mui/material";
import { useGetAllJobsQuery } from "../services/api";
import { useSelector } from "react-redux";
import JobCard from "../components/JobCard";

const Home = () => {
    const user = useSelector((state) => state.user);
    
    const [salary, setSalary] = useState([0, 10000000]);
    const [jobType, setJobType] = useState("full-time");
    const [location, setLocation] = useState("");
    const [homeOffice, setHomeOffice] = useState(false);
    const [limit, setLimit] = useState(9);

    const query = 
        `$limit=${limit}` +
        `&salaryFrom[$gt]=${parseInt(salary[0])}` +
        `&salaryTo[$lt]=${parseInt(salary[1])}` +
        `&type=${jobType}` +
        `&homeOffice=${homeOffice}` +
        (location ? `&city=${location}` : "");
        
    const { data: jobs, error, isLoading, refetch } = useGetAllJobsQuery(query);

    useEffect(() => {
        refetch();
    }, [salary, jobType, location, homeOffice, limit, refetch]);

    if (error) return <Alert severity="error">Error fetching jobs: {error.message}</Alert>;
    if (isLoading) return <CircularProgress />

    const handleSalaryChange = (event, newValue) => {
        setSalary(newValue);
    };

    const marks = [
        { value: 500000, label: '500.000 Ft' },
        { value: 2500000, label: '2.500.000 Ft' },
        { value: 4000000, label: '4.000.000 Ft' },
    ];

    const handleJobTypeChange = (event) => {
        setJobType(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleHomeOfficeChange = (event) => {
        setHomeOffice(event.target.checked);
    };

    const handleLoadMore = () => {
        setLimit(limit + 9);
    }

    const showJobs = () => {
        if(jobs.total > 0){
            return (
                <Grid container spacing={2}>
                    {jobs.data.map((job) => (
                        <Grid item xs={12} sm={6} md={4} key={job.id}>
                            <JobCard user={user} job={job} />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleLoadMore}>Load more jobs</Button>
                    </Grid>
                </Grid>
            );
        }
        return (
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography>No jobs found with these filters. ¯\_(ツ)_/¯</Typography>
                    </CardContent>
                </Card>
            </Grid>
        )
    }

    return (
        <Grid container spacing={2} className="pt-5">
            <Grid item xs={12} sm={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Slider
                            getAriaLabel={() => 'Salary range'}
                            value={salary}
                            onChange={handleSalaryChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={5000000}
                            step={50000}
                            marks={marks}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Job Type</FormLabel>
                                    <RadioGroup
                                        aria-label="jobType"
                                        name="jobType"
                                        value={jobType}
                                        onChange={handleJobTypeChange}
                                    >
                                        <FormControlLabel
                                            value="full-time"
                                            control={<Radio />}
                                            label="Full-time"
                                        />
                                        <FormControlLabel
                                            value="part-time"
                                            control={<Radio />}
                                            label="Part-time"
                                        />
                                        <FormControlLabel
                                            value="internship"
                                            control={<Radio />}
                                            label="Internship"
                                        />
                                        <FormControlLabel
                                            value="contract"
                                            control={<Radio />}
                                            label="Contract"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl component="fieldset" className="mt-3">
                                    <FormLabel component="legend">Other Options</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={homeOffice}
                                                    onChange={handleHomeOfficeChange}
                                                    name="homeOffice"
                                                />
                                            }
                                            label="Home Office"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="City"
                            variant="outlined"
                            fullWidth
                            value={location}
                            onChange={handleLocationChange}
                            className="mt-3"
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={9}>
                {showJobs()}
            </Grid>
        </Grid>
    );
};

export default Home;
