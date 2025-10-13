# Plataforma de Cursos – Fundación Banco de Leche Humana Catalina Vega
Este proyecto es una adaptación del repositorio [nextlearn-lms-course-platform-nextjs](https://github.com/KayqueGoldner/nextlearn-lms-course-platform-nextjs), con traducción al español, nuevas funcionalidades y cambios de estilo para la Fundación.


## Variables de ambiente
### Crear secreto, recomiendo
```
openssl rand -hex 32
```
Crear archivo .env
```
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_bd?schema=public"
NEXT_PUBLIC_API_URL="http://localhost:3000"
BETTER_AUTH_SECRET="secreto"
BETTER_AUTH_URL=http://localhost:3000
TITLE_GLOBAL="Fundación Banco de Leche Humana Catalina Vega"
DESCRIPCION_GLOBAL="Somos una fundación sin fines de lucro comprometida con el bienestar
            de los bebés hospitalizados en Costa Rica. Apoyamos activamente a
            los Bancos de Leche Humana del país, promoviendo la donación de
            leche materna como un acto de amor que salva vidas. Desde la
            Fundación Catalina Vega, acompañamos a las madres donadoras
            brindándoles orientación, apoyo e información para facilitar el
            proceso de certificación y promover una red solidaria que nutre
            desde los primeros días de vida. Donar leche es dar vida."
```

## Instalar dependencias
```
pnpm i
```

## Compilar el sistema
```
pnpm run build
pnpm run start
```

## Probar
```
pnpm run dev
```

### Registrar semilla cmd
```
npx tsx ./prisma/seed.ts
```

### Registrar semilla powershell
```
npx tsx .\prisma\seed.ts
```

Licencia

Este proyecto está bajo Licencia MIT. Consulta el archivo LICENSE
