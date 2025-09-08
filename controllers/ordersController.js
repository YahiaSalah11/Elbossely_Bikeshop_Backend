import Order from "../models/Order.js";
import Bike from "../models/Bike.js";


// ✅ Make Order
export const createOrder = async (req, res) => {
  try {
    const { choosenBikeId, userId, contactInfo } = req.body;

    // Check if bike exists
    const bike = await Bike.findById(choosenBikeId);
    if (!bike) {
      console.error('Bike not found:', choosenBikeId);
      return res.status(404).json({ message: 'Bike not found' });
    }

    const newOrder = new Order({
      bike: choosenBikeId,
      user: userId || null, // null for guest orders
      contactInfo: contactInfo
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error making order:', error);
    res.status(500).json({ message: 'Server error while making order' });
  }
};



// Search Orders by ID, username, or phone number or email
export const searchOrders = async (req, res) => {
  try {
    const { searchTerm } = req.query; // from ?searchTerm=value in URL

    if (!searchTerm) {
      return res.status(400).json({ message: 'Please provide a search term' });
    }

    let query = {};

    // Check if it's a valid ObjectId → search by order ID
    if (/^[0-9a-fA-F]{24}$/.test(searchTerm)) {
      query._id = searchTerm;
    } else {
      // Otherwise search by name or phone or email
      query = {
        $or: [
          { 'contactInfo.name': { $regex: searchTerm, $options: 'i' } },
          { 'contactInfo.phone': { $regex: searchTerm, $options: 'i' } },
          { 'contactInfo.email': { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    const orders = await Order.find(query)
      .populate('bike') // show bike details
      .populate('user'); // show user details if exists

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);

  } catch (error) {
    console.error('Error searching orders:', error);
    res.status(500).json({ message: 'Server error while searching orders' });
  }
};


// ✅ Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('bike')   // Populate bike details
      .populate('user');  // Populate user details when you have auth

    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// ✅ Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
};
