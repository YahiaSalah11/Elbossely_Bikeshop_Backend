import Bike from "../models/Bike.js";

import fs from 'fs';
import path from 'path';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// ✅ Add Bike (with image upload)
export const addBike = async (req, res) => {
  try {
    const {
      name,
      manufacturer,
      model,
      year,
      newOrUsed,
      specs,
      isFeatured,
      bikeType
    } = req.body;
    console.log('Received data:', req.body);

    // Handle uploaded image paths
    const pictures = req.files.map(file => file.path.replace('public/', ''));

    const newBike = new Bike({
      name,
      manufacturer,
      model,
      year,
      newOrUsed,
      specs,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      pictures,
      bikeType
    });

    await newBike.save();

    res.status(201).json({
      message: 'Bike added successfully',
      bike: newBike
    });

  } catch (error) {
    console.error('Error adding bike:', error);
    res.status(500).json({ message: 'Server error while adding bike' });
  }
};


// // Delete One Bike
// exports.deleteBike = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const bike = await Bike.findByIdAndDelete(id);
//     if (!bike) {
//       return res.status(404).json({ message: 'Bike not found' });
//     }

//     // Remove images from the server

//     bike.pictures.forEach(picture => {
//       // Ensure no double uploads/uploads
//       const cleanPath = picture.replace('uploads/uploads', 'uploads');
//       const filePath = path.join(__dirname, '../public', cleanPath);

//       fs.unlink(filePath, err => {
//         if (err) {
//           console.error('Error deleting image:', filePath, err.message);
//         }
//       });
//     });



//     res.json({ message: 'Bike deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting bike:', error);
//     res.status(500).json({ message: 'Server error while deleting bike' });
//   }
// };  

// Delete One Bike
export const deleteBike = async (req, res) => {
  try {
    const { id } = req.params;
    const bike = await Bike.findByIdAndDelete(id);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    // Remove images from the server
    bike.pictures.forEach(picture => {
      // Remove "public/" if present and fix double uploads
      let cleanPath = picture.replace(/^public[\\/]/, '');
      cleanPath = cleanPath.replace('uploads/uploads', 'uploads');

      const filePath = path.join(__dirname, '../public', cleanPath);

      // Only delete if file exists
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, err => {
          if (err) {
            console.error('Error deleting image:', filePath, err.message);
          }
        });
      } else {
        console.warn('Image file not found:', filePath);
      }
    });

    res.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    console.error('Error deleting bike:', error);
    res.status(500).json({ message: 'Server error while deleting bike' });
  }
};


export const deleteAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find();
    if (bikes.length === 0) {
      return res.status(404).json({ message: 'No bikes found to delete' });
    }

    // Remove images from the server
    bikes.forEach(bike => {
      bike.pictures.forEach(picture => {
        // Ensure no double uploads/uploads
        const cleanPath = picture.replace('uploads/uploads', 'uploads');
        const filePath = path.join(__dirname, '../public', cleanPath);

        fs.unlink(filePath, err => {
          if (err) {
            console.error('Error deleting image:', filePath, err.message);
          }
        });
      });
    });

    // Delete all bikes from DB
    await Bike.deleteMany({});
    res.json({ message: 'All bikes deleted successfully' });

  } catch (error) {
    console.error('Error Deleting All Bikes:', error);
    res.status(500).json({ message: 'Server Error while deleting all Bikes' });
  }
};




// ✅ Get Manufacturers
export const getManufacturers = async (req, res) => {
  try {
    const { newOrUsed } = req.body;
    const query = {};
    if (newOrUsed) query.newOrUsed = newOrUsed;

    const manufacturers = await Bike.distinct('manufacturer', query);
    res.json(manufacturers);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    res.status(500).json({ message: 'Server error while fetching manufacturers' });
  }
};


// ✅ Get Models
export const getModels = async (req, res) => {
  try {
    const { newOrUsed, bikeManufacturer } = req.body;
    const query = {};

    if (newOrUsed) query.newOrUsed = newOrUsed;
    if (bikeManufacturer) query.manufacturer = bikeManufacturer;

    const models = await Bike.distinct('model', query);
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ message: 'Server error while fetching models' });
  }
};


// ✅ Get Years
export const getYears = async (req, res) => {
  try {
    const { newOrUsed, bikeManufacturer, bikeModel } = req.body;
    const query = {};
    if (newOrUsed) query.newOrUsed = newOrUsed;
    if (bikeManufacturer) query.manufacturer = bikeManufacturer;
    if (bikeModel) query.model = bikeModel;

    const years = await Bike.distinct('year', query);
    res.json(years);
  } catch (error) {
    console.error('Error fetching years:', error);
    res.status(500).json({ message: 'Server error while fetching years' });
  }
};


// ✅ Search Bikes (Flexible Query)
export const searchBikes = async (req, res) => {
  try {
    const { newOrUsed, manufacturer, model, year } = req.body;
    const query = {};


    if (newOrUsed && newOrUsed !== 'all') query.newOrUsed = newOrUsed;
    if (manufacturer && manufacturer !== 'all') query.manufacturer = manufacturer;
    if (model && model !== 'all') query.model = model;
    if (year && year !== 'all') query.year = parseInt(year);

    const results = await Bike.find(query);
    res.json(results);  
  } catch (error) {
    console.error('Error searching bikes:', error);
    res.status(500).json({ message: 'Server error while searching bikes' });
  }
};

// ✅ Get Bike by Type
export const getBikesByType = async (req, res) => {
  try {
    
    const { bikeType } = req.body;

    if (!bikeType) {
      return res.status(400).json({ message: "bikeType is required" });
    }

    const bikes = await Bike.find({ bikeType }); // filter by bikeType
    res.json(bikes);

  } catch (error) {
    console.error('Error searching bikes by type:', error);
    res.status(500).json({ message: 'Server error while searching bikes by type' });
  }
};


// ✅ Get Featured Bikes
export const getFeatured = async (req, res) => {
  try {
    const featuredBikes = await Bike.find({ isFeatured: true });
    res.status(200).json(featuredBikes);
  } catch (error) {
    console.error('Error fetching featured bikes:', error);
    res.status(500).json({ message: 'Server error while fetching featured bikes' });
  }
};
