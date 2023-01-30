import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';


const theme = createTheme();

export default function Home() {

    const [type, setType] = useState('story');
    const [filterby, setFilterby] = useState('search');
    const [time, setTime] = useState(0);
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const { query } = useParams();

    useEffect(() => {
        getData(filterby,type,time,page)
    }, [filterby,type,time,page,query]);

    const getData = async (filterby,type,time, page) => {
        console.log(`numericFilters=created_at_i>${time}`)
        await axios.get(`http://hn.algolia.com/api/v1/${filterby}?tags=${type}&numericFilters=created_at_i>${time}&query=${query}&page=${page}&hitsPerPage=15`)
              .then((resp) => {
                setData(resp.data.hits);
                setLoading(false)
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const changePage = (e, value) => {
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

                        <Box component="span" sx={{ p: 2 }}>
                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={{ xs: 1, sm: 2, md: 4 }}
                              justifyContent="center"
                              alignItems="center"
                            >
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-readonly-label">Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-readonly-label"
                                    id="demo-simple-select-readonly"
                                    value={type}
                                    label="Type"
                                    onChange={e => setType(e.target.value)}
                                >
                                <MenuItem value='story'>Stories</MenuItem>
                                <MenuItem value='comment'>Comments</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-readonly-label">Filter by</InputLabel>
                                <Select
                                    labelId="demo-simple-select-readonly-label"
                                    id="demo-simple-select-readonly"
                                    value={filterby}
                                    label="Filter by"
                                    onChange={e => setFilterby(e.target.value)}
                                >
                                <MenuItem value='search'>Popularity</MenuItem>
                                <MenuItem value='search_by_date'>Time</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-readonly-label">Time</InputLabel>
                                <Select
                                    labelId="demo-simple-select-readonly-label"
                                    id="demo-simple-select-readonly"
                                    value={time}
                                    label="Time"
                                    onChange={e => setTime(e.target.value)}
                                >
                                <MenuItem value='0'>All Time</MenuItem>    
                                <MenuItem value='86400'>Last 24hr</MenuItem>
                                <MenuItem value='604800'>Past Week</MenuItem>
                                <MenuItem value='2592000'>Past Month</MenuItem>
                                <MenuItem value='31104000'>Past Year</MenuItem>
                                </Select>
                            </FormControl>
                            </Stack>
                        </Box>

                    {(data) ? data.map((story, index)=>
                        <div key={index}>
                            {(type === 'story')?
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" component="div">{story.title}</Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary"><Link href={story.url}>(Link)</Link></Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {story.points} pointy by
                                        </Typography>
                                        <Button size="small" color='inherit'><Link color="inherit" underline="none" href={`/profile/${story.author}`}>{story.author}</Link></Button> 
                                        <Typography variant="body2" color="text.secondary" gutterBottom>{timeSince(story.created_at)}  |
                                        </Typography>
                                        <Button size="small" color='inherit' ><Link color="inherit" underline="none" href={`/comments/${story.objectID}`}>{story.num_comments} Comments</Link></Button> 
                                    </CardActions>
                                </Card>:
                                <Card>
                                    <CardActions>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {story.points} pointy by
                                        </Typography>
                                        <Button size="small" color='inherit'><Link color="inherit" underline="none" href={`/profile/${story.author}`}>{story.author}</Link></Button> 
                                        <Typography variant="body2" color="text.secondary" gutterBottom>{timeSince(story.created_at)}  |
                                        </Typography>
                                        <Button size="small" color='inherit' ><Link color="inherit" underline="none" href={`/comments/${story.objectID}`}>{story.num_comments} Comments</Link></Button>
                                        <Typography variant="body2" color="text.secondary" gutterBottom> | on: <Link href={story.story_url}>{story.story_title}</Link>
                                        </Typography>
                                    </CardActions>
                                    <CardContent>
                                        {(story._highlightResult.comment_text) &&
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                color="text.secondary"
                                                gutterBottom
                                                dangerouslySetInnerHTML={{
                                                    __html: story._highlightResult.comment_text.value,
                                                }} 
                                            ></Typography>
                                        }
                                    </CardContent>
                                    
                                </Card>
                            }
                            
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
