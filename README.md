Semana 1 

En esta ocasión, se realizaron los siguientes avances: 

● Configuración inicial del proyecto en Express
● Creación de base de datos de mongoDB Atlas
● Conexión de Express con base de datos mongoDB Atlas
● Creación de endpoint de altas y bajas y cambios de hábitos.

Al momento de descargar/clonar este branch, deberá ejecutar "npm start" en la terminal de VSCode. 
Debe aparecer un mensaje de confirmación de conexión a la base de datos, creada en MongooseDB
Posteriormente, podrá confirmar la conexión de Express con MongoDB la ingresar en el URL:  http://localhost:3000/ 
En este, se puede visualizar un documento JSON que posee entradas de la lista de hábitos guardados. 

Por ahora solo es posible consultar los hábitos existentes a medida que se agregan datos de forma manual en la DB. 
Esto debido a que no se ha creado la interfaz que permita ingresar nuevos datos y permitir PUSH y DELETE requests. 
