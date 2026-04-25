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
- Paginación con `?page=` y `?limit=`
- Búsqueda en tiempo real con debounce
- Exportar a Excel real (.xlsx) sin librerías externas, usando el formato OOXML/SpreadsheetML y un generador de ZIP manual en JavaScript

## Aplicación funcionando
- Página inicial
  <img width="1917" height="969" alt="image" src="https://github.com/user-attachments/assets/ce80163a-6d9c-4245-8a76-18e86a9e4626" />

- Página para agregar serie
  <img width="1917" height="968" alt="image" src="https://github.com/user-attachments/assets/bbcea910-8a99-4148-b6b3-64d95de58ecc" />

- Página para editar serie
  <img width="1914" height="963" alt="image" src="https://github.com/user-attachments/assets/946cf9e1-3b86-4435-a042-641c9b3bc5a6" />

## Reflexión
Trabajar con fetch() en vanilla fue bastante directo y, cuando logré entender bien la estructura, se me hizo más fácil continuar con el código y las funciones. Al no usar librerías externas, hay que poner más atención a los detalles, pero eso me ayudó a entender mejor cómo funciona JavaScript. De los challenges, el de Excel fue el más interesante. Entender el formato OOXML y construir el archivo byte por byte fue difícil, pero me ayudó bastante a comprender cómo funciona por dentro. Vite como bundler fue muy transparente y fácil de configurar. Me gustó que no tengo que compilar y correr todo otra vez cada vez que hago un cambio, ya que lo hace automáticamente, y además muestra los errores al instante cuando ocurre alguno. Si volvería a usar estas tecnologías para futuros proyectos.
