// Libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Contexts 
import { AuthProvider } from './context/authentication/AuthProvider';

// Componenets
import Navbar from './components/layout/Navbar';

// Routes/Pages
import PrivateRoute from './routes/PrivateRoute'; // Private route component to handle protected routes
import ExplorePage from './routes/ExplorePage';
import MyUploads from './routes/MyUploads';
import SignInPage from './routes/SignInPage';
import TemplatePage from './routes/TemplatePage';
import UploadTemplatePage from './routes/UploadTemplatePage';
import { TemplatesProvider } from './context/templates/TemplatesContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TemplatesProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<PrivateRoute><ExplorePage/></PrivateRoute>}/>
            <Route path="/signin" element={<SignInPage/>}/>
            <Route path="/template/:id" element={<PrivateRoute><TemplatePage/></PrivateRoute>}/>
            <Route path="/upload" element={<PrivateRoute><UploadTemplatePage/></PrivateRoute>}/>
            <Route path="/myuploads" element={<PrivateRoute><MyUploads/></PrivateRoute>}/>
          </Routes>
        </TemplatesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
