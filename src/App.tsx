import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                Home
                <Link to="/setting">Go to setting</Link>
              </div>
            }
          />
          <Route
            path="/setting"
            element={
              <div>
                Setting
                <Link to="/">Go to Home</Link>
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default App;
