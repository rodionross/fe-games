import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleReview.css";

export const SingleReview = () => {
  const { id } = useParams();
  const [review, setReview] = useState({});
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const review = axios.get(
      `https://board-games-mern-app.herokuapp.com/api/reviews/${id}`
    );
    const comments = axios.get(
      `https://board-games-mern-app.herokuapp.com/api/reviews/${id}/comments`
    );
    const users = axios.get(
      "https://board-games-mern-app.herokuapp.com/api/users"
    );

    Promise.all([review, comments, users])
      .then((res) => {
        setIsLoading(false);
        setReview(res[0].data.review);
        if (res[1].data.comments) {
          setComments(res[1].data.comments);
        }
        return res[2].data.users;
      })
      .then((res) => {
        let usersObj = {};
        res.forEach((user) => (usersObj[user.username] = user.avatar_url));
        setUsers(usersObj);
      });
  }, [id]);

  if (isLoading) return <h2>Loading...</h2>;
  return (
    <section className="single-review-page">
      <h2>{review.title}</h2>
      <div className="single-review-container">
        <div className="single-review-left">
          <div className="single-review-card">
            <div className="single-review-top">
              <img src={review.review_img_url} alt={review.title} />
              <h4>{review.votes} ★</h4>
            </div>
            <div className="single-review-designer-category">
              <h4>{review.designer}</h4>
              <h4>{review.category}</h4>
            </div>

            <p>{review.review_body}</p>
          </div>
        </div>
        {comments.length > 0 ? (
          <div className="single-review-right">
            {comments.map((comment) => {
              return (
                <div
                  key={comment.comment_id}
                  className="single-comment-card-container"
                >
                  <div className="single-comment-card-top">
                    <img
                      className="single-review-comment-img"
                      src={users[comment.author]}
                      alt={comment.author}
                    />
                    <h4>{comment.author}</h4>
                  </div>
                  <p>{comment.body}</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
