import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Films from "./components/Films";
import Film from "./components/Film";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import AuthStore from "./store/authStore";
import User from "./components/User";

function App() {
    const token = AuthStore((state) => state.userToken);

  return (
    <div className="App">
      <Router>
          <Navbar/>
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/films" replace />} />
                <Route path="/films/:id" element={<Film/>}/>
                <Route path="/films" element={<Films/>}/>

                {token ? (
                    <Route>
                        <Route path="/profile" element={<User/>}/>
                        <Route path="/login" element={<Navigate to="/films" replace />}/>
                    </Route>
                ) : (
                    <Route>
                        <Route path="/profile" element={<Navigate to="/films" replace />}/>
                        <Route path="/login" element={<Login/>}/>
                    </Route>
                )}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
