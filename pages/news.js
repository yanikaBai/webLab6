//
// Imports
//

import React , {Component} from 'react';
// This is the Link API
import Link from 'next/link';
// Import fetch library
import fetch from 'isomorphic-unfetch';

// import SearchForm Component
import SearchForm from '../components/SearchForm';
// import Dropdown
import Dropdown from '../components/Dropdown';
//(free version) API key from https://newsapi.org/
// Get your own key!
const apiKey = '56adcf6299204eec895e8209a109cd06';
// Initial News source
const defaultNewsSource = 'BBC-News'

//
// getNews(url) is an async method which fetches and returns data (or an error) from a WWW API
//

async function getNews(url) {
  // try fetch and catch any errors
  try {
    // Make async call
    const res = await fetch(url);
    // get json data when it arrives
    const data = await res.json();
    // return json data
    return (data);
  } catch (error) 
    {
    // return error if it occurs
    return (error);
    }
}

//
// The News page defined as an ES6 Class
//

export default class News extends React.Component {
  // Constructor
  // Recieve props and initialise state properties
  //

  constructor(props) {
    super(props)
    this.state = {
      newsSource: "",
      url: "",
      articles: []
    }
  
  } //end Constructor

  //This function is passed to the SearchForm and used the get the value entered
  //This value will be used to generate the api url
  setNewsSource = (input) => {
    this.setState({
      newsSource: input,
      url: `https://newsapi.org/v2/top-headlines?sources=${input}&apiKey=${apiKey}`
    })
  }

  searchNewsAPI = (event) => {
    // set state values - this will trigger an update and componentDidUpdate
    this.setState({
      // get the link text
      newsSource: `${event.target.innerText}`,
      url: `https://newsapi.org/v2/${event.target.name}&apikey=${apiKey}`
    })
    console.log(this.state.url);
  }
  
  //
  // render() method generates the page
  //
  render() {
  // if state.articles is empty copy props to it
    if (this.state.articles.length == 0) {
      this.state.articles = this.props.articles;
    }
  //Return the page content
    return (
      <div>
        <div className="header">
          <h2 className="header">News</h2>
        </div>

      <div className="form">
        {/* add the Dropdown component */}
        <div className="dropdown">
        <Dropdown setNewsSource={this.setNewsSource} visible={false} selected={0} options={[
          {
            "link": "bbc-news",
            "display": "BBC"
          },
          {
            "link": "cnn",
            "display": "CNN"
          },
          {
            "link": "fox-news",
            "display": "Fox News"
          },
          {
            "link": "rte",
            "display": "RTE"
          },
          {
            "link": "mirror",
            "display": "Mirror"
          },
          {
            "link": "google-news",
            "display": "Google News"
          },
        ]}></Dropdown>
        </div>
        <div className="search">
        {/*Add the searchForm component*/}
        {/*Pass the setNewsSource function as a prop with the same name*/}
        <SearchForm setNewsSource={this.setNewsSource}/>
        </div>
      </div>

        {/*Example search links*/}
        <ul className="newsMenu">
          <li><a href="a" onClick={this.searchNewsAPI} name="top-headlines?country=ie">Top Headlines Ireland</a></li>
          <li><a href="a" onClick={this.searchNewsAPI} name="top-headlines?country=ie&category=business">Business News Ireland</a></li>
          <li><a href="a" onClick={this.searchNewsAPI} name="everything?q=technology">Technology News</a></li>
          <li><a href="a" onClick={this.searchNewsAPI} name="top-headlines?country=ie&category=weather">Weather in Ireland</a></li>
        </ul>


        { /* Display a title based on source */}
        <h3>{this.state.newsSource.split("-").join(" ")}</h3>
        <div>
          { /* Iterate through articles using Array map) */}
          { /* Display author, publishedAt, image, description, and content */}
          { /* for each story. Also a link for more.. */}
          {this.state.articles.map((article, index) => (
            <section key={index}>
              <h3>{article.title}</h3>
              <p className="author">{article.author} {article.publishedAt}</p>            
              <img src={article.urlToImage} alt="article image" className="img-article"></img>            
              <p>{article.description}</p>            
              <p>{article.content}</p>            
              <p><Link href={article.url}><a>Read More</a></Link></p>                        
            </section>
          ))}
        </div>

        <style jsx>{`
          /* CSS for this page */
          section {
            display: block;
            width: 20%;
            height: 500px;
            border: .5px solid gray;
            background-color: white;
            padding: .5em;
            margin: .5em;
            float: left;
            overflow: auto;            
          }
          h2.header {
            margin: 0;
            padding: 0;
          }
          .header {
            padding: 5px;
            background-color: #bb1919;
            color:white;            
          }
          .form{
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 150px;
            border: none;
            background-color: white;
            float: centre;
            padding-top: 2px;
            margin-top: .5em;
            overflow: auto;
          }
          .dropdown {
            float: right;
            width 65%;
          }
          .search {
            width: 35%;
            float: left;
          }
          .author {
            font-style: italic;
            font-size: 0.8em;
          }
          .img-article {
            max-width: 50%;
          }
          .newsMenu {
            display: flex;
            flex-direction: row;
            margin: 0;
            padding: 0;
            margin-top: 20px;
          }
          .newsMenu li {
            display: inline-table;
            padding-left: 20px;
          }
          .newsMenu li a {
            font-size: 1em;
            color: black;
            text-decoration: none;
          }
          .newsMenu li a:hover {
            color: #bb1919;
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
} //End render()


//
// Get initial data on server side using an AJAX call
// This will initialise the 'props' for the News page
//

static async getInitialProps(response) {
  // Build the url which will be used to get the data
  // See https://newsapi.org/s/the-irish-times-api
  const initUrl = `https://newsapi.org/v2/top-headlines?sources=${defaultNewsSource}&apiKey=${apiKey}`;
  // Get news data from the api url  
  const data = await getNews(initUrl);  
  // If the result contains and articles array then it is good so return articles  
  if (Array.isArray(data.articles)) {
    return {  
      articles: data.articles  
    }
  }
  // Otherwise it contains an error, log and redirect to error page (status code 400)
  else {  
    console.error(data)  
    if (response) {  
      response.statusCode = 400  
      response.end(data.message);
    }
  }
} // End getInitialProps

// componentDidUpdate is called when the page state or props re updated
// It can be over-ridden to perform other functions when an update occurs
// Here it fetches new data using this.state.newsSource as the source
async componentDidUpdate(prevProps, prevState) {
  // Check if newsSource url has changed to avoid unecessary updates
  if (this.state.url !== prevState.url) {
    // Use api url (from state) to fetch data and call getNews()
    const data = await getNews(this.state.url);
    // If the result contains and articles array then it is good so update articles
    if (Array.isArray(data.articles)) {  
      // Store articles in state  
      this.state.articles = data.articles;  
      // Force page update by changing state (make sure it happens!)  
      this.setState(this.state);  
    }  
    // Otherwise it contains an error, log and redirect to error page (status code 400)  
    else {  
      console.error(data)  
      if (response) {  
        response.statusCode = 400  
        response.end(data.message);  
      }  
    } 
  }
} // End componentDidUpdate

}