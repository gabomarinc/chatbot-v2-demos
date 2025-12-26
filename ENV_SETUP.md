# Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database
# Obtén tu connection string de Neon: https://neon.tech
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth
# Genera un secret con: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI
# Obtén tu API key de: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# WhatsApp Business API (Opcional)
# Configura estos valores si vas a usar WhatsApp
WHATSAPP_VERIFY_TOKEN="your-verify-token"
WHATSAPP_ACCESS_TOKEN="your-access-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_BUSINESS_ACCOUNT_ID="your-business-account-id"
```

## Pasos para obtener las variables:

### 1. DATABASE_URL (Neon)
1. Ve a https://neon.tech
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia la connection string que te proporcionan
5. Asegúrate de que incluya `?sslmode=require` al final

### 2. NEXTAUTH_SECRET
Ejecuta en tu terminal:
```bash
openssl rand -base64 32
```
Copia el resultado y úsalo como valor de `NEXTAUTH_SECRET`

### 3. OPENAI_API_KEY
1. Ve a https://platform.openai.com/api-keys
2. Inicia sesión o crea una cuenta
3. Crea una nueva API key
4. Copia la key (empieza con `sk-`)

### 4. WhatsApp (Opcional)
Solo necesario si vas a usar WhatsApp Business API:
1. Crea una cuenta en Meta for Developers
2. Crea una app de WhatsApp Business
3. Configura el webhook con la URL de tu aplicación
4. Obtén los tokens y IDs necesarios

