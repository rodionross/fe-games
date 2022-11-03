import { useState, useEffect } from "react";
import axios from "axios";
import { Review } from "./Review";
import "./Reviews.css";
import { useSearchParams } from "react-router-dom";

export const Reviews = () => {
  const [topThree, setTopThree] = useState([]);

  const [allReviews, setAllReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedParams, setSelectedParams] = useState({ limit: 100 });
  const [searchParams, setSearchParams] = useSearchParams(selectedParams);

  useEffect(() => {
    setLoading(true);
    const reviews = axios.get(
      `https://board-games-mern-app.herokuapp.com/api/reviews`,
      { params: searchParams }
    );
    const users = axios.get(
      "https://board-games-mern-app.herokuapp.com/api/users"
    );
    const categories = axios.get(
      "https://board-games-mern-app.herokuapp.com/api/categories"
    );

    Promise.all([reviews, users, categories]).then((res) => {
      setLoading(false);
      setTopThree([]);
      if (res[0].data.reviews.length >= 3) {
        const sortedArray = res[0].data.reviews.sort((reviewA, reviewB) => {
          return reviewA.votes > reviewB.votes ? -1 : 1;
        });
        setTopThree([sortedArray[0], sortedArray[1], sortedArray[2]]);
      }

      setAllReviews(res[0].data.reviews);
      setUsers(res[1].data.users);
      setAllCategories(res[2].data.categories);
    });
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchParams(selectedParams);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (
      value !== "select category" &&
      value !== "sort by" &&
      value !== "order"
    ) {
      setSelectedParams((prev) => {
        return { ...prev, [id]: value };
      });
    }
  };

  const handleTopThreeVotes = (review, votes) => {
    topThree.forEach((el, index) => {
      if (el.review_id === review.review_id) {
        let newEl = { ...el, votes: votes };
        let newArr = [...topThree];
        newArr[index] = newEl;
        setTopThree(newArr);
      }
    });
  };

  if (loading) return <h2>Loading...</h2>;
  return (
    <section className="all-reviews-container">
      {topThree.length !== 0 ? (
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
      ) : null}
      <form className="form">
        <select
          onChange={handleChange}
          className="dropdown"
          name="category"
          id="category"
        >
          <option value="select category">select category</option>
          {allCategories.map((cat) => {
            return (
              <option key={cat.slug} value={cat.slug}>
                {cat.slug}
              </option>
            );
          })}
        </select>
        <select
          onChange={handleChange}
          className="dropdown"
          name="sort_by"
          id="sort_by"
        >
          <option value="sort by">sort by</option>
          <option value="created_at">date</option>
          <option value="comment_count">comment count</option>
          <option value="votes">votes</option>
        </select>

        <select
          onChange={handleChange}
          className="dropdown"
          name="order"
          id="order"
        >
          <option value="order">order</option>
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>

        <input
          onClick={handleSubmit}
          className="form-btn"
          type="submit"
          value="apply"
        />
      </form>
      <div className="reviews-container">
        {allReviews.map((review) => {
          return (
            <Review
              key={review.review_id}
              review={review}
              owner={users.find((user) => user.username === review.owner)}
              handleTopThreeVotes={handleTopThreeVotes}
            />
          );
        })}
      </div>
    </section>
  );
};
