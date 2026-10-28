import os
import zipfile

def make_docx(filename: str, text_content: str):
    doc_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
    for line in text_content.strip().split('\n'):
        line_clean = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        doc_xml += f'<w:p><w:r><w:t>{line_clean}</w:t></w:r></w:p>'
    doc_xml += '</w:body></w:document>'

    content_types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'

    rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'

    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('word/document.xml', doc_xml)

def make_pdf(filename: str, text_content: str):
    lines = text_content.strip().split('\n')
    stream_content = "BT\n/F1 9 Tf\n40 760 Td\n11 TL\n"
    for line in lines[:60]:
        sanitized = line.replace('(', '').replace(')', '').replace('\\', '').replace('\r', '')
        stream_content += f"({sanitized}) Tj T*\n"
    stream_content += "ET\n"
    stream_bytes = stream_content.encode('latin1', errors='ignore')

    obj4 = f"<< /Length {len(stream_bytes)} >>\nstream\n{stream_content}endstream"

    pdf_body = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
{obj4}
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000500 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
600
%%EOF"""
    with open(filename, 'wb') as f:
        f.write(pdf_body.encode('latin1'))

def main():
    fixtures_dir = os.path.join('docs', 'demo', 'fixtures')
    os.makedirs(fixtures_dir, exist_ok=True)

    with open(os.path.join(fixtures_dir, 'alex-rivera-resume.txt'), 'r', encoding='utf-8') as f:
        alex_txt = f.read()

    make_docx(os.path.join(fixtures_dir, 'alex-rivera-resume.docx'), alex_txt)
    make_pdf(os.path.join(fixtures_dir, 'alex-rivera-resume.pdf'), alex_txt)

    with open(os.path.join(fixtures_dir, 'stanford-cs-diploma.txt'), 'r', encoding='utf-8') as f:
        diploma_txt = f.read()

    make_pdf(os.path.join(fixtures_dir, 'stanford-cs-diploma.pdf'), diploma_txt)

    with open(os.path.join(fixtures_dir, 'stanford-cs-diploma-tampered.txt'), 'r', encoding='utf-8') as f:
        tampered_txt = f.read()

    make_pdf(os.path.join(fixtures_dir, 'stanford-cs-diploma-tampered.pdf'), tampered_txt)

    print("All demo fixture files (TXT, DOCX, PDF) created in docs/demo/fixtures/")

if __name__ == '__main__':
    main()
