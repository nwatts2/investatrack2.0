import { useEffect, useState } from 'react';
import '../css/News.css';

const ArticleBox = ({article}) => {
    const regex = new RegExp(article.source.name, 'i');
    const array = article.title.replace(regex, ' ').split(' - ');
    const headline = array[0];
    const temp = article.description.slice(0, 100).split(' ');
    let description = '';

    let i = 0;
    while (i < temp.length - 1) {
        description += temp[i] + ' ';

        i++;
    }

    description = description.slice(0, description.length - 1);
    description += (article.description.length >= 100 ? '..' : '');

    return (
        <a href={article.url} target='_blank'>
            <div className='articleBox'>
                <img src={article.urlToImage}/>
                <h3>{headline}</h3>
                <span>{description}</span>
                <h4>{article.source.name}</h4>
            </div>
        </a>
    );
};

const News = () => {
    const [news, setNews] = useState({});

    useEffect(() => {
        async function getNews() {
            const newsResponse = await fetch('/getNews/');

            if (!newsResponse.ok) {
                const message = `An error occured: ${newsResponse.statusText}`;
                window.alert(message);
                return;
            }

            const newsJSON = await newsResponse.json();

            if (JSON.stringify(news) !== JSON.stringify(newsJSON.info)) {
                setNews(newsJSON.info);
            }
        }

        getNews();

    }, []);

    return (
        <div className='newsMain'>
            {news.articles ? news.articles.map((article) => {
                return (
                    <ArticleBox article={article}/>
                );
            }) : ''}
        </div>
    );
};

export default News;