function previewQWeb() {

    const xml = document.getElementById("qwebInput").value;
    let json = {};

    try {
        json = JSON.parse(document.getElementById("jsonInput").value);
    } catch (e) {
        alert("❌ JSON invalide.\nCorrige ton JSON avant de générer l’aperçu.");
        return;
    }

    let rendered = xml;

    /* ====== VARIABLES ====== */
    rendered = rendered
        .replace(/{{\s*partner\.name\s*}}/g, json.partner?.name || "")
        .replace(/{{\s*partner\.street\s*}}/g, json.partner?.street || "")
        .replace(/{{\s*partner\.city\s*}}/g, json.partner?.city || "")
        .replace(/{{\s*partner\.zip\s*}}/g, json.partner?.zip || "")
        .replace(/{{\s*partner\.phone\s*}}/g, json.partner?.phone || "")
        .replace(/{{\s*subscription\.code\s*}}/g, json.subscription?.code || "")
        .replace(/{{\s*subscription\.salesperson\s*}}/g, json.subscription?.salesperson || "");

    /* ====== LIGNES ====== */
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
    rendered = rendered.replace(/{{\s*lines\s*}}/, linesHTML);

    /* ====== PAGE HTML ====== */
    const html = `
    <html>
    <head>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="page">

            <!-- Header -->
            <img src="header.png" class="header-img">

            <!-- Body -->
            ${rendered}

            <!-- Footer -->
            <img src="footer.png" class="footer-img">

            <!-- Pagination -->
            <div class="page-number">Page 1 / 1</div>
        </div>
    </body>
    </html>
    `;

    /* ====== RENDER ====== */
    const iframe = document.getElementById("previewFrame").contentWindow;
    iframe.document.open();
    iframe.document.write(html);
    iframe.document.close();
}

/* ====== EXPORT HTML ====== */
function downloadHTML() {
    const iframeDoc = document.getElementById("previewFrame").contentWindow.document.documentElement.outerHTML;
    const blob = new Blob([iframeDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "preview_altec.html";
    a.click();
}

/* ====== MODE SOMBRE ====== */
function toggleDark() {
    document.body.classList.toggle("dark-mode");
}
