import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Chart from 'react-apexcharts';
import axios from 'axios';

const SalesOverview = () => {
  const [terminalsData, setTerminalsData] = useState([]);
  const [simsData, setSimsData] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token'); // Supposons que le token est stocké dans localStorage

  useEffect(() => {
    const fetchTerminalsData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/terminals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTerminalsData(response.data);
      } catch (error) {
        console.error('There was an error fetching the terminals data!', error);
      }
    };

    const fetchSimsData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/numeros`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSimsData(response.data);
      } catch (error) {
        console.error('There was an error fetching the sims data!', error);
      }
    };

    fetchTerminalsData();
    fetchSimsData();
  }, [token]);

  useEffect(() => {
    if (terminalsData.length > 0 && simsData.length > 0) {
      // Extract unique filiales
      const filialeSet = new Set([
        ...terminalsData.map(item => item.fillialeLibelle),
        ...simsData.map(item => item.fillialeLibelle),
      ]);

      const filialeArray = Array.from(filialeSet);
      setFiliales(filialeArray);

      // Count occurrences of each filiale
      const terminalCounts = terminalsData.reduce((acc, item) => {
        acc[item.fillialeLibelle] = (acc[item.fillialeLibelle] || 0) + 1;
        return acc;
      }, {});

      const simsCounts = simsData.reduce((acc, item) => {
        acc[item.fillialeLibelle] = (acc[item.fillialeLibelle] || 0) + 1;
        return acc;
      }, {});

      // Calculate total counts
      const totalTerminals = terminalsData.length;
      const totalSims = simsData.length;

      // Prepare series data for the chart
      const series = [
        {
          name: "Terminals",
          data: filialeArray.map(filiale => (terminalCounts[filiale] || 0) / totalTerminals * 100),
        },
        {
          name: "SIMs",
          data: filialeArray.map(filiale => (simsCounts[filiale] || 0) / totalSims * 100),
        },
      ];

      setSeriesData(series);
    }
  }, [terminalsData, simsData]);

  const optionssalesoverview = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        endingShape: "rounded",
        borderRadius: 5,
      },
    },
    colors: ["#B22222", "#228B22"], // Updated colors
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      categories: filiales,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
        formatter: val => `${val}%`,
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: val => `${val}%`,
      },
    },
  };

  return (
    <Card
      variant="outlined"
      sx={{
        paddingBottom: "0",
        
      }}
    >
      <CardContent
        sx={{
          paddingBottom: "16px !important",
        }}
      >
        <Box
          sx={{
            display: {
              sm: "flex",
              xs: "block",
            },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              mt: {
                lg: 0,
                xs: 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#B22222",
                  borderRadius: "50%",
                  height: 8,
                  width: 8,
                  mr: 1,
                }}
              />
              <Typography
                variant="h8"
                sx={{
                  color: "#B22222",
                }}
              >
                Terminaux
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#228B22",
                  borderRadius: "50%",
                  height: 8,
                  width: 8,
                  mr: 1,
                }}
              />
              <Typography
                variant="h8"
                sx={{
                  color: "#228B22",
                }}
              >
                SIM
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "25px",
          }}
        >
          <Chart
            options={optionssalesoverview}
            series={seriesData}
            type="bar"
            height="200px"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesOverview;
