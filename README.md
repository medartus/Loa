# Kuai

The goal is to create a chatbot wich can recommend restaurant and display with our custom web interface. 

## How does it work ?
We use wit.ai to convert text to intent using NLP. We have trained a model in Python to recommend restaurant with the user preference. Otherwise if they don't need recommendation, we use the yelp API to provide some information. Node.js merge all this processing into one service wich is going to be easier to use in the front end.

![stack schema](https://user-images.githubusercontent.com/45569127/76697698-96401400-669a-11ea-90af-80bbfb78d9ca.JPG)

## What can we do with it ?

### **Show restaurants**

Type of Question :

* Can you **show** me the **restaurants** **around me** ?
* Can you **show** me the **restaurants** in **Los Angeles** ?
* **Map** of **restaurants** in **Paris**.
* What are the **better rated** **restaurants** in **Los Angeles** ?
* Which **restaurants** are open **around me** ?

#### Example



*1 - Request :*

Requesting the Node API :  
`Endpoint :` POST /message

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

*2 - Wit.ai Intent extraction :*

The question :

> Can you **show** me the **restaurants** in **Los Angeles** ?

Will return :

|Variable|Value|
|:-:|:-:|
|`Intent`|Show|
|`Object`|Restaurants|
|`Location`|Los Angeles|

*3 - Response :*

With the information, we call the `Yelp API` and use the relust to build our API response :


```json
{
    "Intent": "Show",
    "Object": "Restaurants",
    "Location": {
        "name": "Los Angeles",
        "coordinates": {
                "latitude": 34.052234,
                "longitude": -118.243685
            }
    },
    "Response": "You will find a map of restaurants in Los Angeles.",
    "Results": [
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


*4 - User reponse generation*

After getting all the information in order to answer the user demand, we use Natural Language Generation to display a response.

additionally, we display the concenred result(s) on the right side of our web application.


GrapQL Request :
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


<!-- ### **Find the best restaurant**
Type of Question

* What is the best restaurant in New York ? -->
