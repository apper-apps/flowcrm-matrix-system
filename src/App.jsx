import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Contacts from "@/components/pages/Contacts";
import Deals from "@/components/pages/Deals";
import Tasks from "@/components/pages/Tasks";
import Activities from "@/components/pages/Activities";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout title="Dashboard" />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/contacts" element={<Layout title="Contacts" />}>
            <Route index element={<Contacts />} />
          </Route>
          <Route path="/deals" element={<Layout title="Deals" />}>
            <Route index element={<Deals />} />
          </Route>
          <Route path="/tasks" element={<Layout title="Tasks" />}>
            <Route index element={<Tasks />} />
          </Route>
          <Route path="/activities" element={<Layout title="Activities" />}>
            <Route index element={<Activities />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;