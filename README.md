# Jordania ERP v0.2.0

Actualización del módulo de Recursos Humanos.

## Incluye
- Registro y edición de colaboradores.
- Búsqueda por nombre, cédula o cargo.
- Filtros por departamento y estado.
- Validación para evitar cédulas duplicadas.
- Archivado lógico: no elimina el expediente.
- Dashboard conectado a Firestore.
- Sucursal fija: Aguadulce.
- Los 18 departamentos indicados por la empresa.

## Instalación
Copia el contenido de este paquete dentro de la carpeta principal de `jordania-erp` y reemplaza los archivos cuando Windows lo solicite.

**No reemplaces ni borres `src/config/firebase.js`.** Este paquete no lo incluye.

Después ejecuta:

```bash
firebase deploy --only hosting
```
