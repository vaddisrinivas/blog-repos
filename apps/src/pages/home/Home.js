import * as React from "react";
import MediaCard from "../../components/Cards";
import { Grid } from "@mui/material";

export default function Home(props){
    console.log(props)
return(<> 
<Grid container spacing={2}>
{props.props.map((prop) => (
    <Grid item xs={12} sm={6} md={4}>
    <MediaCard {...prop}/>
    </Grid>
))}
</Grid>
</>)
}