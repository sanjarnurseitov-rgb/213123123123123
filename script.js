async function loadMatches() {
    const input = document.getElementById("sheetIdInput").value.trim();
    if (!input) return alert("Введите ID таблицы!");

    // Вырезаем ID из полной ссылки, если вставили URL
    const sheetId = input.includes("/spreadsheets/")
        ? input.split("/spreadsheets/d/")[1].split("/")[0]
        : input;

    const url =
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=matches`;

    try {
        const res = await fetch(url);
        const text = await res.text();

        // Стандартная очистка JSON (Google всё портит спецсимволами)
        const json = JSON.parse(text.substring(47, text.length - 2));

        const rows = json.table.rows;

        const matches = rows.map(r => {
            return {
                date: r.c[0]?.v || "",
                mode: r.c[1]?.v || "",
                playerA1: r.c[2]?.v || "",
                heroA1: r.c[3]?.v || "",
                playerA2: r.c[4]?.v || "",
                heroA2: r.c[5]?.v || "",
                playerB1: r.c[6]?.v || "",
                heroB1: r.c[7]?.v || "",
                playerB2: r.c[8]?.v || "",
                heroB2: r.c[9]?.v || "",
                winner: r.c[10]?.v || "",
                map: r.c[11]?.v || "",
                notes: r.c[12]?.v || ""
            };
        });

        renderMatches(matches);
    } catch (e) {
        console.error(e);
        alert("Ошибка загрузки. Проверь ID таблицы.");
    }
}

function renderMatches(matches) {
    const container = document.getElementById("matchesContainer");
    container.innerHTML = "";

    if (!matches.length) {
        container.innerHTML = "<p>Нет данных.</p>";
        return;
    }

    matches.forEach(m => {
        const block = document.createElement("div");
        block.className = "match-block";

        block.innerHTML = `
            <div class="match-date">${m.date} — ${m.mode}</div>

            <div class="team team-a">
                <h3>Команда A</h3>
                <p>${m.playerA1} <span>(${m.heroA1})</span></p>
                <p>${m.playerA2} <span>(${m.heroA2})</span></p>
            </div>

            <div class="team team-b">
                <h3>Команда B</h3>
                <p>${m.playerB1} <span>(${m.heroB1})</span></p>
                <p>${m.playerB2} <span>(${m.heroB2})</span></p>
            </div>

            <div class="winner">Победила команда: <b>${m.winner}</b></div>
            <div class="map">Поле: <b>${m.map}</b></div>
            <div class="notes">${m.notes}</div>
        `;

        container.appendChild(block);
    });
}

document.getElementById("loadBtn").addEventListener("click", loadMatches);
