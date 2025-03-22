import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/shared/AuthContext';
import { RoutesConfig } from './RoutesConfig';

function App() {
  console.log("App.tsx - Router rendered");
  return (
    <Router>
      <AuthProvider>
        <RoutesConfig />
      </AuthProvider>
    </Router>
  );
}

export default App;