import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import RoomScreen from "./screens/RoomScreen.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from "react-bootstrap";
import './bootstrap.min.css';
import LoginScreen from "./screens/LoginScreen.jsx";
import SearchResults from "./screens/SearchResult.jsx";
import Map from "./components/Map";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProtectedListingCreateScreen from "./screens/ProtectedListingCreateScreen.jsx";
import UpdateRoomScreen from "./screens/UpdateRoomScreen.jsx";
import ChatScreen from "./screens/ChatScreen.jsx";
import BookingScreen from "./screens/BookingScreen.jsx";
import BookingRequestsScreen from "./screens/BookingRequestsScreen.jsx";
import BookingHistory from "./screens/BookingHistory.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import BookingSummaryScreen from "./screens/BookingSummaryScreen.jsx";
import BookingSummaryNoPaymentScreen from "./screens/BookingSummaryNoPaymentScreen.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";



function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "AZJ4pJl9A8lBjJaGOux1iyN3kq_YlXrqomyeFDI8cf3XKZkpMldp30crcLnPp7NQFgpIRaLs8EvEh3Oi" }}>
    <Router>
        <Header />
        <div>  
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} exact />
              <Route path="/rooms/:id" element={<RoomScreen />} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/map" element={<Map />} /> {/* New Map Route */}
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/create-listing" element={<ProtectedListingCreateScreen />} />
              <Route path="/update/room/:id" element={<UpdateRoomScreen />}/>
              <Route path="/chat/room/:roomName" element={<ChatScreen />} />
              <Route path="/chat/:userId/:hostId" element={<ChatScreen />} />
              <Route path="/book/:id" element={<BookingScreen />} />
              <Route path="/requests" element={<BookingRequestsScreen />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path='/users/profile' element={<ProfileScreen />} />
              <Route path="/booking-summary/:id/pay" element={<BookingSummaryScreen />} />
              <Route path="/booking/:id" element = {<BookingSummaryNoPaymentScreen/>}/>
              </Routes>  
          </Container>
        </div>
        <Footer />
      </Router>
    </PayPalScriptProvider>
    
  );
}

export default App; 