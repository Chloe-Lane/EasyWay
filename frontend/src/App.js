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

function App() {
  return (
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
          </Routes>  
        </Container>
      </div>
      <Footer />
    </Router>
  );
}

export default App; 