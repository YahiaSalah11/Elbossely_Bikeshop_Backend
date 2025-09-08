import express from 'express';
import upload from '../middlewares/multer.js';

const router = express.Router();

import {
  addBike,
  deleteBike,
  deleteAllBikes,
  getManufacturers,
  getModels,
  getYears,
  searchBikes,
  getBikesByType,
  getFeatured
} from '../controllers/bikeController.js';

router.post('/add', upload.array('pictures', 6), addBike);
router.delete('/deletebike/:id', deleteBike);
router.delete('/deleteallbikes', deleteAllBikes);

// ✅ Get Manufacturers, Models, Years, and Search Bikes
// These endpoints use POST to allow for flexible query parameters
router.post('/manufacturers', getManufacturers);
router.post('/models', getModels);
router.post('/years', getYears);
router.post('/search', searchBikes);
router.post('/bikesbytype', getBikesByType);
router.get("/featured", getFeatured);


export default router;


