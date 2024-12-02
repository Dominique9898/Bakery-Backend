import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { ProductController } from '../controllers/productController';

const router = Router();

router.get('/listAllProducts', ProductController.getAllProducts);
router.get('/getById/:productId', ProductController.getProductById);
router.post('/create', upload.single('image'), ProductController.createProduct);
router.put('/update/:productId', upload.single('image'), ProductController.updateProduct);
router.delete('/delete/:productId', ProductController.deleteProduct);
router.get('/:productId/tags', ProductController.getProductTags);
router.get('/:productId/tag-options/:tagId', ProductController.getProductTagOptions);
router.post('/:productId/tag-batch', ProductController.addProductTags);
router.delete('/:productId/tag-batch', ProductController.removeProductTags);
router.delete(
  '/:productId/tag-options/:optionId', 
  ProductController.removeProductTagOption
);

export default router;