import React, {Component, Suspense} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Header from './components/header'
import Box from '@mui/material/Box';

//Pages
const Home = React.lazy(() => import('./views/Home/Home'))
const Search = React.lazy(() => import('./views/Search/Search'))
const Profile = React.lazy(() => import('./views/Profile/profile'))
const Comment = React.lazy(() => import('./views/comments/comments'))

const Myapp = () => (
    <Container maxWidth={"xl"} disableGutters={true}>
      <Header />
      <Box sx={{ my: 4 }}>       
            <Suspense fallback={<CircularProgress />}>
                <Routes>
                    <Route path="/" exact element={<Home />}/>
                    <Route path="/search/:query" element={<Search />}/>
                    <Route path="/profile/:id" element={<Profile />}/>
                    <Route path="/comments/:id" element={<Comment />}/>
                </Routes>
            </Suspense>
      </Box>
    </Container>
  );

export default Myapp