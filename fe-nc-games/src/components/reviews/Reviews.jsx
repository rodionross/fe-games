import { useState, useEffect } from "react";
import axios from "axios";

import { Review } from "./Review";

import "./Reviews.css";

export const Reviews = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [topThree, setTopThree] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const reviews = axios.get(
      "https://board-games-mern-app.herokuapp.com/api/reviews"
    );
    const users = axios.get(
      "https://board-games-mern-app.herokuapp.com/api/users"
    );

    Promise.all([reviews, users]).then((res) => {
      setLoading(false);
      const sortedArray = res[0].data.reviews.sort((reviewA, reviewB) => {
        return reviewA.votes > reviewB.votes ? -1 : 1;
      });
      setTopThree([sortedArray[0], sortedArray[1], sortedArray[2]]);
      setAllReviews(res[0].data.reviews);
      setUsers(res[1].data.users);
    });
  }, []);

  if (loading) return <h3>loading</h3>;
  return (
    <section className="all-reviews-container">
      <div className="top-three-container">
        {topThree.map((el, index) => {
          return (
            <div key={el.review_id} className={`top-three-card-${index}`}>
              <img
                src={el.review_img_url}
                alt={el.title}
                className={`top-three-img-${index}`}
              />
              <h4 className={`top-three-title-${index}`}>{el.title}</h4>
              <h4 className={`top-three-votes-${index}`}>{el.votes} ★</h4>
            </div>
          );
        })}
      </div>
      <div className="reviews-container">
        {allReviews.map((review) => {
          return (
            <Review
              key={review.review_id}
              review={review}
              owner={users.find((user) => user.username === review.owner)}
            />
          );
        })}
      </div>
    </section>
  );
};
