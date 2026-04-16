import { useEffect, useState } from 'react'
import { Card } from './Card'
import '../styles/App.css'

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // random array generation to get 9 unique ids from the first 151 pokemon
  const generateRandomPokemon = (num) => {
  const ids = [];
  const selected = new Set();
  for (let i = 0; i < num; i++) {
    let newNum = Math.floor(Math.random() * 151 + 1);
    while (selected.has(newNum)) {
      newNum = Math.floor(Math.random() * 151);
    };
    selected.add(newNum);
    ids.push(newNum);
  };

  return ids;
}

  useEffect(() => {
    const fetchData = async () => {
      const ids = generateRandomPokemon(9)
      try {
        const promises = ids.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
        );

        const results = await Promise.all(promises);
        setPokemon(results);
      } catch (error) {
        throw new Error('error fetching pokemon');
      }
    }

    fetchData();
  }, []);

  const formatName = (name) => {
    // formats special names for Mr. Mime, Nidoran female, Nidoran male and Farfetch'd
    name = name
      .replace('r-m', 'r. M')
      .replace('n-f', 'n ♁')
      .replace('n-m', 'n ♂︎')
      .replace('hd', `h'd`);

    // then capitalizes the name
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  const shuffleCards = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  const handleClick = (name) => {
    if (selected.includes(name)) {
      if (score > bestScore) {
        setBestScore(score)
      }
      setSelected([]);
      setScore(0);
      setPokemon(shuffleCards(pokemon));
      return;
    }

    const newSelection = [...selected, name];
    setSelected(newSelection);
    setPokemon(shuffleCards(pokemon));
    setScore(score => score + 1);
  }

  return (
    <div className='game'>
    <h1>The Pokémon Memory Game</h1>
    <p>Try not to pick the same Pokémon twice in a row. <br />Everytime you do, you will earn a point. <br />Try to get to 9 points!</p>
    <div className='score'>Score: {score}</div>
    <div className='best-score'>Best Score: {bestScore}</div>
    <div className='card-grid'>
      {pokemon.map((mon, index) => (
        <Card key={index} name={formatName(mon.name)} url={mon.sprites.front_default} onClick={() => handleClick(mon.name)} />
      ))}
    </div>
    </div>
  )
}

export { App }