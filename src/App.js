import { getAuth } from 'firebase/auth';
import { db } from './firebase.config';

function App() {
  getAuth();
  return (
    <div className="text-3xl font-bold underline">Hello world!</div>
  );
}

export default App;
