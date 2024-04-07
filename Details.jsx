import React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../Page/Details.module.css";
const Details = () => {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://api.realworld.io/api/articles');
            const data = await response.json();
            setArticles(data.articles);
        };

        fetchData();
    }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "long", day: "numeric", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    return (
        <div className={styles.details_container}>
            {articles.length > 0 ? (
                <ul>
                    {articles.map((article) => (
                        <li className={styles.article} key={article.slug}>
                            <div>
                                <div className={styles.head}>
                                    <h1 className={styles.article_title}>{article.title}</h1>
                                    <div>
                                        <a href="#">
                                            <img src={article.author.image} alt="" className={styles.author_avatar} />
                                        </a>
                                        <div>
                                            <a href="#" className={styles.author_username}>{article.author.username}</a>
                                            <span>{formatDate(article.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline-secondary btn-sm">
                                            <FontAwesomeIcon icon={faPlus} />
                                            <span> Follow</span>
                                            <span> {article.author.username}</span>
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline-success btn-sm">
                                            <FontAwesomeIcon icon={faHeart} />
                                            <span> Fovorite Article </span>
                                            <span> ({article.favoritesCount})</span>
                                        </button>
                                    </div>
                                </div>

                                <a href="#" style={{ textDecoration: "none" }}>
                                    <p >{article.description}</p>
                                    <p>{article.body}</p>
                                    <div>
                                        <ul className="tag-list">
                                            {article.tagList.map((tag) => {
                                                return (
                                                    <li
                                                        className="tag-default tag-pill tag-outline"
                                                        key={tag}
                                                    >
                                                        {tag}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </a>
                            </div>


                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading articles...</p>
            )}
        </div>
    );
};

export default Details;