
# FRONTEND TP

Proyecto de frontend para consumo de api para la empresa TeApoyo.


## Installation

Clonar el repositorio y ejecutar

```bash
  npm install
```
para instalar las dependencias necesarias para la ejecuciónde un proyecto de angular.

## Deployment

Para ejecutar este proyecto deberá configurar las variables de entorno para el consumo de la api en el archivo environments.ts

Luego ejecutar:

```js
Desarrollo:
  ng s
```

```js
Producción:
  ng build
```


## Estructura

El proyecto se divide en módulos que dividen a la aplicación en el uso mediante autenticación. 
Las páginas son componentes de angular que se almacenan en la carpeta "/pages".
Los componentes son elementos reutilizables en las paginas generadas.

Para crear un nuevo componente ejecutar:
```
ng g c "ruta"
```

Los servicios realizan la petición de datos a la api y se almacenan en la carpeta "/service".
Para hacer uso de un servicio se debe inyectar su dependencia en el constructor del componente.

Para crear un nuevo servicio ejecutar:
```
ng g s "ruta"
```


## Dependencias

El proyecto es desarrollado en angular v15.
Utiliza la librería de boostrap y de adminLTE para los estilos y datatables para las tablas.

Los gráficos son generados con el módulo de ECHARTS.
