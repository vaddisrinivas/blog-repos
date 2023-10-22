import React, { useState, useEffect } from "react";
import { Typography, Link, Paper, Grid } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const isValidURL = (str) => {
  if (!str) return false;
  return true;
};

const CountdownRedirect = ({ url, expiry, error }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer = 5;
    const countdownInterval = setInterval(() => {
      if (timer === 0) {
        clearInterval(countdownInterval);
        window.location.href = url;
      } else {
        setCountdown(timer);
        timer--;
      }
    }, 1000);
  }, [url]);

  const formatExpiry = (expiry) => {
    const days = Math.ceil(expiry / 86400);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <Paper elevation={3} style={{ padding: "16px", marginTop: "20px" }}>
      {error ? (
        <Typography variant="body1" style={{ color: "red" }}>
          {error}
        </Typography>
      ) : (
        <>
          <Typography variant="h6">Shortened URL:</Typography>
          {url ? (
            isValidURL(url) ? (
              <Link href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </Link>
            ) : (
              <Typography variant="body1" style={{ color: "red" }}>
                Invalid URL
              </Typography>
            )
          ) : (
            <Typography variant="body1" style={{ color: "red" }}>
              Empty URL
            </Typography>
          )}
          <Typography variant="h6">Expiry:</Typography>
          <Typography variant="body1">{formatExpiry(expiry)}</Typography>
          <Typography variant="body1">
            Redirecting in {countdown} seconds...
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default function ShortenedURL(props) {
  const { id } = useParams();

  const [urlInfo, setUrlInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Make a GET request to the API to retrieve URL information
      axios
        .get(`${props.props.api_url}/${id}`)
        .then((response) => {
          const response_mod = response.data;
          const urlInfoData = {
            url: response_mod.original_url,
            expiry: response_mod.expiry,
          };
          // Assign the JSON object to the urlInfo state
          setUrlInfo(urlInfoData);
        })
        .catch((error) => {
          // Set the error state to display an error message
          setError("An error occurred. Please try again later.");
        });
    }
  }, [id]);

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h4" style={{ marginBottom: "20px" }}>
          URL Shortener
        </Typography>
        <CountdownRedirect url={urlInfo?.url} expiry={urlInfo?.expiry} error={error} />
      </Grid>
    </Grid>
  );
}
