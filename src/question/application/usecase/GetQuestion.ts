import { QuestionRepository } from '../../domain/port/questionRepository';
import { Question } from '../../domain/model/question';

export class GetQuestionById {
  constructor(private repo: QuestionRepository) {}

  async execute(id: number): Promise<Question | null> {
    return await this.repo.findById(id);
  }
}

export class GetAllQuestions {
  constructor(private repo: QuestionRepository) {}

  async execute(): Promise<Question[]> {
    return await this.repo.findAll();
  }
}

export class GetQuestionsByTypeId {
  constructor(private repo: QuestionRepository) {}

  async execute(idTipoPregunta: number): Promise<Question[]> {
    return await this.repo.findByTypeQuestionId(idTipoPregunta);
  }
}

export class SearchQuestionsByText {
  constructor(private repo: QuestionRepository) {}

  async execute(texto: string): Promise<Question[]> {
    if (!texto || texto.trim() === '') {
      throw new Error('El parámetro de búsqueda no puede estar vacío');
    }
    return await this.repo.searchByText(texto.trim());
  }
}
