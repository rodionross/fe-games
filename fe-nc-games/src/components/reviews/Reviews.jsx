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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchParams, setSearchParams] = useSearchParams({ limit: 100 });

  useEffect(() => {
    console.log("useEffect ran");
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
    if (selectedCategory !== "select category") {
      e.preventDefault();
      let params = { category: selectedCategory };
      setSearchParams(params);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedCategory(value);
  };

  if (loading) return <h3>loading</h3>;
  return (
    <section className="all-reviews-container">
      {topThree ? (
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
          name="categories"
          id="categories"
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
            />
          );
        })}
      </div>
    </section>
  );
};
