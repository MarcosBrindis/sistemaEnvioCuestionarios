import { Request, Response, NextFunction } from 'express';
import { GetAllQuestions, SearchQuestionsByText } from '../../../application/usecase/GetQuestion';
import { handleGetError } from '../../../../core/middleware/errorHandler';
import { QuestionRepositoryMySQL } from '../../database/mysql/QuestionRepositoryMySQL';

const questionRepo = new QuestionRepositoryMySQL();

export const getQuestionsController = (
  getAllQuestions: GetAllQuestions,
  searchQuestionsByText: SearchQuestionsByText
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { texto } = req.query;
    
    // Si hay query parameter 'texto', realizar búsqueda
    if (texto && typeof texto === 'string') {
      const questions = await searchQuestionsByText.execute(texto);
      
      // Respuesta con formato JSON API para colección de búsqueda
      res.status(200).json({
        data: questions.map(question => ({
          type: 'preguntas',
          id: question.id_pregunta?.toString(),
          attributes: {
            texto_pregunta: question.texto_pregunta,
            es_obligatoria: question.es_obligatoria
          },
          relationships: {
            'tipo-pregunta': {
              data: { 
                type: 'tipos-pregunta', 
                id: question.id_tipo_pregunta.toString() 
              }
            }
          }
        })),
        meta: {
          total: questions.length,
          query: texto
        }
      });
      return;
    }
    
    // Si hay ID, buscar una específica CON OPCIONES
    if (id) {
      const questionWithOptions = await questionRepo.getQuestionWithOptions(Number(id));
      
      if (!questionWithOptions) {
        res.status(404).json({
          error: {
            status: '404',
            title: 'Not Found',
            detail: 'La pregunta no fue encontrada'
          }
        });
        return;
      }

      // Verificar si es de tipo "abierta" y tiene opciones (excepción)
      const tipoNombre = questionWithOptions.tipo_pregunta_nombre?.toLowerCase();
      if (tipoNombre === 'abierta' && questionWithOptions.opciones?.length > 0) {
        res.status(400).json({
          error: {
            status: '400',
            title: 'Bad Request',
            detail: 'Las preguntas de tipo abierta no deben tener opciones asociadas'
          }
        });
        return;
      }
      
      // Respuesta con formato JSON API para un recurso con opciones anidadas
      res.status(200).json({
        data: {
          type: 'preguntas',
          id: questionWithOptions.id_pregunta?.toString(),
          attributes: {
            texto_pregunta: questionWithOptions.texto_pregunta,
            es_obligatoria: questionWithOptions.es_obligatoria
          },
          relationships: {
            'tipo-pregunta': {
              data: { 
                type: 'tipos-pregunta', 
                id: questionWithOptions.id_tipo_pregunta.toString() 
              }
            },
            opciones: {
              data: questionWithOptions.opciones?.map((opcion: any) => ({
                type: 'opciones-pregunta',
                id: opcion.id_opcion_pregunta?.toString(),
                attributes: {
                  texto_opcion: opcion.texto_opcion,
                  etiqueta: opcion.etiqueta
                }
              })) || []
            }
          }
        }
      });
      return;
    }
    
    // Si no hay ID, obtener todas
    const questions = await getAllQuestions.execute();
    
    // Respuesta con formato JSON API para colección
    res.status(200).json({
      data: questions.map(question => ({
        type: 'preguntas',
        id: question.id_pregunta?.toString(),
        attributes: {
          texto_pregunta: question.texto_pregunta,
          es_obligatoria: question.es_obligatoria
        },
        relationships: {
          'tipo-pregunta': {
            data: { 
              type: 'tipos-pregunta', 
              id: question.id_tipo_pregunta.toString() 
            }
          }
        }
      }))
    });
  } catch (error) {
    handleGetError(error as Error, req, res, next);
  }
};
