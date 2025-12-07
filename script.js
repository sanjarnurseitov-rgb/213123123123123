async function loadData() {
    const id = document.getElementById("sheetIdInput").value.trim();
    if (!id) return alert("Введите ID таблицы!");

    const url =
        `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=matches`;

    try {
        const res = await fetch(url);
        const text = await res.text();

        // Google возвращает текст вида: "/*O_o*/ google.visualization.Query.setResponse({...})"
        const json = JSON.parse(text.substring(47, text.length - 2));

        const rows = json.table.rows;
        const output = document.getElementById("matches");
        output.innerHTML = "";

        rows.forEach(r => {
            const row = r.c.map(x => x?.v ?? "").join(" | ");
            output.innerHTML += `<div class="row">${row}</div>`;
        });

    } catch (e) {
        alert("Ошибка загрузки. Проверьте ID таблицы.");
        console.error(e);
    }
}

document.getElementById("loadBtn").addEventListener("click", loadData);
