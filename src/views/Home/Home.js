import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import axios from 'axios';


const theme = createTheme();

export default function Home() {

    const [loading, setLoading] = useState(true)
    const [stories, setStories] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        getData(page)
    }, [ page]);

    const getData = async (page) => {
        await axios.get(`http://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}&hitsPerPage=15`)
              .then((resp) => {
                setStories(resp.data.hits);
                setLoading(false)
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const changePage = (value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    const timeSince=(timestamp)=>{
        let date = new Date(timestamp);
        let now = new Date();
        let timeDiff = now - date;
        let diffMinutes = Math.round(timeDiff / (1024 * 60));
        let diffHours = Math.round(diffMinutes / 60);
        let diffDays = Math.round(diffHours / 24);
        let diffWeeks = Math.round(diffDays / 7);
        let diffMonths = Math.round(diffWeeks / 4);
        let diffYears = Math.round(diffMonths / 12);
        
        if(diffYears >= 1){
            return diffYears + " years ago";
        } else if(diffMonths >= 1){
            return diffMonths + " months ago";
        } else if(diffWeeks >= 1){
            return diffWeeks + " weeks ago"
        } else if(diffDays >= 1){
            return diffDays + " days ago"
        } else if(diffHours >= 1){
            return diffHours + " hours ago"
        } else if(diffMinutes>=0){
            return diffMinutes + " minutes ago"
        }
        }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
                {(!loading)?
                    <Container maxWidth="lg">

                    {(stories) ? stories.map((story, index)=>
                        <div key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">{story.title}</Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary"><Link href={story.url}>(Link)</Link></Typography>
                                </CardContent>
                                <CardActions>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {story.points} pointy by
                                    </Typography>
                                    <Button size="small" color='inherit'><Link color="inherit" underline="none" onClick={()=> navigate(`/profile/${story.author}`)}>{story.author}</Link></Button> 
                                    <Typography variant="body2" color="text.secondary" gutterBottom>{timeSince(story.created_at)}  |
                                    </Typography>
                                    <Button size="small" color='inherit' ><Link color="inherit" underline="none" onClick={()=> navigate(`/comments/${story.objectID}`)}>{story.num_comments} Comments</Link></Button> 
                                </CardActions>
                            </Card>
                            <br/>
                        </div>
                        ):
                        <Box component="span" sx={{ p: 2 }}>
                            <Stack spacing={2} alignItems="center">
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">No Stories</Typography>
                            </Stack>
                        </Box>
                        }
                        

                        <Box component="span" sx={{ p: 2 }}>
                            <Stack spacing={2} alignItems="center">
                                <Pagination count={15} page={page} onChange={changePage} variant="outlined" color="primary" shape="rounded"/>
                            </Stack>
                        </Box>
                        
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
