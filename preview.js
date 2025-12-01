function previewQWeb() {
    const xml = document.getElementById("qwebInput").value;
    const json = JSON.parse(document.getElementById("jsonInput").value);

    // Simple variable replacement {{ var }}
    let rendered = xml;

    rendered = rendered
        .replace(/{{\s*partner\.name\s*}}/g, json.partner.name)
        .replace(/{{\s*partner\.street\s*}}/g, json.partner.street)
        .replace(/{{\s*partner\.city\s*}}/g, json.partner.city)
        .replace(/{{\s*partner\.zip\s*}}/g, json.partner.zip)
        .replace(/{{\s*partner\.phone\s*}}/g, json.partner.phone)
        .replace(/{{\s*subscription\.code\s*}}/g, json.subscription.code)
        .replace(/{{\s*subscription\.salesperson\s*}}/g, json.subscription.salesperson);

    // Simulate subscription lines
    let linesHTML = "";
    json.lines.forEach(l => {
        linesHTML += `
        <tr>
            <td>${l.name}</td>
            <td class="text-center">${l.qty}</td>
            <td class="text-right">${l.price.toFixed(2)} €</td>
        </tr>`;
    });

    rendered = rendered.replace("{{ lines }}", linesHTML);

    const html = `
        <html>
        <head>
        <style>
            ${document.querySelector("style")?.innerHTML || ""}
        </style>
        </head>
        <body>
            <div class="preview-body">
                ${rendered}
            </div>
        </body>
        </html>
    `;

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
