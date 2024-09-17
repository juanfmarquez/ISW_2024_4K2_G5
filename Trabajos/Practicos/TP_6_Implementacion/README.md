# Correr Tango App localmente

## Requisitos previos
- Node.js instalado
- Git instalado

## Configuración inicial

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/juanfmarquez/ISW_2024_4K2_G5.git
   ```

2. Navegar al directorio del proyecto:
   ```bash
   cd Trabajos/Practicos/TP_6_Implementacion
   ```

## Instalación de dependencias

Ejecutar el siguiente comando para instalar todas las dependencias necesarias:

```bash
npm install
```

## Ejecución de la aplicación

Para iniciar la aplicación en modo de desarrollo, ejecutar:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Reglas de estilo de código
Utilizamos [JavaScript Standard Style](https://standardjs.com/). Es el estándar para JavaScript y funciona para todas sus librerías. Además, proporciona una revisión y corrección automática con el comando `standard --fix`.

## Paleta de Colores

Colores base:
  - Blanco: (0 0% 100%)
    Usado para: fondo, tarjetas, ventanas emergentes
  - Negro/Gris oscuro: (224 71.4% 4.1%)
    Usado para: texto principal y primer plano de varios elementos

Colores principales:
  - Azul oscuro: (220.9 39.3% 11%)
    Usado para: elementos primarios y acentos
  - Azul muy claro: (210 20% 98%)
    Usado para: texto sobre fondos oscuros

Colores secundarios:
  - Gris muy claro: (220 14.3% 95.9%)
    Usado para: elementos secundarios, silenciados y acentos suaves
  - Gris medio: (220 8.9% 46.1%)
    Usado para: texto secundario o silenciado

Color de alerta:
- Rojo: (0 84.2% 60.2%)
    Usado para: elementos destructivos o de advertencia

## Tecnologías
- Next.js, es un framework de React
- TailwindCSS para estilo
- emailjs para el envío de emails

## Nota importante

Esta aplicación está diseñada principalmente para dispositivos móviles. Para una mejor experiencia, se recomienda utilizar el modo de visualización responsive del navegador:

1. Abrir las herramientas de desarrollo del navegador (F12 en la mayoría de los navegadores).
2. Activar el modo de visualización responsiva (ícono de tablet y celular en la esquina superior izquierda).
3. Seleccionar iPhone 12 Pro, por ejemplo.