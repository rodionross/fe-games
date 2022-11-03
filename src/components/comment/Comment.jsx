export const Comment = (props) => {
  const { comment, users } = props;
  return (
    <div className="single-comment-card-container">
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
};
