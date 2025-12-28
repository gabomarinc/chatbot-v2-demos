# 🔑 Cómo Crear Credenciales S3 para Cloudflare R2

## 📋 Lo que Tienes vs Lo que Necesitas

### ✅ Ya Tienes:
- **R2_ACCOUNT_ID**: `f0208b0e6b7f6baf66a07f2121a14504`
- **S3 API Endpoint**: `https://f0208b0e6b7f6baf66a07f2121a14504.r2.cloudflarestorage.com`

### ❌ Falta:
- **R2_ACCESS_KEY_ID**: Credencial S3 (Access Key ID)
- **R2_SECRET_ACCESS_KEY**: Credencial S3 (Secret Access Key)
- **R2_BUCKET_NAME**: Nombre del bucket (si aún no lo tienes)

## 🔍 Cómo Crear las Credenciales S3

Las credenciales S3 se crean a través de los **"R2 API Tokens"** (no los Account API Tokens generales).

### Opción 1: Desde la Página de R2 API Tokens

1. Ve a la página donde viste "Account API Tokens" y "User API Tokens"
2. Haz clic en **"Create Account API token"** (botón azul)
3. En el formulario:
   - **Token name**: `chatbot-r2-s3-credentials` (o el nombre que prefieras)
   - **Permissions**: Selecciona **"Admin Read & Write"** (o "Object Read & Write")
   - **Buckets**: Puedes elegir "All buckets" o un bucket específico
4. Haz clic en **"Create token"**
5. **IMPORTANTE**: Después de crear el token, verás:
   - **Access Key ID** → Este es tu `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → Este es tu `R2_SECRET_ACCESS_KEY`
   - ⚠️ **Copia INMEDIATAMENTE** - la Secret Access Key solo se muestra una vez

### Opción 2: URL Directa

Intenta ir directamente a:
```
https://dash.cloudflare.com/f0208b0e6b7f6baf66a07f2121a14504/r2/api-tokens
```

Y crea un nuevo token desde ahí.

## 📝 Nota Importante sobre los Tokens

**Los tokens de R2 API son diferentes de los Account API Tokens generales**, pero Cloudflare los maneja en la misma interfaz. Cuando creas un token con permisos de R2 (como "Object Read & Write" o "Admin Read & Write" en buckets), ese token genera automáticamente credenciales S3-compatibles que incluyen:

- Access Key ID (similar a AWS Access Key)
- Secret Access Key (similar a AWS Secret Key)

## 🔧 Configuración Final

Una vez que tengas todas las credenciales, configura tus variables de entorno:

```env
R2_ACCOUNT_ID=f0208b0e6b7f6baf66a07f2121a14504
R2_ACCESS_KEY_ID=tu_access_key_id_aqui
R2_SECRET_ACCESS_KEY=tu_secret_access_key_aqui
R2_BUCKET_NAME=nombre-de-tu-bucket
# R2_PUBLIC_DOMAIN es opcional - solo si configuraste un dominio público
```

## 🆘 Si No Ves las Credenciales S3

Si después de crear el token solo ves el token pero no las credenciales S3 (Access Key ID y Secret Access Key), puede ser que:

1. **El token que creaste es diferente**: Asegúrate de que el token tenga permisos específicos de R2 (no solo Account API)
2. **Necesitas permisos de administrador**: Algunas cuentas requieren permisos especiales para crear credenciales S3
3. **Cloudflare cambió la interfaz**: En este caso, los tokens de R2 API deberían generar credenciales S3 automáticamente

## ✅ Verificación

Después de configurar todo, prueba subir una imagen en el chatbot. Si funciona, ¡todo está correcto! 🎉

