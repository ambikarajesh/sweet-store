const express = require('express');

const router = express.Router();

const adminController = require('../../controller/admin/admin')
router.get('/add-product', adminController.addProduct);
router.post('/add-product', adminController.getProduct);
router.get('/edit-product/:productId', adminController.editProduct);
router.post('/edit-product', adminController.postEditProduct)
router.get('/products', adminController.getProducts)
router.post('/products', adminController.deleteProduct)

module.exports = router;