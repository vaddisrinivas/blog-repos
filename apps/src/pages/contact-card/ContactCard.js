// ContactCard.tsx

import React from 'react';
import { Card, CardContent, CardMedia, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { GitHub, LinkedIn, Mail, Phone, Web } from '@mui/icons-material';
import styled from 'styled-components';

export default function ContactCard(props) {
  // destructure the props object
  const { image, firstName, lastName, phone, email, github, linkedin, website } = props;

  // create a new map
  const iconsMap = new Map();

  // add key-value pairs to the map
  iconsMap.set('phone', { href: phone, icon: <Phone /> });
  iconsMap.set('email', { href: email, icon: <Mail /> });
  iconsMap.set('github', { href: github, icon: <GitHub /> });
  iconsMap.set('linkedin', { href: linkedin, icon: <LinkedIn /> });
  iconsMap.set('website', { href: website, icon: <Web /> });

  // define the styled components
  const Title = styled.h2`
    font-size: 24px;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    color: #fff;
  `;

  const Date = styled.div`
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    color: #ccc;
    margin: 6px 0;
  `;

  const Description = styled.p`
    font-size: 16px;
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    color: #fff;
  `;

  const CardContainer = styled.div`
    width: 600px;
    height: 300px;
    background-image: linear-gradient(to right, #6a11cb, #2575fc);
    box-shadow: inset -5px -5px 15px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.1), inset -1px -1px -3px rgba(255,255,255,0.2);
  `;

  const Image = styled.img`
    width: calc(100% -20px);
    height: calc(200px -20px);
    object-fit: cover;
    border-radius:4px;
  `;

  // return the JSX code for your component
  return (
    <Card className={CardContainer}>
      <CardMedia
        style={{ width: 200, height: 300 }}
        image={image}
        title={`${firstName} ${lastName}`}
      />
      <CardContent style={{ padding: 16 }}>
        <Typography variant="h5" color="textPrimary" style={{ fontWeight: 'bold' }}>
          {firstName} {lastName}
        </Typography>
        <Table style={{ width: 350, marginLeft: 16 }}>
          <TableBody style={{ verticalAlign: 'middle' }}>
            {iconsMap.forEach((value, key) => {
              // check if the value.href exists
              if (value.href) {
                // render the table row with the icon and value
                return (
                  <TableRow style={{ height: 50 }} key={key}>
                    <TableCell align="center" padding="none">
                      {value.icon}
                    </TableCell>
                    <TableCell align="left" padding="none">
                      <Typography variant="body1" color="textSecondary" style={{ fontWeight: '300' }}>
                        {value.href}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}