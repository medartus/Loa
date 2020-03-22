const businessInfos = (i,id) => {
  return `b${i}: business(id: "${id}")
    {
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
    }\n`
}

const businessQuery = (ids) => {
  query = '{'
  for(let i = 0; i<ids.length;i++){
    query+=businessInfos(i,ids[i])
  }
  query += '}'
  return query
}

const searchQuery = (term, long, lat) => {
  return `{
    search(term:"${term}", longitude:${long},latitude:${lat}) {
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
  }`
}

const bestQuery = (term, long, lat) => {
  return `{
    search(term:"${term}", longitude:${long},latitude:${lat}) {
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
  }`
}

const howManyQuery = (term, long, lat) => {
  return `{
    search(term: "${term}", longitude:${long},latitude:${lat}) {
      total
    }
  }`
}

module.exports = { businessQuery, searchQuery , bestQuery, howManyQuery }