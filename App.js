import React from 'react'
import './App.css';
import FileUpload from './components/FileUpload'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Document Format Standardisation</h1>
        <p>Upload a document(PDF, HTML) and get the Markdown result!</p>
      </header>
      
      <FileUpload />

    </div>
  );
}

export default App;
