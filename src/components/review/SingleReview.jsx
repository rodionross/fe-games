import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleReview.css";
import { useContext } from "react";
import { ActiveUserContext } from "../contexts/UserContext";
import { Comment } from "../comment/Comment";
import { Popup } from "../popup/Popup";

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
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [optimisticComments, setOptimisticComments] = useState([]);
  const [popup, setPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);
    setIsLoading(true);
    const review = axios
      .get(`https://board-games-mern-app.herokuapp.com/api/reviews/${id}`)
      .catch((err) => {
        setNotFound(true);
      });

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
    if (!activeUser) {
      setMsg("Login to vote");
      return setPopup(!popup);
    }
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
    if (!activeUser) {
      setMsg("Login to vote");
      return setPopup(!popup);
    }
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

  const handleInput = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const handleClick = () => {
    if (!activeUser) {
      setMsg("Login to comment");
      return setPopup(!popup);
    }
    if (showForm && input !== "") {
      let comment = {};
      comment.author = activeUser.username;
      comment.body = input;
      comment.id = activeUser.username + Math.random() * 10000;

      let newOptComments = [...optimisticComments];
      newOptComments.push(comment);
      setOptimisticComments(newOptComments);

      axios.post(
        `https://board-games-mern-app.herokuapp.com/api/reviews/${id}/comments`,
        { username: activeUser.username, body: input }
      );
      setInput("");
    }
    setShowForm(!showForm);
  };

  const handlePopup = () => {
    setPopup(!popup);
  };

  const handleComments = (comment, comment_id) => {
    if (!parseInt(comment_id)) {
      const filteredOptimisticComments = optimisticComments.filter(
        (comment) => comment.id !== comment_id
      );
      setOptimisticComments(filteredOptimisticComments);

      axios
        .get(
          `https://board-games-mern-app.herokuapp.com/api/reviews/${id}/comments`
        )
        .then(({ data }) => {
          return data.comments.filter(
            (el) => el.author === comment.author && el.body === comment.body
          );
        })
        .then((res) => {
          axios.delete(
            `https://board-games-mern-app.herokuapp.com/api/comments/${res[0].comment_id}`
          );
        });
    } else {
      const filteredComments = comments.filter(
        (comment) => comment.comment_id !== comment_id
      );
      setComments(filteredComments);

      axios.delete(
        `https://board-games-mern-app.herokuapp.com/api/comments/${comment_id}`
      );
    }
  };

  if (notFound) return <h2>404: Review Not Found</h2>;
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
                onClick={handleUpVote}
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/2415/2415402.png"
                alt="thumbs-down"
                className="single-review-thumbs-down"
                onClick={handleDownVote}
              />
            </div>
            <div className="single-review-designer-category">
              <h4>{review.designer}</h4>
              <h4>{review.category}</h4>
            </div>
            <p>{review.review_body}</p>
          </div>
        </div>
        <div className="single-review-righ-side-container">
          <button className="add-comment-btn" onClick={handleClick}>
            {!showForm
              ? "add comment"
              : showForm && input !== ""
              ? "submit"
              : "close"}
          </button>
          {showForm ? (
            <div className="add-comment-modal">
              <form className="modal-form">
                <textarea
                  name="comment"
                  id="comment-textarea"
                  cols="10"
                  rows="7"
                  placeholder="write comment..."
                  value={input}
                  onChange={handleInput}
                ></textarea>
              </form>
            </div>
          ) : null}
          {comments.length > 0 ? (
            <div className="single-review-right">
              {optimisticComments.map((comment) => {
                return (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    users={users}
                    activeUser={activeUser}
                    handleComments={handleComments}
                    id={comment.id}
                  />
                );
              })}
              {comments.map((comment) => {
                return (
                  <Comment
                    key={comment.comment_id}
                    comment={comment}
                    users={users}
                    activeUser={activeUser}
                    handleComments={handleComments}
                    id={comment.comment_id}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      {popup ? <Popup msg={msg} whenClicked={handlePopup} /> : null}
    </section>
  );
};
