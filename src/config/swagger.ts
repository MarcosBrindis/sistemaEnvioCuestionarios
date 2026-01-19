// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Envío de Cuestionarios",
      version: "1.0.0",
      description: "Documentación API para el sistema de preguntas, opciones, tipos de pregunta y formularios",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      schemas: {
                SurveyInput: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "object",
                      required: ["type", "attributes", "relationships"],
                      properties: {
                        type: { type: "string", example: "encuestas" },
                        attributes: {
                          type: "object",
                          required: ["nombre", "descripcion", "is_active"],
                          properties: {
                            nombre: { type: "string", example: "Encuesta Clima 2025" },
                            descripcion: { type: "string", example: "Encuesta para medir el clima laboral" },
                            is_active: { type: "boolean", example: true }
                          }
                        },
                        relationships: {
                          type: "object",
                          required: ["formulario", "template-correo"],
                          properties: {
                            formulario: {
                              type: "object",
                              properties: {
                                data: {
                                  type: "object",
                                  required: ["type", "id"],
                                  properties: {
                                    type: { type: "string", example: "formularios" },
                                    id: { type: "string", example: "10" }
                                  }
                                }
                              }
                            },
                            "template-correo": {
                              type: "object",
                              properties: {
                                data: {
                                  type: "object",
                                  required: ["type", "id"],
                                  properties: {
                                    type: { type: "string", example: "templates-correo" },
                                    id: { type: "string", example: "5" }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                SurveyResource: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        type: { type: "string", example: "encuestas" },
                        id: { type: "string", example: "1" },
                        attributes: {
                          type: "object",
                          properties: {
                            nombre: { type: "string", example: "Encuesta Clima 2025" },
                            descripcion: { type: "string", example: "Encuesta para medir el clima laboral" },
                            is_active: { type: "boolean", example: true }
                          }
                        },
                        relationships: {
                          type: "object",
                          properties: {
                            formulario: {
                              type: "object",
                              properties: {
                                data: {
                                  type: "object",
                                  properties: {
                                    type: { type: "string", example: "formularios" },
                                    id: { type: "string", example: "10" }
                                  }
                                }
                              }
                            },
                            "template-correo": {
                              type: "object",
                              properties: {
                                data: {
                                  type: "object",
                                  properties: {
                                    type: { type: "string", example: "templates-correo" },
                                    id: { type: "string", example: "5" }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                SurveyListResponse: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        total_records: { type: "integer", example: 50 },
                        total_pages: { type: "integer", example: 5 },
                        current_page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 }
                      }
                    },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SurveyResource" }
                    }
                  }
                },
        TipoCorreoAttributes: {
          type: "object",
          properties: {
            tipo: { type: "string", example: "Encuesta de Satisfacción" }
          }
        },
        TipoCorreoRequest: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "tipos-correo" },
                attributes: { $ref: "#/components/schemas/TipoCorreoAttributes" }
              }
            }
          }
        },
        TipoCorreoResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "tipos-correo" },
                id: { type: "string", example: "1" },
                attributes: { $ref: "#/components/schemas/TipoCorreoAttributes" }
              }
            }
          }
        },
        Egresado: {
          type: "object",
          properties: {
            id_egresado: { type: "integer", example: 50 },
            nombre: { type: "string", example: "Juan" },
            primer_apellido: { type: "string", example: "Pérez" },
            segundo_apellido: { type: "string", example: "García" },
            matricula: { type: "string", example: "A12345678" },
            curp: { type: "string", example: "CURP123456HDFGRT09" },
            email: { type: "string", example: "mi_nuevo_correo@gmail.com" },
            imagen_egresado: { type: "string", example: "https://miservidor.com/uploads/foto_perfil_50.jpg" },
            fecha_nacimiento: { type: "string", format: "date", example: "1999-05-20" },
            is_active: { type: "boolean", example: true },
            id_programa_educativo: { type: "integer", example: 1 },
            id_periodo: { type: "integer", example: 1 }
          }
        },
        RespuestaAttributes: {
          type: "object",
          properties: {
            id_respuesta: { type: "integer", example: 1 },
            id_egresado: { type: "integer", example: 1 },
            id_formulario: { type: "integer", example: 2 },
            fecha_respuesta: { type: "string", format: "date-time", example: "2025-12-09T12:00:00Z" },
            respuestas_json: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_pregunta: { type: "integer", example: 10 },
                  valor: { type: "string", example: "Respuesta del egresado" }
                }
              }
            }
          }
        },
        RespuestaResource: {
          type: "object",
          properties: {
            id_respuesta: { type: "integer", example: 1 },
            id_egresado: { type: "integer", example: 1 },
            id_formulario: { type: "integer", example: 2 },
            fecha_respuesta: { type: "string", format: "date-time", example: "2025-12-09T12:00:00Z" },
            respuestas_json: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_pregunta: { type: "integer", example: 10 },
                  valor: { type: "string", example: "Respuesta del egresado" }
                }
              }
            }
          }
        },
        FormularioAttributes: {
          type: "object",
          properties: {
            titulo: { type: "string", example: "Encuesta de Seguimiento 2025" },
            descripcion: { type: "string", example: "Encuesta para egresados 2025" },
            is_active: { type: "boolean", example: true },
            fecha_creacion: { type: "string", format: "date-time", example: "2025-01-01T12:00:00Z" },
          },
        },
        FormularioRequest: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "formularios" },
                attributes: {
                  type: "object",
                  properties: {
                    titulo: { type: "string", example: "Encuesta 2025" },
                    descripcion: { type: "string", example: "Descripción..." },
                    is_active: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
        },
        FormularioResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "formularios" },
                id: { type: "string", example: "1" },
                attributes: { $ref: "#/components/schemas/FormularioAttributes" },
              },
            },
          },
        },
        FormularioDetailResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "formularios" },
                id: { type: "string", example: "1" },
                attributes: { $ref: "#/components/schemas/FormularioAttributes" },
                relationships: {
                  type: "object",
                  properties: {
                    preguntas: {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              type: { type: "string", example: "pregunta" },
                              id: { type: "string", example: "10" },
                              attributes: {
                                type: "object",
                                properties: {
                                  orden: { type: "integer", example: 1 },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        AsociarPreguntaRequest: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              required: ["id", "type"],
              properties: {
                id: { type: "string", example: "125" },
                type: { type: "string", example: "preguntas" },
              },
            },
            meta: {
              type: "object",
              properties: {
                orden: { type: "integer", example: 3 },
              },
            },
          },
        },
        AsociarPreguntaResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "formulacion-pregunta" },
                attributes: {
                  type: "object",
                  properties: {
                    id_formulario: { type: "string", example: "1" },
                    id_pregunta: { type: "string", example: "125" },
                    orden: { type: "integer", example: 3 },
                  },
                },
              },
            },
          },
        },

        PreguntaAttributes: {
          type: "object",
          properties: {
            texto_pregunta: { type: "string", example: "¿Cómo calificaría el servicio?" },
            es_obligatoria: { type: "boolean", example: true },
          },
        },
        PreguntaRequest: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "preguntas" },
                attributes: { $ref: "#/components/schemas/PreguntaAttributes" },
                relationships: {
                  type: "object",
                  properties: {
                    "tipo-pregunta": {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            type: { type: "string", example: "tipos-pregunta" },
                            id: { type: "string", example: "1" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        PreguntaResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "preguntas" },
                id: { type: "string", example: "10" },
                attributes: { $ref: "#/components/schemas/PreguntaAttributes" },
                relationships: {
                  type: "object",
                  properties: {
                    "tipo-pregunta": {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            type: { type: "string", example: "tipos-pregunta" },
                            id: { type: "string", example: "1" },
                          },
                        },
                      },
                    },
                    opciones: {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              type: { type: "string", example: "opciones-pregunta" },
                              id: { type: "string", example: "5" },
                              attributes: {
                                type: "object",
                                properties: {
                                  texto_opcion: { type: "string", example: "Bueno" },
                                  etiqueta: { type: "string", example: "A" },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        OpcionPreguntaAttributes: {
          type: "object",
          properties: {
            "texto-opcion": { type: "string", example: "Totalmente de acuerdo" },
            etiqueta: { type: "string", example: "A" },
          },
        },
        OpcionPreguntaRequest: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "opcion-pregunta" },
                attributes: { $ref: "#/components/schemas/OpcionPreguntaAttributes" },
                relationships: {
                  type: "object",
                  properties: {
                    pregunta: {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            type: { type: "string", example: "pregunta" },
                            id: { type: "string", example: "10" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        OpcionPreguntaResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "opcion-pregunta" },
                id: { type: "string", example: "5" },
                attributes: { $ref: "#/components/schemas/OpcionPreguntaAttributes" },
                relationships: {
                  type: "object",
                  properties: {
                    pregunta: {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            type: { type: "string", example: "pregunta" },
                            id: { type: "string", example: "10" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        TypeQuestionAttributes: {
          type: "object",
          properties: {
            nombre: { type: "string", example: "Opción Múltiple" },
          },
        },
        TypeQuestionRequest: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "tipos-pregunta" },
                attributes: { $ref: "#/components/schemas/TypeQuestionAttributes" },
              },
            },
          },
        },
        TypeQuestionResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string", example: "tipos-pregunta" },
                id: { type: "string", example: "1" },
                attributes: { $ref: "#/components/schemas/TypeQuestionAttributes" },
              },
            },
          },
        },
        EmailTemplate: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            subject: { type: "string", example: "Welcome Email" },
            body: { type: "string", example: "Hello, welcome!" },
            typeId: { type: "integer", example: 2 },
            createdAt: { type: "string", format: "date-time", example: "2024-01-01T12:00:00Z" },
            updatedAt: { type: "string", format: "date-time", example: "2024-01-02T12:00:00Z" }
          }
        },
        EmailTemplateInput: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              required: ["type", "attributes", "relationships"],
              properties: {
                type: { type: "string", example: "templates-correo" },
                attributes: {
                  type: "object",
                  required: ["asunto", "cuerpo"],
                  properties: {
                    asunto: { type: "string", example: "Encuesta de Seguimiento - Importante" },
                    cuerpo: { type: "string", example: "<html><body><p>Hola {nombre}...</p></body></html>" }
                  }
                },
                relationships: {
                  type: "object",
                  required: ["tipo_correo"],
                  properties: {
                    tipo_correo: {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          required: ["type", "id"],
                          properties: {
                            type: { type: "string", example: "tipo_correo" },
                            id: { type: "string", example: "1" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
    },
  },
  apis: [
    `${path.join(__dirname, "../../**/*.ts")}`,
    `${path.join(__dirname, "../group/infrastructure/http/swagger/group.swagger.ts")}`,
    `${path.join(__dirname, "../auth/infrastructure/http/swagger/auth.swagger.ts")}`,
    `${path.join(__dirname, "../surveyAssignment/infrastructure/http/swagger/assignment.swagger.ts")}`,
    `${path.join(__dirname, "../mailing/infrastructure/http/swagger/accountswagger.ts")}`,
    `${path.join(__dirname, "../mailing/client/infrastructure/http/swagger/client.swagger.ts")}`,
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);