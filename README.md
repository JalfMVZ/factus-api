# Integración de Facturación Electrónica con Factus API en Next.js

## Descripción

Este proyecto implementa una integración con la API de Factus para gestionar facturas electrónicas en una aplicación desarrollada con Next.js. La solución permite crear, validar y administrar documentos electrónicos, asegurando el cumplimiento de las normativas de facturación electrónica en Colombia establecidas por la DIAN.

## Características

- Creación y validación de facturas electrónicas: Genera y valida facturas electrónicas conforme a los estándares colombianos.
- Gestión de notas crédito: Emite y administra notas crédito para corregir o anular facturas previamente emitidas.
- Descarga de documentos: Obtén facturas y notas crédito en formatos PDF y XML para su registro y envío.
- Manejo de rangos de numeración: Administra los rangos de numeración autorizados para la emisión de documentos fiscales.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- Node.js versión 14 o superior.
- Next.js versión 10 o superior.
- Instalar pnpm: `npm install -g pnpm`.
- Una cuenta activa en Factus con credenciales de API.

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. Clona este repositorio:

```bash
git clone https://github.com/JalfMVZ/factus-api
cd factus-api
```

2. Instala las dependencias:

```bash
pnpm install
```

3. Configura las variables de entorno:

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NODE_ENV=
NEXT_PUBLIC_CLIENT_ID=
NEXT_PUBLIC_CLIENT_SECRET=
NEXT_PUBLIC_URL_API=
```

4. Inicia el servidor de desarrollo:

```bash
pnpm dev
```

## Uso

Una vez que la aplicación esté en funcionamiento, podrás:

- Crear una nueva factura: Navega a la sección "Crear Factura" y completa el formulario con los detalles necesarios.
- Ver facturas existentes: Accede a la sección "Listado de Facturas" para visualizar y gestionar las facturas emitidas.
- Emitir una nota crédito: Selecciona una factura y elige la opción "Emitir Nota Crédito" para generar una nota asociada.

## Contribuciones

Si deseas contribuir a este proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad:

```bash
git checkout -b nueva-funcionalidad
```

3. Realiza tus cambios y haz commit:

```bash
git commit -m 'Agrega nueva funcionalidad'
```

4. Haz push a la rama:

```bash
git push origin nueva-funcionalidad
```

5. Abre un Pull Request detallando tus cambios.

## Contacto

- Correo: velascojosealfredo1@gmail.com
- Sitio Web: [Portfolio](https://portfolio-jmvz.vercel.app/)
- GitHub: [JalfMVZ](https://github.com/JalfMVZ)
