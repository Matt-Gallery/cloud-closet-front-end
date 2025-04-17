import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import { Routes, Route } from "react-router";
import "./App.css";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<h1>Welcome to Auth App</h1>} />
        <Route path="/sign-up" element={<SignUpForm />} />
      </Routes>
    </>
  );
}

export default App;
