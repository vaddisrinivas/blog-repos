import React, { useState } from "react";
import { Button, TextField, Typography, Grid, Box, Switch } from "@mui/material";
import axios from "axios";

const ShortenedURL = ({ url, expiry }) => {
  return (
    <div>
      <Typography variant="h6">Shortened URL:</Typography>
      <Typography variant="body1">
        <a href={"/u/"+url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </Typography>
      <Typography variant="h6">Expiry:</Typography>
      <Typography variant="body1">{expiry}</Typography>
    </div>
  );
};

const URLShortener = (props) => {
  const [input, setInput] = useState("");
  const [shortenedURL, setShortenedURL] = useState(null);
  const [expiryDays, setExpiryDays] = useState(1); // Default to 1 day
  const [error, setError] = useState(null);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [password, setPassword] = useState("");
  const handleToggleChange = (e) => {
    setToggleSwitch(e.target.checked);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleExpiryChange = (e) => {
    const days = e.target.value;
    // Limit the range to 1-3 days
      setExpiryDays(days);
  };

  const handleSubmit = () => {
    // Basic URL validation
    if (!isValidURL(input)) {
      setError("Invalid URL");
      return;
    }

    // Reset error state
    setError(null);

    // Calculate expiration time in seconds
    const expiryInSeconds = expiryDays * 86400;

    // Perform API request to shorten URL
    axios
      .post(
        props.props.api_url,
        { original_url: input, expiry: expiryInSeconds,password:password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        const shortenedURL = response.data.short_url;
        setShortenedURL(shortenedURL);
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
        console.error(error);
      });
  };

  const isValidURL = (url) => {
    // Implement URL validation logic here
    // Return true if URL is valid, false otherwise
    // You can use regular expressions or other methods for validation
    // For simplicity, you can assume a URL is valid if it starts with "http://" or "https://"
    if (!url) return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <Box p={2}>
      <Typography variant="h3">{props.title}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TextField
            label="Long URL"
            type="url"
            value={input}
            onChange={handleChange}
            fullWidth
            required
            error={Boolean(error)}
            helperText={error}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Expiry (in days, 1-3 days)"
            type="number"
            value={expiryDays}
            onChange={handleExpiryChange}
            fullWidth
          />
        </Grid>    
        {/* add a switch which says admin */}
        <Grid item xs={3}>
          <Typography variant="p">Admin</Typography>
          <Switch
            checked={toggleSwitch}
            onChange={handleToggleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Grid>

          {/* if that switch is toggled then show a password field */}
        {toggleSwitch && (
          <Grid item xs={10}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Shorten
          </Button>
        </Grid>
        <Grid item xs={12}>
          {shortenedURL && (
            <ShortenedURL url={shortenedURL} expiry={expiryDays + " days"} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default URLShortener;
