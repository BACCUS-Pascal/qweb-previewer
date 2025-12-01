function previewQWeb() {

    const xml = document.getElementById("qwebInput").value;
    const json = JSON.parse(document.getElementById("jsonInput").value);

    let rendered = xml;

    // basic var replacements
    rendered = rendered
        .replace(/{{\s*partner\.name\s*}}/g, json.partner.name)
        .replace(/{{\s*partner\.street\s*}}/g, json.partner.street)
        .replace(/{{\s*partner\.city\s*}}/g, json.partner.city)
        .replace(/{{\s*partner\.zip\s*}}/g, json.partner.zip)
        .replace(/{{\s*partner\.phone\s*}}/g, json.partner.phone)
        .replace(/{{\s*subscription\.code\s*}}/g, json.subscription.code)
        .replace(/{{\s*subscription\.salesperson\s*}}/g, json.subscription.salesperson);

    // lines
    let linesHTML = "";
    json.lines.forEach(l => {
        linesHTML += `
            <tr>
                <td>${l.name}</td>
                <td class="text-center">${l.qty}</td>
                <td class="text-right">${l.price.toFixed(2)} €</td>
            </tr>
        `;
    });
    rendered = rendered.replace(/{{\s*lines\s*}}/, linesHTML);

    // Build HTML
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial; padding: 30px; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { border: 1px solid black; padding: 4px; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .altec-warning {
                    background:#ffeeba; padding:10px; border-left:5px solid #ff9900; margin:10px 0;
                }
                .altec-note-red {
                    background:#f8d7da; padding:10px; border-left:5px solid #dc3545; margin:10px 0;
                }
            </style>
        </head>
        <body>
            ${rendered}
        </body>
        </html>
    `;

    // Render in iframe
    const iframe = document.getElementById("previewFrame").contentWindow;
    iframe.document.open();
    iframe.document.write(html);
    iframe.document.close();
}

function downloadHTML() {
    const iframeDoc = document.getElementById("previewFrame").contentWindow.document.documentElement.outerHTML;
    const blob = new Blob([iframeDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "preview.html";
    a.click();
}

function toggleDark() {
    document.body.classList.toggle("dark-mode");
}
