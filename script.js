let results = [];

async function search() {
    const query = document.getElementById("query").value.trim();
    const resultsDiv = document.getElementById("results");

    if (!query) {
        alert("Zadej hledaný výraz");
        return;
    }

    resultsDiv.innerHTML = "Načítám...";

    try {
        const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!response.ok) {
            resultsDiv.innerHTML = `<p>Chyba: ${data.error}</p>`;
            return;
        }

        results = data;

        resultsDiv.innerHTML = results.map(result => `
            <div>
                <h2>${result.position}. ${result.title}</h2>
                <a href="${result.url}" target="_blank">
                    ${result.url}
                </a>
                <p>${result.description}</p>
            </div>
        `).join("");

    } catch (error) {
        resultsDiv.innerHTML = "<p>Nastala chyba.</p>";
        console.error(error);
    }
}

function downloadJSON() {
    if (results.length === 0) {
        alert("Nejdříve něco vyhledej");
        return;
    }

    const blob = new Blob(
        [JSON.stringify(results, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "google-results.json";
    link.click();

    URL.revokeObjectURL(url);
}