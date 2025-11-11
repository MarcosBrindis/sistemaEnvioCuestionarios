import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { createTypeQuestionController } from '../controller/createTypeQuestionController';
import { updateTypeQuestionController } from '../controller/updateTypeQuestionController';
import { deleteTypeQuestionController } from '../controller/deleteTypeQuestionController';
import { getTypeQuestionsController } from '../controller/getTypeQuestionsController';

const router = Router();

// controladores
const createTypeQuestion = createTypeQuestionController(dependencies.createTypeQuestion);
const updateTypeQuestion = updateTypeQuestionController(dependencies.updateTypeQuestion);
const deleteTypeQuestion = deleteTypeQuestionController(dependencies.deleteTypeQuestion);
const getTypeQuestions = getTypeQuestionsController(dependencies.getTypeQuestionById, dependencies.getAllTypeQuestions);



// Rutas 
router.post('/', createTypeQuestion);
router.get('/', getTypeQuestions);      
router.get('/:id', getTypeQuestions); 
router.patch('/:id', updateTypeQuestion);
router.delete('/:id', deleteTypeQuestion);

export default router;