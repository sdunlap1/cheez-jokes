import React from "react";
import "./Joke.css";

const Joke = ({ id, vote, votes, text, lock, isLocked }) => {
  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={() => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={() => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>

      <button className="Joke-lock" onClick={() => lock(id)}>
        {isLocked ? "Unlock" : "Lock"}
      </button>
    </div>
  );
};

export default Joke;
