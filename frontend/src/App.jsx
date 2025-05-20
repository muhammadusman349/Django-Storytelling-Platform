import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import StoryCreate from './pages/StoryCreate';
import StoryDetail from './pages/StoryDetail';
import StoryEdit from './pages/StoryEdit';
import StoryList from './pages/StoryList';
import About from './pages/About';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-900 text-white">
                <Header />
                <main className="pt-16"> {/* Add padding top to account for fixed header */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/stories" element={<StoryList />} />
                        <Route path="/stories/create" element={<StoryCreate />} />
                        <Route path="/stories/:slug" element={<StoryDetail />} />
                        <Route path="/stories/:slug/edit" element={<StoryEdit />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
