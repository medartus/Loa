# Loa 🧙‍♀️

A small AI-based conversational agent capable of providing accurate informations about U.S located restaurants, and integrated with a content-based recommendation engine.

## Demo

![](https://media.giphy.com/media/gfwGJdXuj08X4YcRQu/source.gif)

## **Table of contents**:

- [Loa 🧙‍♀️](#loa-%f0%9f%a7%99%e2%80%8d%e2%99%80%ef%b8%8f)
  - [Demo](#demo)
  - [**Table of contents**:](#table-of-contents)
  - [🎯 Objectives](#%f0%9f%8e%af-objectives)
    - [Tech-Stack and Implementation](#tech-stack-and-implementation)
      - [Front-end](#front-end)
      - [Back-end](#back-end)
        - [Chatbot API](#chatbot-api)
        - [Recommendation Engine](#recommendation-engine)
  - [📝 To do](#%f0%9f%93%9d-to-do)
  - [👩‍💻 Usage](#%f0%9f%91%a9%e2%80%8d%f0%9f%92%bb-usage)
    - [Chatbot Capabilities](#chatbot-capabilities)
    - [**2 - How many restaurants**](#2---how-many-restaurants)
      - [Example](#example)
    - [**2 - Search restaurants**](#2---search-restaurants)
      - [Example](#example-1)
    - [**3 - Find the best restaurant**](#3---find-the-best-restaurant)
      - [Example](#example-2)
    - [**4 - Greeting**](#4---greeting)
      - [Example](#example-3)
    - [**5 - Example**](#5---example)
      - [Example](#example-4)
    - [**5 - Example**](#5---example-1)
      - [Example](#example-5)
    - [**6 - Thanks**](#6---thanks)
      - [Example](#example-6)
    - [**7 - Goodbye**](#7---goodbye)
      - [Example](#example-7)
    - [**8 - Conversation**](#8---conversation)
      - [Example](#example-8)
    - [Recommendation Engine](#recommendation-engine-1)
  - [🏃‍♀️ Testing](#%f0%9f%8f%83%e2%80%8d%e2%99%80%ef%b8%8f-testing)

<a name="objectives"/>

## 🎯 Objectives

<a name="stack"/>

### Tech-Stack and Implementation

We use [wit.ai](https://wit.ai) to convert text to intent using NLP. We have trained a model in Python to recommend restaurant with the user preference. Otherwise if they don't need recommendation, we use the yelp API to provide some information. Node.js merge all this processing into one service wich is going to be easier to use in the front end.

![stack schema](https://user-images.githubusercontent.com/45569127/76697698-96401400-669a-11ea-90af-80bbfb78d9ca.JPG)

<a name="front-end"/>

#### Front-end

<a name="back-end"/>

#### Back-end

<a name="chatbot-api"/>

##### Chatbot API

<a name="recommendation-engine-stack"/>

##### Recommendation Engine

<a name="todo"/>

## 📝 To do

- [x] Desing & Prototype on Figma
- [x] Define constraints and objectives
- [x] Implement basic front-end interface
- [x] Train wit.ai agent on our intents
- [x] Design and Connect Node API to wit.ai
- [x] Gather data and design Recommendation Engine
- [x] Serve our APIS as services and host them
- [x] Finish front-end interface
- [ ] Test along the way

<a name="usage"/>

## 👩‍💻 Usage

<a name="chatbot-capabilities"/>

### Chatbot Capabilities

<a name="number-restaurants" />

### **2 - How many restaurants**

Type of Question:

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

<a name="show-restaurants"/>

### **2 - Search restaurants**

Type of Question :

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

In our example we want to display a map of the result and tell it to the user.

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

<a name="best-restaurant"/>

### **3 - Find the best restaurant**

Type of Question

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

In our example we want to display a map of the result and tell it to the user.

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
    }
  ]
}
```

<a name="greeting"/>

### **4 - Greeting**

Type of Question:

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

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display a map of the result and tell it to the user.

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

<a name="example"/>

### **5 - Example**

Type of Question:

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

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display a map of the result and tell it to the user.

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

<a name="example"/>

### **5 - Example**

Type of Question:

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

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display a map of the result and tell it to the user.

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

<a name="thanks"/>

### **6 - Thanks**

Type of Sentence:

- **Thanks** for helping me
- **Thank your** for your help
- **Thank you** for your response

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

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display a map of the result and tell it to the user.

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

<a name="goodbye"/>

### **7 - Goodbye**

Type of Sentence:

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

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display a map of the result and tell it to the user.

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

<a name="conversation"/>

### **8 - Conversation**

This one is particular, it applies to all the sentence that bot didn't train on, but are not a question from the user.

Type of Sentence (endless):

- Ahah I agree!
- Oh that is cool!
- Awesome I like the results

#### Example

_1 - Node.js API request :_

Requesting the Node API :  
`Endpoint :` POST /message

We call our Node API we this structure :

```json
{
  "message": "Ahah I agree! ",
  "user": {
    "coordinates": {
      "latitude": 34.052234,
      "longitude": -118.243685
    }
  }
}
```

_2 - User reponse generation_

After getting all the information in order to answer the user demand, **we use Natural Language Generation to display a response**.

additionally, **we display the concenred result(s) on the right side of our web application**.

In our example we want to display a map of the result and tell it to the user.

_4 - Node.js API response_

Gathering all of these steps, our API will return a sample response :

```json
{
  "intent": "Misunderstanding",
  "type": null,
  "location": null,
  "message": "I find it pretty cool 🤓",
  "results": []
}
```

<a name="recommendation-engine"/>

### Recommendation Engine

<a name="testing"/>

## 🏃‍♀️ Testing
