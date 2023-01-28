import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';


const theme = createTheme();


const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric"}
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export default function Home() {
    let { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        getData(id)
    }, []);

    const getData = async (id) => {
        await axios.get(`http://hn.algolia.com/api/v1/users/${id}`)
              .then((resp) => {
                setProfile(resp.data);
                console.log(resp.data);
                setLoading(false)
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                {(!loading)?
                    <Container maxWidth="lg">

                            <Card>
                              <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                  Username
                                </Typography>
                                <Typography variant="h5" component="div">
                                  {profile.username}
                                </Typography>
                                <br/><br/>
                                <TableContainer component={Paper}>
                                  <Table sx={{ minWidth: 650 }} aria-label="simple table">

                                    <TableBody>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell component="th" scope="row" style={{fontWeight: "bold"}}>About</TableCell>
                                          <TableCell align="right">
                                            {(profile.about)?profile.about:"-"}
                                          </TableCell>
                                        </TableRow>

                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell component="th" scope="row" style={{fontWeight: "bold"}}>Total Comments</TableCell>
                                          <TableCell align="right">{profile.comment_count}</TableCell>
                                        </TableRow>

                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell component="th" scope="row" style={{fontWeight: "bold"}}>Total Submissions</TableCell>
                                          <TableCell align="right">{profile.submission_count}</TableCell>
                                        </TableRow>

                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell component="th" scope="row" style={{fontWeight: "bold"}}>Karma</TableCell>
                                          <TableCell align="right">{profile.karma}</TableCell>
                                        </TableRow>

                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell component="th" scope="row" style={{fontWeight: "bold"}}>Account Active from</TableCell>
                                          <TableCell align="right">{formatDate(profile.created_at)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </CardContent>
                            </Card>
                        
                    </Container>:
                    <Container maxWidth="lg">
                        <Box component="span" sx={{ p: 2 }}>
                            <Stack spacing={2} alignItems="center">
                                <CircularProgress />
                            </Stack>
                        </Box>
                    </Container>
                }
                
        </ThemeProvider>
    )
}