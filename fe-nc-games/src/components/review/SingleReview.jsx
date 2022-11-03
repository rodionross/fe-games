import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleReview.css";
import { useContext } from "react";
import { ActiveUserContext } from "../contexts/UserContext";

export const SingleReview = () => {
  const { activeUser } = useContext(ActiveUserContext);
  const { id } = useParams();
  const [review, setReview] = useState({});
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState(review.votes);
  const [canVote, setCanVote] = useState([
    { upVote: true, count: 0 },
    { downVote: true, count: 0 },
  ]);

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
        setVotes(res[0].data.review.votes);
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

  const handleUpVote = () => {
    const newArr = [...canVote];

    if (canVote[0].count < 1) {
      const newVote = votes + 1;
      setVotes(newVote);
      axios.patch(
        `https://board-games-mern-app.herokuapp.com/api/reviews/${id}`,
        {
          inc_votes: 1,
        }
      );
      newArr[0].count += 1;
      newArr[1].downVote = true;
      newArr[1].count -= 1;
      setCanVote(newArr);
    } else {
      newArr[0].upVote = false;
    }
  };

  const handleDownVote = () => {
    const newArr = [...canVote];

    if (canVote[1].count < 1) {
      const newVote = votes - 1;
      setVotes(newVote);
      axios.patch(
        `https://board-games-mern-app.herokuapp.com/api/reviews/${id}`,
        {
          inc_votes: -1,
        }
      );
      newArr[0].upVote = true;
      newArr[0].count -= 1;
      newArr[1].count += 1;
      setCanVote(newArr);
    } else {
      newArr[1].upVote = false;
    }
  };

  if (isLoading) return <h2>Loading...</h2>;
  return (
    <section className="single-review-page">
      <h2>{review.title}</h2>
      <div className="single-review-container">
        <div className="single-review-left">
          <div className="single-review-card">
            <div className="single-review-top">
              <img
                src={review.review_img_url}
                alt={review.title}
                className="single-review-review_img_url"
              />
              {votes ? <h4>{votes} ★</h4> : <h4>loading</h4>}
              <img
                src="https://cdn-icons-png.flaticon.com/512/2415/2415418.png"
                alt="thumbs-up"
                className="single-review-thumbs-up"
                onClick={
                  activeUser ? (canVote[0].upVote ? handleUpVote : null) : null
                }
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/2415/2415402.png"
                alt="thumbs-down"
                className="single-review-thumbs-down"
                onClick={
                  activeUser
                    ? canVote[1].downVote
                      ? handleDownVote
                      : null
                    : null
                }
              />
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
