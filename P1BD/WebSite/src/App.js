import React, { useState, useEffect } from 'react';

function App() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/people')
      .then((response) => response.json())
      .then((data) => setPeople(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>People List</h1>
      <ul>
        {people.map((person) => (
          <li key={person.PersonID}>
            {person.PersonID} - {person.FullName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;