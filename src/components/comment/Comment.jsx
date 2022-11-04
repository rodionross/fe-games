export const Comment = (props) => {
  const { comment, users, activeUser, handleComments, id } = props;

  const handleClick = () => {
    handleComments(comment, id);
  };

  return (
    <div className="single-comment-card-container">
      <div className="single-comment-card-top">
        <img
          className="single-review-comment-img"
          src={users[comment.author]}
          alt={comment.author}
        />
        <h4>{comment.author}</h4>
        {activeUser ? (
          activeUser.username === comment.author ? (
            <button onClick={handleClick} className="comment-delete-button">
              delete
            </button>
          ) : null
        ) : null}
      </div>
      <p>{comment.body}</p>
    </div>
  );
};
