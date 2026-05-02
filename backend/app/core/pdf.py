import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def generar_pdf_receta(tratamiento, medicamentos, paciente, medico):
    """Genera un PDF en memoria RAM y devuelve el buffer"""
    buffer = io.BytesIO()
    
    # Crear el objeto canvas de ReportLab usando el buffer en lugar de un archivo
    p = canvas.Canvas(buffer, pagesize=letter)
    ancho, alto = letter

    # --- ENCABEZADO DE LA CLÍNICA ---
    p.setFont("Helvetica-Bold", 18)
    p.drawString(50, alto - 50, "Clínica Médica SaludPlus")
    
    p.setFont("Helvetica", 11)
    p.drawString(50, alto - 75, f"Médico: Dr/Dra. {medico.nombre} {medico.apellido}")
    p.drawString(50, alto - 90, f"Colegiado No.: {medico.no_colegiado} | Especialidad: {medico.especialidad}")
    p.drawString(50, alto - 105, f"Dirección: {medico.direccion_clinica}")
    
    p.line(50, alto - 115, ancho - 50, alto - 115) # Línea separadora

    # --- DATOS DEL PACIENTE ---
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, alto - 140, "Datos del Paciente:")
    p.setFont("Helvetica", 11)
    p.drawString(50, alto - 155, f"Nombre: {paciente.nombre} {paciente.apellido}")
    p.drawString(50, alto - 170, f"DPI: {paciente.dpi}")

    # --- DIAGNÓSTICO ---
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, alto - 200, "Diagnóstico:")
    p.setFont("Helvetica", 11)
    # Por simplicidad lo truncamos si es muy largo, pero ReportLab tiene herramientas de textwrap
    p.drawString(50, alto - 215, tratamiento.diagnostico[:90]) 

    # --- RECETA MÉDICA (MEDICAMENTOS) ---
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, alto - 250, "Rx / Receta Médica:")
    p.setFont("Helvetica", 11)

    y = alto - 275
    for med in medicamentos:
        # Nombre y cantidad
        p.setFont("Helvetica-Bold", 11)
        p.drawString(50, y, f"• {med.nombre} ({med.cantidad})")
        y -= 15
        
        # Indicaciones
        p.setFont("Helvetica", 11)
        p.drawString(70, y, f"Indicaciones: {med.descripcion_dosis} durante {med.tiempo_medicamento}.")
        y -= 25
        
        # Si la lista es muy larga y se acaba la hoja, creamos una nueva
        if y < 100:
            p.showPage()
            p.setFont("Helvetica", 11)
            y = alto - 50

    # --- FIRMA ---
    p.line(50, y - 40, 250, y - 40)
    p.drawString(50, y - 55, "Firma y Sello del Médico")

    # Finalizar y guardar en el buffer
    p.showPage()
    p.save()
    
    # Mover el puntero del buffer al inicio para poder leerlo
    buffer.seek(0)
    return buffer