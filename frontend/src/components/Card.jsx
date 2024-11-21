import React from 'react';
import {Button,  Box, Paper, CardMedia } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import {useState} from 'react';

const Card = () => {
  const [rating, setRating] = useState(0);
  function handleRatingChange(newRating) {
    setRating(newRating);
  }
  function clickedImage() {
    console.log("Image Clicked");
  }
  const numberofStars = [1,2,3,4,5];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: "300px",
        height: "300px",
        borderRadius: "26px",
      }}
    >
      <Paper
      elevation={5}
      onClick={clickedImage}
        sx={{
          p: 2,
          display: 'flex',
          margin: '10px',
          alignItems: 'center',
          justifyContent: 'center',
          width: "250px",
          height: "250px",
          color: 'grey',
          borderRadius: "16px",
          
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: "16px",
          }}
          alt="Example Image"
          image="https://via.placeholder.com/250"
        />
      </Paper>
      <Button sx = {{color: 'grey', width: '200px' }}>
        {numberofStars.map((star) => (
          <StarIcon
            key={star}
            sx={{ color: star <= rating ? 'yellow' : 'grey' }}
            onClick={() => handleRatingChange(star)}
          />
        ))}
      </Button>
    </Box>
  );
};

export default Card;