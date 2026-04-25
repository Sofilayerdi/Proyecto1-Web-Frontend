# Series Tracker — Frontend

Cliente web para gestionar series de televisión. Consume la API REST del backend usando fetch() vanilla.

**Backend:** https://github.com/Sofilayerdi/Proyecto1-Web-Backend.git

**App en producción:** https://seriestracker-231929.onrender.com
 *Tarda un poco en cargar

## Tecnologías
- HTML, CSS y JavaScript vanilla
- Vite (bundler)

## Correr localmente

1. Clona el repositorio
2. Instala dependencias:
```bash
   npm install
```
3. Corre el servidor de desarrollo:
```bash
   npm run dev
```
4. Abre `http://localhost:5173`

> El backend debe estar corriendo en `http://localhost:8000` para que funcione localmente.

## Funcionalidades
- Ver todas las series en cards con imagen, progreso y episodios
- Agregar una nueva serie
- Editar una serie existente con datos precargados
- Eliminar una serie
- Búsqueda por nombre en tiempo real
- Paginación con botones anterior/siguiente
- Exportar la lista a Excel (.xlsx) generado manualmente con SpreadsheetML

## Challenges implementados
- Códigos HTTP correctos — 201 al crear, 204 al eliminar, 404, 400
- Validación server-side — mensajes descriptivos en texto
- Paginación ?page= y ?limit=
- Búsqueda ?q=
- Ordenamiento ?sort= y ?order=asc|desc
- Exportar la lista de series a Excel (.xlsx)

## Aplicación funcionando
- Página inicial
  <img width="1915" height="913" alt="image" src="https://github.com/user-attachments/assets/c0bdf923-37f0-44d8-99e7-83df611cf3e2" />

- Página para agregar serie
  <img width="1917" height="967" alt="image" src="https://github.com/user-attachments/assets/5d239ced-fbdc-4a98-80b0-2aa45fa3bad0" />

- Página para editar serie
  <img width="1912" height="970" alt="image" src="https://github.com/user-attachments/assets/900f270d-c1b5-4b6a-985e-e8fe2b362df8" />


## Reflexión
Trabajar con fetch() en vanilla fue bastante directo y, cuando logré entender bien la estructura, se me hizo más fácil continuar con el código y las funciones. Al no usar librerías externas, hay que poner más atención a los detalles, pero eso me ayudó a entender mejor cómo funciona JavaScript. De los challenges, el de Excel fue el más interesante. Entender el formato OOXML y construir el archivo byte por byte fue difícil, pero me ayudó bastante a comprender cómo funciona por dentro. Vite como bundler fue muy transparente y fácil de configurar. Me gustó que no tengo que compilar y correr todo otra vez cada vez que hago un cambio, ya que lo hace automáticamente, y además muestra los errores al instante cuando ocurre alguno. Si volvería a usar estas tecnologías para futuros proyectos.
