const express = require('express');
const { readFileSync } = require('fs');
const Fuse = require('fuse.js');
const { removeUniqueObjects, paginate } = require('./utils');

const app = express();
const port = 3000;

app.use(express.json());

const hotelsData = JSON.parse(readFileSync('data/hotels.json', 'utf-8'));
const hotelsFuse = new Fuse(hotelsData, {
  keys: ['property_name', 'city', 'area', 'state'],
  includeScore: true,
});

function searchCities({ query }) {
  const results = hotelsFuse.search(query);
  return removeUniqueObjects(results.map((result) => ({
      area: result.item.area,
      city: result.item.city,
      state: result.item.state,
    }))
  )
}

app.get('/auto-complete', (req, res) => {
  const { query, offset = 0, limit = 50 } = req.query;
  res.status(200).json({
    cities: paginate(searchCities({ query }), offset, limit),
  });
});


function searchHotel(query) {
  const results = hotelsFuse.search(query);
  return results.map((result) => ({
    id: result.item.property_id,
    name: result.item.property_name,
    address: result.item.address,
    area: result.item.area,
    city: result.item.city,
    state: result.item.state,
    hotel_star_rating: parseInt(result.item.hotel_star_rating, 10) || null,
    site_review_rating: parseInt(result.item.site_review_rating, 10) || null,
    site_review_count: parseInt(result.item.site_review_count, 10) || null,
  }));
}

app.get('/hotels', (req, res) => {
  const { query, offset = 0, limit = 50 } = req.query;
  res.status(200).json({
    hotels: paginate(searchHotel(query), offset, limit),
  });
});

// Start the server
app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});

