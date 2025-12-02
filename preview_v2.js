function previewQWeb() {
    const xml = document.getElementById("qwebInput").value;
    let json = {};

    // Lecture du JSON
    try {
        json = JSON.parse(document.getElementById("jsonInput").value);
    } catch (e) {
        alert("JSON invalide, vérifie la zone Données Simulées.");
        return;
    }

    let rendered = xml;

    // Remplacements simples des variables (si présentes)
    rendered = rendered
        .replace(/{{\s*partner\.name\s*}}/g, json.partner?.name || "")
        .replace(/{{\s*partner\.street\s*}}/g, json.partner?.street || "")
        .replace(/{{\s*partner\.city\s*}}/g, json.partner?.city || "")
        .replace(/{{\s*partner\.zip\s*}}/g, json.partner?.zip || "")
        .replace(/{{\s*partner\.phone\s*}}/g, json.partner?.phone || "")
        .replace(/{{\s*subscription\.code\s*}}/g, json.subscription?.code || "")
        .replace(/{{\s*subscription\.salesperson\s*}}/g, json.subscription?.salesperson || "")
        .replace(/{{\s*partner\.zones\s*}}/g, json.partner?.zones || "")
        .replace(/{{\s*partner\.duration_initial\s*}}/g, json.partner?.duration_initial || "");

    // Lignes du tableau
    let linesHTML = "";
    if (Array.isArray(json.lines)) {
        json.lines.forEach(l => {
            linesHTML += `
            <tr>
                <td>${l.name}</td>
                <td class="text-center">${l.qty}</td>
                <td class="text-right">${l.price.toFixed(2)} €</td>
            </tr>`;
        });
    }
    rendered = rendered.replace(/{{\s*lines\s*}}/g, linesHTML);

    // HTML final : une SEULE page, on ne coupe rien
    const html = `
    <html>
    <head>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="page">
            <img src="header.png" class="header-img">

            ${rendered}

            <img src="footer.png" class="footer-img">
            <div class="page-number">Page 1 / 1</div>
        </div>
    </body>
    </html>
    `;

    const iframe = document.getElementById("previewFrame").contentWindow;
    iframe.document.open();
    iframe.document.write(html);
    iframe.document.close();
}

// Export HTML
function downloadHTML() {
    const iframeDoc = document.getElementById("previewFrame").contentWindow.document.documentElement.outerHTML;
    const blob = new Blob([iframeDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "preview_altec.html";
    a.click();
}

// Mode sombre
function toggleDark() {
    document.body.classList.toggle("dark-mode");
}
