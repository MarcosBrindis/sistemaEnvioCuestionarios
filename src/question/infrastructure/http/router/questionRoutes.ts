import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { createQuestionController } from '../controller/createQuestionController';
import { updateQuestionController } from '../controller/updateQuestionController';
import { deleteQuestionController } from '../controller/deleteQuestionController';
import { getQuestionsController } from '../controller/getQuestionsController';

const router = Router();

// Controladores
const createQuestion = createQuestionController(dependencies.createQuestion);
const updateQuestion = updateQuestionController(dependencies.updateQuestion);
const deleteQuestion = deleteQuestionController(dependencies.deleteQuestion);
const getQuestions = getQuestionsController(
  dependencies.getAllQuestions,
  dependencies.searchQuestionsByText
);

// Rutas 
router.post('/', createQuestion);
router.get('/', getQuestions);      
router.get('/:id', getQuestions); 
router.patch('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
