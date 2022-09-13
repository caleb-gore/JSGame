
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Register } from './components/auth/Register';
import { Welcome } from './components/welcome';
import { ApplicationViews } from './views/ApplicationViews';
import { Authorized } from './views/Authorized';


export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      {/* <Route path="/login" element={}/> */}
      <Route path="/register" element={<Register />}/>
      <Route path="*" element={
        <Authorized>
            <ApplicationViews />
        </Authorized>
      } />
    </Routes>
  );
}
