import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import EventDetail from "./pages/EventDetail";
import OrderDetail from "./pages/OrderDetail";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { EventProvider } from "./context/EventContext";

function App() {
    return (
        <Router>
            <UserProvider>
                <EventProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/eventDetail" element={<EventDetail />} />
                            <Route path="/orderDetail" element={<OrderDetail />} />
                        </Routes>
                    </CartProvider>
                </EventProvider>
            </UserProvider>
        </Router>
    );
}

export default App;