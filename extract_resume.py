import PyPDF2

def extract_pdf_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

pdf_path = r'c:\Users\Naziruddin S\Downloads\Naziruddin_S_CV_2026.pdf'
text = extract_pdf_text(pdf_path)
print(text)
