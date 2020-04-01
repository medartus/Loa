# Loa 🧙‍♀️

A small AI-based conversational agent capable of providing accurate informations about U.S located restaurants, and integrated with a content-based recommendation engine.

## Demo

<img src="demo.gif" alt="demo" width="100%" height="auto" />

## Table of contents:

- [Loa 🧙‍♀️](#loa-%EF%B8%8F)
  - [Demo](#demo)
  - [Table of contents:](#table-of-contents)
  - [🎯 Objectives](#-objectives)
    - [Tech-Stack and Implementation](#tech-stack-and-implementation)
      - [Front-end](#front-end)
      - [Back-end](#back-end)
        - [_1 - Chatbot API (NodeJS)_](#1---chatbot-api-nodejs)
        - [_2 - Recommendation Engine API (Flask)_](#2---recommendation-engine-api-flask)
  - [🏃‍♀️ How to test it ?](#%EF%B8%8F-how-to-test-it-)
  - [👩‍💻 Usage (Workflows)](#-usage)
    - [Chatbot Capabilities (Workflows)](#chatbot-capabilities-workflows)
    - [**1 - How many restaurants**](#1---how-many-restaurants)
      - [Example](#example)
    - [**2 - Search restaurants**](#2---search-restaurants)
      - [Example](#example-1)
    - [**3 - Find the best restaurant**](#3---find-the-best-restaurant)
      - [Example](#example-2)
    - [**4 - Greeting**](#4---greeting)
      - [Example](#example-3)
    - [**5 - Example**](#5---example)
      - [Example](#example-4)
    - [**6 - Thanks**](#6---thanks)
      - [Example](#example-5)
    - [**7 - Goodbye**](#7---goodbye)
      - [Example](#example-6)
    - [**Recommendation Engine**](#recommendation-engine)
      - [Example](#example-7)
  - [📝 To do](#-to-do)

## 🎯 Objectives

### Tech-Stack and Implementation

We use [wit.ai](https://wit.ai) to convert user-text to intents using **Natural Language Processing**. We have trained a model with Python to recommend restaurants with respect to user queries and desires. If they do not ask for recommendation, we use the yelp API to provide information based on user-location and his query.

![stack schema](https://user-images.githubusercontent.com/45569127/76697698-96401400-669a-11ea-90af-80bbfb78d9ca.JPG)

#### Front-end

In this project and in like many nowadays, we chose to use **React** for the client interface.

**Description**

React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.React is only concerned with rendering data to the DOM.

**How we use it**

We use React for all the frontend part. React only powers the user interface, interprets what the user wants to perform and calls our NodeJS API.

#### Back-end

For the back-end, we decided to stay with NodeJS as a central service, as it's a technology we are familiar and realtively easy to integrate with other services. We also have a Python Flask API, which powers the recommendation of restaurants.

##### _1 - Chatbot API (NodeJS)_

**Description**

Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser.

**How we use it**

We use it to centralize the variety of the user's requests. It almost serves as a middleware between the client, and the three various API's (wit.ai, yelp and our own recommender API). For every message that the user sends, we send the payload to wit from there, and then handle the logic of calling either YELP or our own recommender system.

##### _2 - Recommendation Engine API (Flask)_

**Description**

Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications. It began as a simple wrapper around Werkzeug and Jinja and has become one of the most popular Python web application frameworks.

**How we use it**

We use Flask to build a basic API that will handle only one route for recommending restaurants. This API is agnostic of all the intent extracting and analysis logic, it's only made to provide an abstraction to return recommended restaurants to the NodeJS API.

## 🏃‍♀️ How to test it ?

You can test the project with a live demo by going [there!](https://loabot.netlify.com/)

Or, you can test this project locally with **Docker** using the following steps :

1. First clone this repository

```
git clone https://github.com/MarcEtienneDartus/Loa.git
```

2. Then **in the project folder** run:

```
docker-compose up
```

The project will then be available on http://DOCKER_IP_HOST url, which in most cases, will be http://localhost

## 👩‍💻 Usage (Workflows)

### **1 - How many restaurants**

Types of Question:

- How **many** **restaurants** are in **New York** ?
- What is the **number** of **restaurants** **around me** ?
- What is the **number** of **restaurants** in **Colorado** ?

#### Example

_1 - Request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "What is the number of restaurants in Colorado ?",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The question :

> What is the **number** of **restaurants** in **Colorado** ?

Will return :

|  Variable  |    Value    |
| :--------: | :---------: |
|  `Intent`  |   Number    |
|  `Object`  | Restaurants |
| `Location` |  Colorado   |

_3 - Yelp API :_

With the information, we call the _Yelp API_ and use the result to build our API response :

_Yelp Graphql API request :_

```
{
  search(term: "restaurant", location:"Colorado") {
    total
  }
}
```

_Yelp Graphql API response :_

```json
{
  "data": {
    "search": {
      "total": 2952
    }
  }
}
```

_4 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display a map of the result and tell it to the user.

_5 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Number",
  "type": "Restaurants",
  "location": {
    "name": "Colorado",
    "coordinates": {
      "latitude": 39.55051,
      "longitude": -105.782067
    }
  },
  "message": "There are 2952 restaurants in Colorado. ⏲️",
  "results": []
}
```

### **2 - Search restaurants**

Types of Question :

- Can you **show** me the **restaurants** **around me** ?
- Can you **show** me the **restaurants** in **Los Angeles** ?
- **Map** of **restaurants** in **Paris**.

#### Example

_1 - Node.js API request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "Can you show me the restaurants in Los Angeles ?",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The question :

> Can you **show** me the **restaurants** in **Los Angeles** ?

Will return :

|  Variable  |    Value    |
| :--------: | :---------: |
|  `Intent`  |   Search    |
|  `Object`  | Restaurants |
| `Location` | Los Angeles |

_3 - Yelp API :_

With the information, we call the _Yelp API_ and use the result to build our API response :

_Yelp Graphql API request :_

```
{
  search(term: "restaurant", location:"Los Angeles") {
    business {
      name
      id
      url
      display_phone
      rating
      price
      location {
        address1
        city
        postal_code
      }
      coordinates {
        latitude
        longitude
      }
      photos
    }
  }
}
```

_Yelp Graphql API response :_

```json
{
  "data": {
    "search": {
      "business": [
        {
          "name": "Howlin' Ray's",
          "id": "7O1ORGY36A-2aIENyaJWPg",
          "url": "https://www.yelp.com/biz/howlin-rays-los-angeles-3?adjust_creative=94DePyCeUwdjASSwoI0YbA&utm_campaign=yelp_api_v3&utm_medium=api_v3_graphql&utm_source=94DePyCeUwdjASSwoI0YbA",
          "display_phone": "(213) 935-8399",
          "rating": 4.5,
          "price": "$$",
          "location": {
            "address1": "727 N Broadway",
            "city": "Los Angeles",
            "postal_code": "90012"
          },
          "coordinates": {
            "latitude": 34.061517,
            "longitude": -118.239716
          },
          "photos": [
            "https://s3-media2.fl.yelpcdn.com/bphoto/9hGoyECcrewigEKYEnrYTw/o.jpg"
          ]
        }
      ]
    }
  }
}
```

_4 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display restaurants searched by the user.

_5 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Search",
  "type": "Restaurants",
  "location": {
    "name": "Los Angeles",
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  },
  "message": "You can find a selection of restaurants in Los Angeles. 🏨",
  "results": [
    {
      "name": "Howlin' Ray's",
      "id": "7O1ORGY36A-2aIENyaJWPg",
      "url": "https://www.yelp.com/biz/howlin-rays-los-angeles-3?adjust_creative=94DePyCeUwdjASSwoI0YbA&utm_campaign=yelp_api_v3&utm_medium=api_v3_graphql&utm_source=94DePyCeUwdjASSwoI0YbA",
      "display_phone": "(213) 935-8399",
      "rating": 4.5,
      "price": "$$",
      "location": {
        "address1": "727 N Broadway",
        "city": "Los Angeles",
        "postal_code": "90012"
      },
      "coordinates": {
        "latitude": 34.061517,
        "longitude": -118.239716
      },
      "photos": [
        "https://s3-media2.fl.yelpcdn.com/bphoto/9hGoyECcrewigEKYEnrYTw/o.jpg"
      ]
    }
  ]
}
```

### **3 - Find the best restaurant**

Types of Question

- What is the **best** **restaurant** in **New York** ?
- What is the **best** **restaurant** **around me** ?
- Find the **best** **restaurant** in **Paris** ?
- Find the **best** **restaurant** **near me** ?
- Find the **best** **restaurant** near **111 8th Ave New York** ?

#### Example

_1 - Request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "What is the best restaurant in New York ?",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The question :

> Can you **show** me the **restaurants** in **Los Angeles** ?

Will return :

|  Variable  |    Value    |
| :--------: | :---------: |
|  `Intent`  |    Best     |
|  `Object`  | Restaurants |
| `Location` |  New York   |

_3 - Yelp API :_

With the information, we call the _Yelp API_ and use the result to build our API response :

_Yelp Graphql API request :_

```
{
  search(term: "restaurant", location:"New York") {
    business {
      name
      id
      url
      display_phone
      review_count
      rating
      price
      location {
        address1
        city
        postal_code
      }
      coordinates {
        latitude
        longitude
      }
      photos
    }
  }
}
```

_Yelp Graphql API response :_

```json
{
  "data": {
    "search": {
      "business": [
        {
          "name": "LoveMama",
          "id": "jjJc_CrkB2HodEinB6cWww",
          "url": "https://www.yelp.com/biz/lovemama-new-york?adjust_creative=94DePyCeUwdjASSwoI0YbA&utm_campaign=yelp_api_v3&utm_medium=api_v3_graphql&utm_source=94DePyCeUwdjASSwoI0YbA",
          "display_phone": "(212) 254-5370",
          "review_count": 4988,
          "rating": 4.5,
          "price": "$$",
          "location": {
            "address1": "174 2nd Ave",
            "city": "New York",
            "postal_code": "10003"
          },
          "coordinates": {
            "latitude": 40.7303859,
            "longitude": -73.9860613
          },
          "photos": [
            "https://s3-media1.fl.yelpcdn.com/bphoto/bLlFKTlVuLfmF-lIDGIjZA/o.jpg"
          ]
        }
      ]
    }
  }
}
```

_4 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display the best results and tell it to the user.

_5 - Node.js API response_

Gathering all of these steps, our API will return a sample response a sample response:

```json
{
  "intent": "Best",
  "type": "Restaurants",
  "location": {
    "name": "New York",
    "coordinates": {
      "latitude": 40.7122775,
      "longitude": -74.005973
    }
  },
  "message": "The best restaurant in New York is LoveMama. 💯",
  "results": [
    {
      "name": "LoveMama",
      "id": "jjJc_CrkB2HodEinB6cWww",
      "url": "https://www.yelp.com/biz/lovemama-new-york?adjust_creative=94DePyCeUwdjASSwoI0YbA&utm_campaign=yelp_api_v3&utm_medium=api_v3_graphql&utm_source=94DePyCeUwdjASSwoI0YbA",
      "display_phone": "(212) 254-5370",
      "review_count": 4988,
      "rating": 4.5,
      "price": "$$",
      "location": {
        "address1": "174 2nd Ave",
        "city": "New York",
        "postal_code": "10003"
      },
      "coordinates": {
        "latitude": 40.7303859,
        "longitude": -73.9860613
      },
      "photos": [
        "https://s3-media1.fl.yelpcdn.com/bphoto/bLlFKTlVuLfmF-lIDGIjZA/o.jpg"
      ]
    }, ...
  ]
}
```

### **4 - Greeting**

Types of Question:

- **Hello**, how are you ?
- **Good morning**!
- **Hi**, what's up ?

#### Example

_1 - Node.js API request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "Hi, what's up ?",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The question :

> **Hi**, what's up ?

Will return :

| Variable |  Value   |
| :------: | :------: |
| `Intent` | Greeting |

_3 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

_4 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Greeting",
  "type": null,
  "location": null,
  "message": "Hi, what's can I do for you today ? 👩",
  "results": []
}
```

### **5 - Example**

Types of Question:

- Can I get an **example** ?
- Can you give me an **example** of question ?
- What can I **ask** you ?

#### Example

_1 - Node.js API request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "Can I get an example ?",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The question :

> Can I get an **example** ?

Will return :

| Variable |  Value  |
| :------: | :-----: |
| `Intent` | Example |

_3 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

_4 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Example",
  "type": null,
  "location": null,
  "message": "Here's some examples: 📝 - Can you recommend me an italian restaurant ?\n     - What is the number of restaurants in Seattle ?   - Can you show me the restaurants around me ?\n   - What is the best restaurant in Los Angeles ?\n",
  "results": []
}
```

### **6 - Thanks**

Types of Sentence:

- **Thanks** for helping me
- **Thank you** for your help
- **Thank you** for your responses

#### Example

_1 - Node.js API request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "Thanks for helping me",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The question :

> **Thanks** for helping me

Will return :

| Variable | Value  |
| :------: | :----: |
| `Intent` | Thanks |

_3 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

_4 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Thanks",
  "type": null,
  "location": null,
  "message": "Don't worry, I'm very happy to help you ! 🤗 Need more help ?",
  "results": []
}
```

### **7 - Goodbye**

Types of Sentence:

- **Goodbye**
- See you **soon** !
- I'm going to **leave**, bye !

#### Example

_1 - Node.js API request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "Goodbye",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The sentence :

> **Goodbye**

Will return :

| Variable |  Value  |
| :------: | :-----: |
| `Intent` | Goodbye |

_3 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

_4 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Goodbye",
  "type": null,
  "location": null,
  "message": "I was a pleasure to help you, goodbye ! 😀",
  "results": []
}
```

### **Recommendation Engine**

As said above, we decided to build our own API and recommender system with Python, to be able to **recommend restaurants to users**.

The technique we have used is more vastly acknowledge as **collaborative filtering**:

We have used ratings from users on a subset of US-based restaurants to predict the rating of a restaurant unseen by the user, let's deep dive into how we trained a model to do that.

After having collected the user data with reviews and ratings, we also collected items (the restaurants) and determined **user profiles**.

To obtain the profile matrices we follewed the same routine:

- **Combine** the reviews/descriptions
- **Remove** noisy data (stopwords, punctuation, ...)
- **TF-IDF Feature vector extraction** on each of the items/users.

Then with a sample input from the user: "I want to eat italain pizza", the system recommends the items that matches the most this review/description.

**Here is how it works under the hood:**

Types of Sentence:

- I want to eat some **italian pizza**!
- Recommend me restaurants with **fresh pasta**.
- Can you show me restaurants with **outstanding views** ?

#### Example

_1 - Node.js API request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "I want to eat some italian pizza!",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - Wit.ai Intent extraction :_

Wit.ai will exctract intent and entities from the user question.

The sentence :

> I want to eat some **italian pizza**!

Will return :

| Variable |     Value     |
| :------: | :-----------: |
| `Intent` |   Recommend   |
| `Desire` | Italian pizza |

_3 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

_4 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Recommend",
  "type": null,
  "location": null,
  "message": "Oh, italian pizza is a good idea! Let me recommend you these restaurants. 🔮",
  "results": [
    {
      "name": "I want to eat some **italian pizza**!",
      "id": "jjJc_CrkB2HodEinB6xWww",
      "url": "https://www.yelp.com/biz/venezias-new-york-style-pizzeria-tempe-4?adjust_creative=94DePyCeUwdjASSwoI0YbA&utm_campaign=yelp_api_v3&utm_medium=api_v3_graphql&utm_source=94DePyCeUwdjASSwoI0YbA",
      "display_phone": "(212) 254-5370",
      "review_count": 714,
      "rating": 4,
      "price": "$",
      "location": {
        "address1": "174 2nd Ave",
        "city": "Tempe",
        "postal_code": "85282"
      },
      "coordinates": {
        "latitude": 40.7303859,
        "longitude": -73.9860613
      },
      "photos": [
        "https://s3-media4.fl.yelpcdn.com/bphoto/kblyz8LxF5FCGuMvLeJFqg/o.jpg"
      ]
    }, ...
  ]
}
```
## 📝 To do

- [x] Desing & Prototype on Figma
- [x] Define constraints and objectives
- [x] Implement basic front-end interface
- [x] Train wit.ai agent on our intents
- [x] Design and Connect Node API to wit.ai
- [x] Gather data and design Recommendation Engine
- [x] Serve our APIS as services and host them
- [x] Finish front-end interface
- [x] Test along the way
