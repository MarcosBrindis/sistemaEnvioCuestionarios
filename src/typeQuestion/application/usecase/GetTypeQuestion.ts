import { TypeQuestionRepository } from '../../domain/port/typeQuestionRepository';
import { TypeQuestion } from '../../domain/model/typeQuestion';

export class GetTypeQuestionById {
  constructor(private repo: TypeQuestionRepository) {}

  async execute(id: number): Promise<TypeQuestion | null> {
    return this.repo.findById(id);
  }
}

export class GetAllTypeQuestions {
  constructor(private repo: TypeQuestionRepository) {}

  async execute(): Promise<TypeQuestion[]> {
    return this.repo.findAll();
  }
}