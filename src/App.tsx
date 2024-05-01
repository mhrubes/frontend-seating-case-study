import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import EventDetail from "./pages/EventDetail";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

function App() {
    return (
        <Router>
            <UserProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/mainPage" element={<MainPage />} />
                        <Route path="/eventDetail" element={<EventDetail />} />
                    </Routes>
                </CartProvider>
            </UserProvider>
        </Router>
    );
}

export default App;