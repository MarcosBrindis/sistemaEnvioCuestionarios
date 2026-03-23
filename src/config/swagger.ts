import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const publicApiUrl = process.env.PUBLIC_API_URL?.trim();

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
        // Usa mismo origen por defecto para que Swagger funcione detras de IP/dominio/proxy.
        url: publicApiUrl && /^https?:\/\//.test(publicApiUrl) ? publicApiUrl : "/",
        description: publicApiUrl ? "Servidor configurado" : "Servidor actual (mismo origen)",
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
            programa_educativo: { type: "string", example: "Ingeniería en Software" },
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
            subject: { type: "string", example: "Bienvenida a la Plataforma", description: "Asunto del correo." },
            body: { type: "string", example: "<p>Hola {{nombre_completo}}...</p>", description: "Contenido editable. Se insertará dentro del layout usando {{DYNAMIC_CONTENT}}." },
            layout_html: { type: "string", example: "<html><body><div class='content'>{{DYNAMIC_CONTENT}}</div><a href='{{link_encuesta}}'>Ir a la encuesta</a></body></html>", description: "Marco inmutable. Debe incluir {{DYNAMIC_CONTENT}} para inyectar el body." },
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
                    asunto: { type: "string", example: "Encuesta de Seguimiento 2026", description: "Asunto del correo." },
                    cuerpo: { type: "string", example: "<h1>Estimado {{nombre_completo}}</h1><p>Gracias por ayudarnos.</p><p>Tu opinión es muy importante.</p>", description: "Contenido editable. Solo esto se edita en el front." },
                    layout_html: {
                      type: "string",
                      description: "Marco inmutable. Debe incluir {{DYNAMIC_CONTENT}}. Si se omite, se usa el cuerpo tal cual.",
                      example: "<html><body style='background:#f5f5f5;padding:20px;'><div style='max-width:600px;margin:auto;background:#fff;padding:24px;border-radius:8px;'><img src='https://tu-dominio/logo.png' alt='Logo' style='height:40px;'/><div style='margin-top:16px;'>{{DYNAMIC_CONTENT}}</div><div style='margin-top:24px;text-align:center;'><a href='{{link_encuesta}}' style='background:#1d4ed8;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;'>Ir a la encuesta</a></div><p style='font-size:12px;color:#999;margin-top:24px;'>Correo automático, no responder.</p></div></body></html>"
                    }
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
        CreateInternalUserRequest: {
          type: "object",
          required: ["nombre", "email", "password", "id_rol"],
          properties: {
            nombre: { type: "string", example: "Juan Pérez", description: "Nombre completo del usuario" },
            email: { type: "string", format: "email", example: "juan.perez@ejemplo.com", description: "Correo electrónico único" },
            password: { type: "string", format: "password", example: "MySecurePass123", description: "Contraseña (mínimo 8 caracteres, una mayúscula, un número)" },
            id_rol: { type: "number", example: 2, description: "ID del rol (2=director_vinculacion, 3=director_programa_educativo)" }
          }
        },
        UpdateInternalUserRequest: {
          type: "object",
          properties: {
            nombre: { type: "string", example: "Juan Carlos Pérez", description: "Nombre completo del usuario" },
            email: { type: "string", format: "email", example: "juancarlos.perez@ejemplo.com", description: "Correo electrónico único" },
            id_rol: { type: "number", example: 2, description: "ID del rol" },
            is_active: { type: "boolean", example: true, description: "Estado activo/inactivo" }
          }
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["new_password"],
          properties: {
            new_password: { type: "string", format: "password", example: "NewSecurePass456", description: "Nueva contraseña (mínimo 8 caracteres, una mayúscula, un número)" }
          }
        },
        AssignProgramsRequest: {
          type: "object",
          required: ["id_programas"],
          properties: {
            id_programas: {
              type: "array",
              minItems: 1,
              maxItems: 1,
              items: { type: "number" },
              example: [3],
              description: "Array con un único ID de programa educativo"
            }
          }
        },
        InternalUserResponse: {
          type: "object",
          properties: {
            id_usuario: { type: "number", example: 1 },
            nombre: { type: "string", example: "Juan Pérez" },
            email: { type: "string", format: "email", example: "juan.perez@ejemplo.com" },
            id_rol: { type: "number", example: 2 },
            rol_nombre: { type: "string", enum: ["super_admin", "director_vinculacion", "director_programa_educativo"], example: "director_vinculacion" },
            is_active: { type: "boolean", example: true },
            created_at: { type: "string", format: "date-time", example: "2026-02-22T10:30:00Z" },
            updated_at: { type: "string", format: "date-time", example: "2026-02-22T10:30:00Z" }
          }
        },
        ProgramAssignmentResponse: {
          type: "object",
          properties: {
            id_programa: { type: "number", example: 1 },
            nombre_programa: { type: "string", example: "Ingeniería en Sistemas" }
          }
        }
      },
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Session cookie authentication"
        }
      }
    }
  },
  apis: [
    // Desarrollo: anotaciones en archivos TypeScript
    path.join(process.cwd(), "src/**/*.ts"),
    // Produccion (Docker): anotaciones en JavaScript compilado
    path.join(process.cwd(), "dist/**/*.js"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);