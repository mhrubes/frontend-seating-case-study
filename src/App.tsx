import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import EventDetail from "./pages/EventDetail";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/eventDetail" element={<EventDetail />} />
            </Routes>
        </Router>
    );
}

export default App;