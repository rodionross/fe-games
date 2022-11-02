import { useState } from "react";
import { Link } from "react-router-dom";
import "./Review.css";

export const Review = (props) => {
  const { review, owner } = props;
  const [hidden, setHidden] = useState(true);

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
        <h4 className="review-votes">{review.votes} ★</h4>
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
