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
import Link from '@mui/material/Link';
import axios from 'axios';


const theme = createTheme();

export default function Home() {
    let { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([]);

    useEffect(() => {
        getData(id)
    }, []);

    const getData = async (id) => {
        await axios.get(`http://hn.algolia.com/api/v1/items/${id}`)
              .then((resp) => {
                setData(resp.data);
                setLoading(false)
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const timeSince = (timestamp) => {
        let date = new Date(timestamp);
        let now = new Date();
        let timeDiff = now - date;
        let diffMinutes = Math.round(timeDiff / (1000 * 60));
        let diffHours = Math.round(diffMinutes / 60);
        let diffDays = Math.round(diffHours / 24);
        let diffMonths = Math.round(diffDays / 30);
        let diffYears = Math.round(diffMonths / 12);

        if (diffYears >= 1) {
            return diffYears + " years ago";
        } else if (diffMonths >= 1) {
            return diffMonths + " months ago";
        } else if (diffDays >= 1) {
            return diffDays + " days ago"
        } else if (diffHours >= 1) {
            return diffHours + " hours ago"
        } else if (diffMinutes >= 0) {
            return diffMinutes + " minutes ago"
        }
    }

    const clComment = (commment) => {
        return (
            <div style={{ marginLeft: "3em" }}>
                <div
                    className="grey-text"
                    style={{
                        fontSize: "small",
                        display: "list-item",
                        listStyleType: "disclosure-open",
                        color: "gray",
                    }}
                >
                    by <Link href={`/profile/${data.author}`}>{data.author}</Link><span> {timeSince(commment.created_at)}</span>
                </div>
                <div id={`collapse${commment.id}`} style={{ backgroundColor: "#DBF0FE" }} aria-labelledby={`heading${commment.id}`} data-bs-parent="#accordionExample">
                    <div className="accordion-body" dangerouslySetInnerHTML={{ __html: commment.text }}></div>
                </div>
                {commment.children ? commment.children.map((commment) => clComment(commment)) : ""}
            </div>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                {(!loading)?
                    <Container maxWidth="lg">

                            <Card>
                              <CardContent>
                                <Typography variant="h5" component="div">
                                  {data.title}
                                </Typography>
                                <Typography variant="body2">
                                  by <Link href={`/profile/${data.author}`}>{data.author}</Link>
                                </Typography>
                                <br/><br/>

                                <Stack spacing={2} alignItems="center">
                                        {
                                            data.children.map((commment, index) => (
                                                <div style={{ marginLeft: "3em" }} key={index}>
                                                    <div
                                                        className="grey-text"
                                                        style={{
                                                            fontSize: "small",
                                                            display: "list-item",
                                                            listStyleType: "disclosure-open",
                                                            color: "gray",
                                                        }}
                                                    >
                                                        by <Link href={`/profile/${data.author}`}>{data.author}</Link><span> {timeSince(commment.created_at)}</span>
                                                    </div>
                                                    <div id={`collapse${commment.id}`} aria-labelledby={`heading${commment.id}`} data-bs-parent="#accordionExample">
                                                        <div className="accordion-body" dangerouslySetInnerHTML={{ __html: commment.text }}>
                                                        </div>
                                                    </div>
                                                    {commment.children ? commment.children.map((commment) => clComment(commment)) : ""}
                                                </div>
                                            ))
                                        }
                                    </Stack>
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