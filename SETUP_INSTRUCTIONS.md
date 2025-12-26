# 🚀 Instrucciones de Configuración - Kônsul

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

## 📋 Paso 1: Instalar Dependencias

```bash
npm install
```

## 📋 Paso 2: Configurar Variables de Entorno

1. Copia el archivo de ejemplo (lee `ENV_SETUP.md` para más detalles):
   ```bash
   # Crea .env.local manualmente con las variables necesarias
   ```

2. Variables mínimas requeridas:
   - `DATABASE_URL` - Connection string de PostgreSQL (Neon)
   - `NEXTAUTH_SECRET` - Genera con: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - `http://localhost:3000` para desarrollo
   - `OPENAI_API_KEY` - Tu API key de OpenAI

## 📋 Paso 3: Configurar Base de Datos

1. **Generar cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

2. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate dev
   ```
   
   Esto creará todas las tablas en tu base de datos.

3. **Ejecutar seed (datos iniciales):**
   ```bash
   npm run db:seed
   ```
   
   Esto creará:
   - Un usuario admin (email: `admin@konsul.com`, password: `admin123`)
   - Un workspace de ejemplo
   - Un agente de ejemplo (Paulina)
   - Suscripción y balance de créditos

## 📋 Paso 4: Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Credenciales de Acceso

Después de ejecutar el seed, puedes iniciar sesión con:
- **Email:** `admin@konsul.com`
- **Password:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login en producción.

## 🧪 Verificar que Todo Funciona

1. **Inicia sesión** con las credenciales del seed
2. **Verifica el Dashboard** - Deberías ver estadísticas y gráficos
3. **Revisa los Agentes** - Deberías ver "Paulina" en la lista
4. **Prueba el Chat** - Ve a `/chat` para ver el inbox
5. **Revisa Facturación** - Ve a `/billing` para ver el plan y créditos

## 🐛 Solución de Problemas

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` sea correcta
- Asegúrate de que la base de datos esté accesible
- Verifica que el SSL mode esté configurado si es necesario

### Error: "NEXTAUTH_SECRET is missing"
- Genera un secret: `openssl rand -base64 32`
- Agrégalo a `.env.local`

### Error: "OpenAI API key invalid"
- Verifica que tu API key sea válida
- Asegúrate de tener créditos en tu cuenta de OpenAI

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start

# Resetear base de datos y ejecutar seed
npm run db:reset

# Ver base de datos en Prisma Studio
npx prisma studio

# Ejecutar linter
npm run lint
```

## 🎯 Próximos Pasos

1. ✅ Configura las variables de entorno
2. ✅ Ejecuta las migraciones
3. ✅ Ejecuta el seed
4. ✅ Inicia el servidor de desarrollo
5. ✅ Inicia sesión y explora la aplicación
6. 🔄 Personaliza los agentes según tus necesidades
7. 🔄 Configura los canales de comunicación
8. 🔄 Ajusta los estilos según el diseño de Figma

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth](https://next-auth.js.org)
- [Documentación de OpenAI](https://platform.openai.com/docs)

