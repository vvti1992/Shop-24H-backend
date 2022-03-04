// Import thư viện mongoose JS
const mongoose = require('mongoose');
const { CustomerModel } = require('../Model/CustomerModel');
// Import Order Model
const { OrderModel } = require('../model/OrderModel');

// Create Order
function createOrder(req, res) {
     // Khởi tạo một đối tượng OrderModel  mới truyền các tham số tương ứng từ request body vào
    const order = new OrderModel({
        _id: mongoose.Types.ObjectId(),
        orderDate: req.body.orderDate,
        requiredDate: req.body.requiredDate,
        shippedDate: req.body.shippedDate,
        note: req.body.note,
        status: req.body.status,
        createDate: req.body.createDate,
        customer: req.params.customerId
    });

    // Gọi hàm order save - là 1 promise (Tiến trình bất đồng bộ)
    order.save()
        // Sau khi update user thành công trả ra status 200 - Success
        .then((Order) => {
            return res.status(200).json({
                success: true,
                message: 'New Order created successfully on Customer',
                Order: Order,
            });
        })
        // Xử lý lỗi trả ra 500 - Server Internal Error
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: error.message,
            });
        });
}

// Get all order
function getAllOrder(req, res) {
    OrderModel.find()
        .select('_id orderCode pizzaSize pizzaType voucher status createDate')
        .then((allOrder) => {
            return res.status(200).json({
                success: true,
                message: 'A list of all order',
                Order: allOrder,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            });
        });
}

// Get single Order
function getSingleOrder(req, res) {
    const id = req.params.orderId;

    OrderModel.findById(id)
        .then((singleOrder) => {
            if(singleOrder){
                return res.status(200).json({
                    success: true,
                    message: `Get data on Order`,
                    Order: singleOrder,
                });
            } else {
                return res.status(404).json({
                    message: "Fail",
                    error: "Order not found",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'This order does not exist',
                error: err.message,
            });
        });
}

// update order
function updateOrder(req, res) {
    const orderId = req.params.orderId;
    const updateObject = req.body;
    OrderModel.findByIdAndUpdate(orderId, updateObject)
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Order is updated',
                updateOrder: updateObject,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.'
            });
        });
}

// delete a order
function deleteOrder(req, res) {
    const id = req.params.orderId;

    OrderModel.findByIdAndRemove(id)
        .then(() => res.status(200).json({
            success: true,
            message: "Delete succeed"
        }))
        .catch((err) => res.status(500).json({
            success: false,
        }));
}

module.exports = { createOrder, getAllOrder, updateOrder, getSingleOrder, deleteOrder };