import express from 'express';

import commentController from '../controllers/commentController';

const router = express.Router();

router.get('/', commentController.getComments);
router.get('/:id', commentController.getCommentById);
router.post('/add/:id', commentController.addCommentPost);
router.put('/:id', commentController.updateCommentPost);
router.delete('/:id', commentController.deleteCommentPost);

export default router;

