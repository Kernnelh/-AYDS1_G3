import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Obtener las credenciales de forma segura
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

def enviar_correo_cancelacion(destinatario: str, nombre_paciente: str, fecha: str, hora: str, medico: str, motivo: str):
    """Envía el correo de notificación de cancelación al paciente de forma segura"""
    
    # Validación rápida de seguridad
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("❌ Error crítico: Las credenciales de correo no están configuradas en el archivo .env")
        return

    asunto = "Notificación Importante: Cancelación de Cita"
    
    cuerpo_html = f"""
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        <h2 style="color: #d9534f;">Cita Cancelada</h2>
        <p>Estimado/a <b>{nombre_paciente}</b>,</p>
        <p>Le escribimos para ofrecerle una sincera disculpa. Lamentablemente, su cita programada ha sido cancelada debido a que el médico tuvo contratiempos de fuerza mayor.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Detalles de la cita:</h3>
            <ul style="list-style-type: none; padding-left: 0;">
                <li style="margin-bottom: 8px;">👨‍⚕️ <b>Médico:</b> {medico}</li>
                <li style="margin-bottom: 8px;">📅 <b>Fecha:</b> {fecha}</li>
                <li style="margin-bottom: 8px;">⏰ <b>Hora:</b> {hora}</li>
                <li style="margin-bottom: 8px;">📝 <b>Motivo original:</b> {motivo}</li>
            </ul>
        </div>
        
        <p>Le invitamos a ingresar nuevamente a nuestro portal para reprogramar su cita en el horario que mejor le convenga.</p>
        <p>Agradecemos su comprensión.</p>
        <br>
        <p>Atentamente,<br><b>Administración de la Clínica</b></p>
    </div>
    """

    msg = MIMEMultipart()
    msg['From'] = f"Clínica Médica <{SENDER_EMAIL}>"
    msg['To'] = destinatario
    msg['Subject'] = asunto
    msg.attach(MIMEText(cuerpo_html, 'html'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Correo de cancelación enviado exitosamente a {destinatario}")
    except Exception as e:
        print(f"❌ Error al conectar con el servidor SMTP: {e}")

def enviar_correo_verificacion(destinatario: str, nombre_usuario: str, token: str):
    """Envía el correo con el token de verificación para el primer inicio de sesión"""
    
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("❌ Error: Credenciales SMTP no configuradas.")
        return

    asunto = "Bienvenido a SaludPlus - Tu Token de Verificación"
    
    cuerpo_html = f"""
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center;">
        <h1 style="color: #0056b3;">🏥 SaludPlus</h1>
        <h2 style="color: #4CAF50;">¡Hola, {nombre_usuario}! Bienvenido a nuestra plataforma.</h2>
        <p>Tu registro se ha completado con éxito. Para proteger tu cuenta, necesitamos verificar tu correo electrónico.</p>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Tu token de verificación es:</p>
            <h2 style="letter-spacing: 5px; color: #333; margin: 10px 0;">{token}</h2>
        </div>
        
        <p style="text-align: left;"><b>Instrucciones:</b></p>
        <ul style="text-align: left;">
            <li>Espera a que un Administrador apruebe tu cuenta.</li>
            <li>En tu primer inicio de sesión, ingresa tu correo, contraseña y este token.</li>
        </ul>
        <br>
        <p>Atentamente,<br><b>El equipo de SaludPlus</b></p>
    </div>
    """

    msg = MIMEMultipart()
    msg['From'] = f"SaludPlus <{SENDER_EMAIL}>"
    msg['To'] = destinatario
    msg['Subject'] = asunto
    msg.attach(MIMEText(cuerpo_html, 'html'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Correo de verificación enviado a {destinatario}")
    except Exception as e:
        print(f"❌ Error al conectar con SMTP: {e}")