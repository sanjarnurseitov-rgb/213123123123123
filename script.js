async function loadData() {
  const sheetId = document.getElementById('sheetId').value.trim();
  if(!sheetId){ alert('Введите ID'); return; }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const raw = await fetch(url).then(r=>r.text());
    const json = JSON.parse(raw.substring(47, raw.length - 2));

    const table = document.getElementById('matches');
    table.innerHTML = "";

    const header = document.createElement('tr');
    json.table.cols.forEach(c=>{
      const th = document.createElement('th');
      th.textContent = c.label;
      header.appendChild(th);
    });
    table.appendChild(header);

    json.table.rows.forEach(r=>{
      const tr = document.createElement('tr');
      r.c.forEach(cell=>{
        const td = document.createElement('td');
        td.textContent = cell ? cell.v : "";
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  } catch (e) {
    alert("Ошибка загрузки. Проверь ID таблицы.");
  }
}
