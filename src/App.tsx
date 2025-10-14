import './App.css';
import 'react-quill-new/dist/quill.snow.css';
import { auth } from './firebase-config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { TextEditor } from './components/text-editor';

function App() {

  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, user => {
      if (user){
        console.log(`User signed in:`, user.uid);
      }
      
      
    })
  },[]);

  return (
    <div className='App'>
      <header>
        <h1>QuillTape</h1>
      </header>
      <TextEditor/>
    </div>
  )
}

export default App
