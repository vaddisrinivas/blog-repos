import React from 'react';
import { Card, CardMedia, CardContent,Typography,Chip, Avatar, CardActions, Button } from '@mui/material';
export default function CardItem({item, handleEditClick, handleDeleteClick, handleExpandClick}) {
    return (<Card variant="outlined">
    <CardMedia
      component="img"
      height="140"
      image={item.images ? item.images : 'https://media.giphy.com/media/LOtwcbjWL6Pwr2qO8t/giphy.gif'}
      alt={item.title}
    />
    <CardContent>
      <Typography variant="h6">{item.title}</Typography>
      <Typography variant="body2" color="textSecondary">
        {item.description}
      </Typography>
      {item.projects && item.projects.length > 0 && (
        <div>
          {item.projects.map((project) => (
            <Chip key={project} label={project} size="small" />
          ))}
        </div>
      )}
      {item.tags && item.tags.length > 0 && (
        <div>
          {item.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </div>
      )}
      {item.creationDate && (
        <Typography variant="caption" color="textSecondary">
          Created: {item.creationDate}
        </Typography>
      )}
      {item.due && (
        <Typography variant="caption" color="textSecondary">
          Due: {item.due}
        </Typography>
      )}
    </CardContent>
    <CardActions>
      <Button size="small" onClick={() => handleEditClick(item)}>
        Edit
      </Button>
      <Button size="small" onClick={() => handleDeleteClick(item)}>
        Delete
      </Button>
      <Button size="small" onClick={() => handleExpandClick(item)}>
        Expand
      </Button>
    </CardActions>
  </Card>);
}