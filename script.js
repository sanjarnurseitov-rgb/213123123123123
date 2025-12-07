document.getElementById("loadBtn").addEventListener("click", loadData);

async function loadData() {
    const id = document.getElementById("sheetId").value.trim();
    if (!id) return alert("Введите ID таблицы");

    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=matches`;

    const res = await fetch(url);
    const text = await res.text();

    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;

    renderMatches(rows);
}

function renderMatches(rows) {
    const box = document.getElementById("matches");
    box.innerHTML = "";

    rows.forEach(r => {
        const c = r.c.map(v => v ? v.v : "");

        const [
            date,
            mode,
            pA1, hA1,
            pA2, hA2,
            pB1, hB1,
            pB2, hB2,
            winner,
            map,
            notes
        ] = c;

        const card = document.createElement("div");
        card.className = "match-card";

        let html = "";

        html += `<div class="team">
                    <div class="team-title">🟦 Команда A</div>
                    <div class="line">• ${pA1} — ${hA1}</div>
                    ${pA2 ? `<div class="line">• ${pA2} — ${hA2}</div>` : ""}
                 </div>`;

        html += `<div class="team">
                    <div class="team-title">🟥 Команда B</div>
                    <div class="line">• ${pB1} — ${hB1}</div>
                    ${pB2 ? `<div class="line">• ${pB2} — ${hB2}</div>` : ""}
                 </div>`;

        html += `<div class="info">
                    🏆 Победитель: Команда ${winner}<br>
                    🗺 Поле: ${map}<br>
                    📝 ${notes || ""}<br>
                    📅 Дата: ${date}
                 </div>`;

        card.innerHTML = html;
        box.appendChild(card);
    });
}
