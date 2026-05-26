import { PeriodoRepository } from '../../domain/port/egresadoRepository';

export interface CohorteDisponible {
  value: number | string;
  label: string;
  cohorte: string;
  periodo_id: number;
  name_period: string | null;
}

export class GetCohortesDisponibles {
  constructor(private repository: PeriodoRepository) {}

  async execute(): Promise<CohorteDisponible[]> {
    const periodos = await this.repository.findAll();
    const cohortes = new Map<string, CohorteDisponible>();

    for (const periodo of periodos) {
      const cohorte = String(periodo.cohorte).trim();
      if (!cohorte || cohortes.has(cohorte)) {
        continue;
      }

      const label = periodo.NamePeriod || periodo.label || cohorte;
      cohortes.set(cohorte, {
        value: Number.isNaN(Number(cohorte)) ? cohorte : Number(cohorte),
        label,
        cohorte,
        periodo_id: Number(periodo.id_periodo),
        name_period: periodo.NamePeriod || periodo.label || null
      });
    }

    return Array.from(cohortes.values()).sort((a, b) => Number(b.value) - Number(a.value));
  }
}