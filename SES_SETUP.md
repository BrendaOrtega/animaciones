# Configuración de Amazon SES para Envío de Emails

## Paso 1: Crear cuenta de AWS
Si no tienes una cuenta de AWS, créala en https://aws.amazon.com/

## Paso 2: Crear usuario IAM con permisos de SES

1. Ve a AWS Console: https://console.aws.amazon.com/
2. Busca "IAM" en la barra de búsqueda
3. Click en "Users" → "Create user"
4. Nombre del usuario: `ses-email-sender` (o el que prefieras)
5. En "Permissions", selecciona "Attach policies directly"
6. Busca y selecciona `AmazonSESFullAccess`
7. Click "Next" y luego "Create user"

## Paso 3: Crear Access Keys

1. Click en el usuario recién creado
2. Ve a la pestaña "Security credentials"
3. Scroll down hasta "Access keys"
4. Click "Create access key"
5. Selecciona "Application running outside AWS"
6. Click "Next" y luego "Create access key"
7. **IMPORTANTE**: Copia el "Access key ID" y "Secret access key"
8. Guárdalos en el archivo `.env`:
   ```
   AWS_SES_ACCESS_KEY_ID=tu_access_key_aqui
   AWS_SES_SECRET_ACCESS_KEY=tu_secret_key_aqui
   AWS_SES_REGION=us-east-1
   ```

## Paso 4: Verificar email/dominio en SES

Amazon SES comienza en modo "Sandbox", lo que significa que solo puedes enviar emails a direcciones verificadas.

### Opción A: Verificar un email individual

1. Ve a AWS Console → Amazon SES
2. En el menú izquierdo, click en "Verified identities"
3. Click "Create identity"
4. Selecciona "Email address"
5. Ingresa `contacto@fixter.org`
6. Click "Create identity"
7. Amazon enviará un email de verificación a ese correo
8. Abre el email y haz click en el enlace de verificación

### Opción B: Verificar un dominio completo (recomendado para producción)

1. Ve a AWS Console → Amazon SES
2. En el menú izquierdo, click en "Verified identities"
3. Click "Create identity"
4. Selecciona "Domain"
5. Ingresa `fixter.org`
6. Selecciona "Easy DKIM" (recomendado)
7. Click "Create identity"
8. Amazon te dará registros DNS (CNAME) que debes agregar a tu dominio
9. Ve a tu proveedor de DNS (GoDaddy, Cloudflare, etc.) y agrega esos registros
10. Espera a que se verifique (puede tomar hasta 72 horas, pero usualmente es más rápido)

## Paso 5: Salir del Sandbox (para producción)

En modo Sandbox, solo puedes:
- Enviar a emails verificados
- Máximo 200 emails por día
- 1 email por segundo

Para producción, necesitas salir del Sandbox:

1. Ve a AWS Console → Amazon SES
2. En el menú izquierdo, click en "Account dashboard"
3. Click en "Request production access"
4. Completa el formulario:
   - **Mail type**: Transactional
   - **Website URL**: https://animaciones.fixtergeek.com
   - **Use case description**: Ejemplo:
     ```
     Enviamos emails transaccionales para nuestra plataforma educativa:
     - Magic links para login sin contraseña
     - Emails de bienvenida a nuevos estudiantes
     - Notificaciones de compra de cursos

     Estimamos enviar aproximadamente 1,000 emails al mes.
     ```
   - **Agreement**: Marca que cumples con las políticas de AWS
5. Click "Submit request"
6. Amazon revisará tu solicitud (usualmente toma 24 horas)

## Paso 6: Probar el envío

Una vez que hayas:
- Agregado las credenciales al `.env`
- Verificado al menos el email `contacto@fixter.org`
- Verificado los emails de destino (si aún estás en Sandbox)

Puedes probar el envío:

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a http://localhost:3001/portal

3. Ingresa un email (debe estar verificado si estás en Sandbox)

4. Click en "Enviar magic link"

5. Revisa los logs del servidor para ver si hay errores

## Troubleshooting

### Error: "Email address is not verified"
- Verifica que el email de origen (`contacto@fixter.org`) esté verificado en SES
- Si estás en Sandbox, también verifica que el email de destino esté verificado

### Error: "Missing credentials"
- Verifica que las variables `AWS_SES_ACCESS_KEY_ID` y `AWS_SES_SECRET_ACCESS_KEY` estén en el `.env`
- Verifica que no haya espacios extras en las variables

### Error: "Region not supported"
- Verifica que la región en `AWS_SES_REGION` sea válida
- Regiones comunes: `us-east-1`, `us-west-2`, `eu-west-1`

### Los emails no llegan
- Revisa la carpeta de spam
- Verifica los logs del servidor para ver si hubo errores
- Ve a AWS Console → SES → "Sending statistics" para ver el estado de los emails

## Costos

Amazon SES es muy económico:
- Primeros 62,000 emails al mes: **GRATIS** (si envías desde EC2)
- Después: $0.10 por cada 1,000 emails
- Emails recibidos: $0.10 por cada 1,000 emails

Comparado con SendGrid que cobra ~$15/mes por 50,000 emails.
