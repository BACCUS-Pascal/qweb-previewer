function previewQWeb() {
    const xml = document.getElementById("qwebInput").value;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            body { font-family: Arial; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 4px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .altec-warning { background: #ffeeba; padding: 5px; }
            .altec-note-red { background: #f8d7da; padding: 5px; }
        </style>
        </head>
        <body>
            <h2>Aperçu HTML (simulation PDF)</h2>
            <div>
                ${xml.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </div>
        </body>
        </html>
    `;

    const iframe = document.getElementById("previewFrame").contentWindow;
    iframe.document.open();
    iframe.document.write(html);
    iframe.document.close();
}
