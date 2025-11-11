import { QuestionRepository } from '../../domain/port/questionRepository';

export class DeleteQuestion {
  constructor(private repo: QuestionRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar si la pregunta existe
    const existingQuestion = await this.repo.findById(id);
    if (!existingQuestion) {
      throw new Error('La pregunta no existe');
    }
    await this.repo.delete(id);
  }
}
