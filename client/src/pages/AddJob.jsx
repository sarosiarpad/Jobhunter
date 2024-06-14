import React, { useState } from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Box,
    Typography,
    Grid,
    Slider
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateJobMutation } from '../services/api';
import { Navigate } from 'react-router-dom';

const AddJob = () => {
    const [createJob] = useCreateJobMutation();

    const user = useSelector((state) => state.user.userInfo);

    if (!user) return <Navigate to="/" />;

    const [companyName, setCompanyName] = useState(user.name);
    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState([0, 10000000]);
    const [employmentType, setEmploymentType] = useState('');
    const [location, setLocation] = useState('');
    const [hasRemoteOption, setHasRemoteOption] = useState(false);

    const handleAddJob = async (e) => {
        e.preventDefault();
        createJob({
            company: companyName,
            position: position,
            description: description,
            salaryFrom: salary[0],
            salaryTo: salary[1],
            type: employmentType,
            city: location,
            homeOffice: hasRemoteOption,
        })
        .then((response) => {
            if (response) {
                setCompanyName(user.name);
                setPosition('');
                setDescription('');
                setSalary([0, 10000000])
                setEmploymentType('');
                setLocation('');
                setHasRemoteOption(false);
            }
        })
        .catch((error) => {
            console.error('Failed to create job.', error);
        });
    };

    const marks = [
        { value: 500000, label: '500.000 Ft' },
        { value: 2500000, label: '2.500.000 Ft' },
        { value: 4000000, label: '4.000.000 Ft' },
    ];

    const handleSalaryChange = (event, newValue) => {
        setSalary(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Add Job
            </Typography>
            <form onSubmit={handleAddJob}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Type</InputLabel>
                            <Select
                                labelId="employment-type-label"
                                label="Type"
                                value={employmentType}
                                onChange={(e) => setEmploymentType(e.target.value)}
                            >
                                <MenuItem value="full-time">Full time</MenuItem>
                                <MenuItem value="part-time">Part time</MenuItem>
                                <MenuItem value="internship">Internship</MenuItem>
                                <MenuItem value="contract">Contract</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={hasRemoteOption}
                                    onChange={(e) => setHasRemoteOption(e.target.checked)}
                                />
                            }
                            label="Home office"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AddJob;
