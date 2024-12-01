import React, { useState } from 'react';
import { Button, Box, Paper, CardMedia } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const Card: React.FC = () => {
  const [rating, setRating] = useState<number>(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const clickedImage = () => {
    console.log("Image Clicked");
  };

  const numberofStars = [1, 2, 3, 4, 5];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: "400px",
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
          width: "350px",
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
      <Button sx={{ color: 'grey', width: '200px' }}>
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