
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Welcome } from './components/welcome/welcome';
import { ApplicationViews } from './views/ApplicationViews';
import { Authorized } from './views/Authorized';


export const App = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register />}/>
      <Route path="*" element={
        <Authorized>
            <ApplicationViews />
        </Authorized>
      } />
    </Routes>
  );
}
