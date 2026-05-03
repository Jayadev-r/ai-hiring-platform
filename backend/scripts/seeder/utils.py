import io
import base64
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_resume_pdf_base64(name, email, skills, experience):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    
    styles = getSampleStyleSheet()
    title_style = styles["Heading1"]
    sub_style = styles["Heading2"]
    normal_style = styles["Normal"]
    
    Story = []
    
    # Header
    Story.append(Paragraph(f"{name}'s Resume", title_style))
    Story.append(Paragraph(email, normal_style))
    Story.append(Spacer(1, 12))
    
    # Skills
    Story.append(Paragraph("Skills", sub_style))
    Story.append(Paragraph(", ".join(skills), normal_style))
    Story.append(Spacer(1, 12))
    
    # Experience
    Story.append(Paragraph("Experience Summary", sub_style))
    Story.append(Paragraph(experience, normal_style))
    Story.append(Spacer(1, 12))
    
    doc.build(Story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return base64.b64encode(pdf_bytes).decode('utf-8')
