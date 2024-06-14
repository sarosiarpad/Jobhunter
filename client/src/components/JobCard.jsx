import { Link } from "react-router-dom";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const JobCard = (props) => {
    const user = props.user;
    const job = props.job;

    if(user){
        return ( 
            <Card>
                <CardActionArea component={Link} to={`/jobs/${job.id}`}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {job.position}
                         </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {job.company}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Salary: {job.salaryFrom} - {job.salaryTo} HUF
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Type: {job.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Location: {job.city}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
         );
    }

    else {
        return ( 
            <Card>
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {job.position}
                         </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {job.company}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Salary: {job.salaryFrom} - {job.salaryTo} HUF
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Type: {job.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Location: {job.city}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}
 
export default JobCard;