const express = require('express');
const authMiddleware = require('../../middleware/middleware');
const router = express.Router();

const adminController = require('../../controller/admin/admin')
router.get('/add-product', authMiddleware, adminController.addProduct);
 router.post('/add-product', authMiddleware, adminController.getProduct);
router.get('/edit-product/:productId', authMiddleware, adminController.editProduct);
router.post('/edit-product', authMiddleware, adminController.postEditProduct)
router.get('/products', authMiddleware, adminController.getProducts)
router.post('/products', authMiddleware, adminController.deleteProduct)

module.exports = router;