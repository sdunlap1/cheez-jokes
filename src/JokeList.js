import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState(() => {
    // Load jokes from localStorage on initial load
    const savedJokes = JSON.parse(localStorage.getItem("jokes"));
    return savedJokes || [];
  });
  const [isLoading, setIsLoading] = useState(jokes.length === 0);

  const getJokes = useCallback(async () => {
    try {
      let newJokes = [...jokes]; // Start with the current jokes
  
      let seenJokes = new Set(jokes.map((j) => j.id)); // Include existing joke IDs in seenJokes
  
      // Keep locked jokes, only replace unlocked ones
      newJokes = newJokes.filter((j) => j.locked);
  
      while (newJokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
  
        let { ...joke } = res.data;
  
        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          newJokes.push({ ...joke, votes: 0, locked: false });
        } else {
          console.log("duplicate found!");
        }
      }
  
      setJokes(newJokes); // Set new jokes along with locked ones
      setIsLoading(false);
      localStorage.setItem("jokes", JSON.stringify(newJokes)); // Save updated jokes in localStorage
    } catch (err) {
      console.error(err);
    }
  }, [jokes, numJokesToGet]);
  

  useEffect(() => {
    if (jokes.length === 0) getJokes();
  }, [getJokes, jokes.length]);

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  const vote = (id, delta) => {
    const updatedJokes = jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    setJokes(updatedJokes);
    localStorage.setItem("jokes", JSON.stringify(updatedJokes)); // Update localStorage
  };

  // The lockJoke function to toggle locked status
  const lockJoke = (id) => {
    const updatedJokes = jokes.map((j) =>
      j.id === id ? { ...j, locked: !j.locked } : j
    );
    setJokes(updatedJokes);
    localStorage.setItem("jokes", JSON.stringify(updatedJokes)); // Update localStorage
  };

  const resetJokes = () => {
    setJokes([]);
    localStorage.removeItem("jokes");
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>
      <button className="JokeList-reset" onClick={resetJokes}>
        Reset Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          key={j.id}
          id={j.id}
          text={j.joke}
          votes={j.votes}
          vote={vote}
          lock={lockJoke} // Pass the lockJoke function to Joke component
          isLocked={j.locked} // Pass locked state to Joke component
        />
      ))}
    </div>
  );
};

export default JokeList;
