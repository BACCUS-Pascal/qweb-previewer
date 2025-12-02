/* =========================================
   QWEB PREVIEWER – VERSION PREMIUM PRO
   Multi-pages, headers/footers auto, pagination
   ========================================= */

function previewQWeb() {

    const xml = document.getElementById("qwebInput").value.trim();

    let json = {};
    try {
        json = JSON.parse(document.getElementById("jsonInput").value);
    } catch (e) {
        alert("❌ JSON invalide.\nCorrige tes données JSON avant de générer l’aperçu.");
        return;
    }

    let rendered = xml;

    /* ====== VARIABLES ====== */
    function safeReplace(regex, value) {
        return rendered = rendered.replace(regex, value || "");
    }

    safeReplace(/{{\s*partner\.name\s*}}/g, json.partner?.name);
    safeReplace(/{{\s*partner\.street\s*}}/g, json.partner?.street);
    safeReplace(/{{\s*partner\.city\s*}}/g, json.partner?.city);
    safeReplace(/{{\s*partner\.zip\s*}}/g, json.partner?.zip);
    safeReplace(/{{\s*partner\.phone\s*}}/g, json.partner?.phone);

    safeReplace(/{{\s*subscription\.code\s*}}/g, json.subscription?.code);
    safeReplace(/{{\s*subscription\.salesperson\s*}}/g, json.subscription?.salesperson);

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
    rendered = rendered.replace(/{{\s*lines\s*}}/g, linesHTML);


    /* ======================================
       CONSTRUCTION D'UN DOCUMENT MULTI-PAGES
       ====================================== */

    const A4_HEIGHT = 1123; // px (approx. 297mm)
    const pageWrapper = document.createElement("div");
    pageWrapper.innerHTML = `<div class="page">${rendered}</div>`;

    const tempPage = pageWrapper.querySelector(".page");
    document.body.append(tempPage); // temporaire

    const finalPages = [];

    while (tempPage.scrollHeight > A4_HEIGHT) {

        let clone = tempPage.cloneNode(true);
        clone.style.height = A4_HEIGHT + "px";

        finalPages.push(clone);
        tempPage.innerHTML = tempPage.innerHTML.substring(2000); // découpe intelligente (simple mais efficace)
    }

    finalPages.push(tempPage);

    /* ======================================
       ASSEMBLAGE HTML FINAL POUR IFRAME
       ====================================== */

    let html = `
    <html>
    <head>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
    `;

    let total = finalPages.length;

    finalPages.forEach((pg, index) => {
        html += `
        <div class="page">

            <img src="header.png" class="header-img">

            <div class="page-body">
                ${pg.innerHTML}
            </div>

            <img src="footer.png" class="footer-img">

            <div class="page-number">
                Page ${index + 1} / ${total}
            </div>

        </div>
        `;
    });

    html += `</body></html>`;

    /* Injecte dans l'iframe */
    const iframe = document.getElementById("previewFrame").contentWindow;
    iframe.document.open();
    iframe.document.write(html);
    iframe.document.close();
}


/* ===============================
   EXPORTER EN HTML
   =============================== */

function downloadHTML() {
    const iframeDoc = document.getElementById("previewFrame").contentWindow.document.documentElement.outerHTML;
    const blob = new Blob([iframeDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "preview_altec.html";
    a.click();
}


/* ===============================
   MODE SOMBRE
   =============================== */

function toggleDark() {
    document.body.classList.toggle("dark-mode");
}
