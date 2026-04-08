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