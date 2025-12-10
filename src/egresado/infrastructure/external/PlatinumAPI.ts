import axios, { AxiosInstance, AxiosError } from 'axios';
import dotoenv from 'dotenv';

dotoenv.config();

export interface PeriodoExterno {
  periodo_id: string;
  label: string;
  NamePeriod: string;
  Cohorte: string;
}

export interface CarreraExterna {
  carrera_id: string;
  label: string;
}

export interface EgresadoExterno {
  Matricula: string;
  CURP: string;
  Nombre: string;
  apaterno: string;
  amaterno: string;
  FechaNacimiento: string;
  CorreoElectronico: string;
  Carrera: string;
  carrera_id: string;
  UltimoPeriodoID: string;
  UltimoPeriodo: string;
}

export interface GetAlumnosParams {
  programa?: string;
  matricula_like?: string;
  periodo?: string;
  periodo_from?: string;
  periodo_to?: string;
}

export class PlatinumAPI {
  private client: AxiosInstance;
  private baseURL = process.env.PLATINUM_API_URL;

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async getPeriodos(): Promise<PeriodoExterno[]> {
    try {
      const response = await this.client.get<PeriodoExterno[]>('/getperiodos_software');
      return response.data;
    } catch (error) {
      const err = error as Error | AxiosError;
      console.error('Error obteniendo periodos de Platinum:', err);

      let errorMessage = 'Error al obtener periodos';
      if (axios.isAxiosError(err)) {
        errorMessage += `: ${err.response?.status} - ${err.response?.statusText}`;
      } else {
        errorMessage += `: ${err.message}`;
      }

      throw new Error(errorMessage);
    }
  }

  async getCarreras(): Promise<CarreraExterna[]> {
    try {
      const response = await this.client.get<CarreraExterna[]>('/getcarreras_software');
      return response.data;
    } catch (error) {
      const err = error as Error | AxiosError;
      console.error('Error obteniendo carreras de Platinum:', err);

      let errorMessage = 'Error al obtener carreras';
      if (axios.isAxiosError(err)) {
        errorMessage += `: ${err.response?.status} - ${err.response?.statusText}`;
      } else {
        errorMessage += `: ${err.message}`;
      }

      throw new Error(errorMessage);
    }
  }

  async getAlumnos(params?: GetAlumnosParams): Promise<EgresadoExterno[]> {
    try {
      const response = await this.client.post<EgresadoExterno[]>('/getalumnos_software', params || {});
      return response.data;
    } catch (error) {
      const err = error as Error | AxiosError;
      console.error('Error obteniendo alumnos de Platinum:', err);

      let errorMessage = 'Error al obtener alumnos';
      if (axios.isAxiosError(err)) {
        errorMessage += `: ${err.response?.status} - ${err.response?.statusText}`;
      } else {
        errorMessage += `: ${err.message}`;
      }

      throw new Error(errorMessage);
    }
  }
}

export class PeriodoParser {
  static parsePeriodoToDates(periodoStr: string): { fecha_inicio: Date; fecha_fin: Date } | null {
    try {
      const partes = periodoStr.split(' ');
      if (partes.length < 2) return null;

      const mesesRango = partes[0];
      const año = parseInt(partes[1]);

      const meses: { [key: string]: number } = {
        'ENE': 1, 'FEB': 2, 'MAR': 3, 'ABR': 4, 'MAY': 5, 'JUN': 6,
        'JUL': 7, 'AGO': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DIC': 12
      };

      const [mesInicioStr, mesFinStr] = mesesRango.split('-');
      const mesInicio = meses[mesInicioStr.toUpperCase()];
      const mesFin = meses[mesFinStr.toUpperCase()];

      if (!mesInicio || !mesFin || isNaN(año)) {
        return null;
      }

      const fecha_inicio = new Date(año, mesInicio - 1, 1);
      const fecha_fin = new Date(año, mesFin, 0);

      return { fecha_inicio, fecha_fin };
    } catch (error) {
      const err = error as Error;
      console.warn(`Error parseando periodo: ${periodoStr}`, err);
      return null;
    }
  }

  static formatDateForDB(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
