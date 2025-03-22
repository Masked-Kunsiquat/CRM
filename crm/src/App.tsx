import { BrowserRouter as Router } from 'react-router-dom';
import { RoutesConfig } from './RoutesConfig';

function App() {
  console.log('App.tsx - Router rendered');

  return (
    <Router>
      <RoutesConfig />
    </Router>
  );
}

export default App;
