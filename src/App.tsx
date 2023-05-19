import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Films from "./components/Films";
import Film from "./components/Film";
import NotFound from "./components/NotFound";
//import FilmsList from "./components/FilmsList";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/films" replace />} />
                <Route path="/film" element={<Film/>}/>
                <Route path="/films" element={<Films/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
