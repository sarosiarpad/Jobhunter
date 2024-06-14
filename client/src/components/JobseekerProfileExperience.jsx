import { useState } from "react";
import { 
    useGetUserExperiencesQuery, 
    useModifyExperienceMutation, 
    useDeleteExperienceMutation 
} from "../services/api";
import { 
    Grid, Card, CardContent, 
    TextField, Box, Button, 
    Typography, CircularProgress, Alert
 } from "@mui/material";

const JobseekerProfileExperience = () => {
    const { data: experiences, error, isLoading, refetch } = useGetUserExperiencesQuery();

    const [editExperienceId, setEditExperienceId] = useState(-1);
    const [editedExperience, setEditedExperience] = useState({});

    const [modifyExperience] = useModifyExperienceMutation();
    const [deleteExperience] = useDeleteExperienceMutation();

    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setEditedExperience((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };

    const handleExperienceModify = (experience) => {
        setEditExperienceId(experience.id);
        setEditedExperience(experience);
    };

    const handleExperienceCancelEdit = () => {
        setEditExperienceId(-1);
        setEditedExperience({});
    };
    
    const handleExperienceModifySubmit = async () => {
      await modifyExperience({ 
        id: editExperienceId,
        experience: {
            company: editedExperience.company,
            title: editedExperience.title,
            interval: editedExperience.interval
        }
       })
        .then((response) => {
          if (response) {
            handleExperienceCancelEdit();
            refetch();
          }
        })
        .catch((error) => {
          console.error("Failed to modify experience.", error);
        });
    };

    const handleDeleteExperience = async (experienceId) => {
        await deleteExperience(experienceId)
          .then((response) => {
            if (response) {
                handleExperienceCancelEdit();
              refetch();
            }
          })
          .catch((error) => {
            console.error("Failed to delete experience.", error);
          });
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error fetching experiences: {error.message}</Alert>;

    return (
        <Grid container spacing={1}>
            {experiences.data.map((experience) => (
                editExperienceId === experience.id ? (
                  <Grid key={experience.id} item xs={12}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              required
                              fullWidth
                              name="title"
                              label="Position"
                              value={editedExperience.title}
                              onChange={handleExperienceChange}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              required
                              fullWidth
                              name="company"
                              label="Company"
                              value={editedExperience.company}
                              onChange={handleExperienceChange}
                            />                            
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              required
                              fullWidth
                              name="interval"
                              label="Interval"
                              value={editedExperience.interval}
                              onChange={handleExperienceChange}
                            />                           
                          </Grid>
                        </Grid>
                        <Box mt={2}>
                          <Button variant="contained" color="primary" onClick={() => handleExperienceModifySubmit(experience.id)}>Save</Button>
                          <Button variant="contained" color="secondary" onClick={handleExperienceCancelEdit}>Cancel</Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  <Grid key={experience.id} item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6'>
                          Position: {experience.title}
                        </Typography>
                        <Typography variant='body1'>
                          Company: {experience.company}
                        </Typography>
                        <Typography variant='body1'>
                          Interval: {experience.interval}
                        </Typography>
                        <Box mt={2}>
                          <Button variant="contained" color="secondary" onClick={() => handleExperienceModify(experience)}>Modify</Button>
                          <Button variant="contained" color="error" onClick={() => handleDeleteExperience(experience.id)}>Delete</Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
            ))}
        </Grid>
    );
}
 
export default JobseekerProfileExperience;