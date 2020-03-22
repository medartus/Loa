import pickle
import pandas as pd
import numpy as np
import string
import json
from nltk.corpus import stopwords 

# Process stop words
def text_process(mess):

    stop = []
    for word in stopwords.words('english'):
        s = [char for char in word if char not in string.punctuation]
        stop.append(''.join(s))

    nopunc = [char for char in mess if char not in string.punctuation]
    nopunc = ''.join(nopunc)

    return " ".join([word for word in nopunc.split() if word.lower() not in stop])


# Get business dataframe
def getBusinessDf():
    return pd.read_csv('data/yelp_business.csv')

# Retriving GD results from pkl file
def getMatrix():

    resultspkl = open('data/model.pkl','rb')

    pickle.load(resultspkl) # skip P
    Q = pickle.load(resultspkl)
    userid_vectorizer = pickle.load(resultspkl)
    
    resultspkl.close()
    Q.iloc[0].sort_values(ascending=False).head(10)

    return (Q,userid_vectorizer)

# Df entry to json
def toJson(df_business,i):
    busi = df_business[df_business['business_id']==i]

    # missging : url, display_phone, photos, price

    return {
        "name":             busi["name"].iloc[0],
        "id":               busi["business_id"].iloc[0],
        "rating":           busi["stars"].iloc[0],
        "location":{
            "address1":     busi["address"].iloc[0],
            "city":         busi["city"].iloc[0],
            "postal_code":  busi["postal_code"].iloc[0],
            "state":        busi["state"].iloc[0]
        },
        "coordinates":{
            "longitude":    busi["longitude"].iloc[0],
            "latitude":     busi["latitude"].iloc[0]
        },
        "review_count":     int(busi["review_count"].iloc[0]),
        "attributes":       busi["attributes"].iloc[0],
        "categories":       busi["categories"].iloc[0],
        "hours":            busi["hours"].iloc[0]
    }


# Recommand function from matrix
def recommand(message,Q,userid_vectorizer,df_business,N=10):

  test_df= pd.DataFrame([message], columns=['text'])
  test_df['text'] = test_df['text'].apply(text_process)
  test_vectors = userid_vectorizer.transform(test_df['text'])
  test_v_df = pd.DataFrame(test_vectors.toarray(), index=test_df.index, columns=userid_vectorizer.get_feature_names())
  
  predictItemRating=pd.DataFrame(np.dot(test_v_df.loc[0],Q.T),index=Q.index,columns=['Rating'])
  topRecommendations=pd.DataFrame.sort_values(predictItemRating,['Rating'],ascending=[0])[:N]

  result = []
  for i in topRecommendations.index:
    # result.append(toJson(df_business,i))
    result.append(df_business[df_business['business_id']==i]["business_id"].iloc[0])
  return result

