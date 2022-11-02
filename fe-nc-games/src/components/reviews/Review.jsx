import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Review.css";
import { useContext } from "react";
import { ActiveUserContext } from "../contexts/UserContext";

export const Review = (props) => {
  const { activeUser } = useContext(ActiveUserContext);
  const { review, owner, handleTopThreeVotes } = props;
  const [hidden, setHidden] = useState(true);
  const [votes, setVotes] = useState(review.votes);
  const [canVote, setCanVote] = useState({ upVote: true, downVote: true });

  const handleUpVote = () => {
    const newVote = votes + 1;
    setVotes(newVote);
    axios.patch(
      `https://board-games-mern-app.herokuapp.com/api/reviews/${review.review_id}`,
      {
        inc_votes: 1,
      }
    );
    setCanVote((prev) => {
      return { ...prev, upVote: false, downVote: true };
    });
    handleTopThreeVotes(review, newVote);
  };

  const handleDownVote = () => {
    const newVote = votes - 1;
    setVotes(newVote);
    axios.patch(
      `https://board-games-mern-app.herokuapp.com/api/reviews/${review.review_id}`,
      {
        inc_votes: -1,
      }
    );
    setCanVote((prev) => {
      return { ...prev, upVote: true, downVote: false };
    });
    handleTopThreeVotes(review, newVote);
  };

  return (
    <div className="review-card">
      <div className="review-img-container">
        <Link to={`/review/${review.review_id}`}>
          <img
            className="review-img"
            src={review.review_img_url}
            alt={review.owner}
          />
        </Link>
        <h4 className="review-votes">{votes} ★</h4>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2415/2415418.png"
          alt="thumbs"
          className="thumbs-up"
          onClick={activeUser ? (canVote.upVote ? handleUpVote : null) : null}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/2415/2415402.png"
          alt="thumbs"
          className="thumbs-down"
          onClick={
            activeUser ? (canVote.downVote ? handleDownVote : null) : null
          }
        />
      </div>
      <h4>{review.title}</h4>
      <div className={hidden ? "closed" : "open"}>
        <div className="user-img-name">
          <img
            className={hidden ? "hidden" : "owner-img"}
            src={owner.avatar_url}
            alt=""
          />
          <h4 className={hidden ? "hidden" : null}>{owner.username}</h4>
        </div>

        <h4 className={hidden ? "hidden" : null}>
          Category: {review.category}
        </h4>
        <h4 className={hidden ? "hidden" : null}>
          Designer: {review.designer}
        </h4>
        <h4 className={hidden ? "hidden" : "comment-count"}>
          {review.comment_count}
        </h4>
        <img
          className={hidden ? "hidden" : "comment-img"}
          src="https://cdn-icons-png.flaticon.com/512/3318/3318523.png"
          alt="comment"
        />
      </div>
      <img
        onClick={() => {
          setHidden(!hidden);
        }}
        className={hidden ? "arrow-img-down" : "arrow-img-up"}
        src="https://cdn-icons-png.flaticon.com/512/656/656979.png"
        alt="arrow"
      />
    </div>
  );
};
