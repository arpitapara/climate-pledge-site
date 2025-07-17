let pledgeCount = 0;
let students = 0;
let professionals = 0;

// ✅ Auto-load existing entries from the sheet into pledge wall on page load
fetch("https://sheetdb.io/api/v1/w5yc6sm59lyxo")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById('pledgeTable');
    let id = 1;

    data.forEach(entry => {
      const row = table.insertRow();
      row.innerHTML = `
        <td>${id++}</td>
        <td>${entry.Name}</td>
        <td>${entry.Date}</td>
        <td>${entry.State}</td>
        <td>${entry.Profile}</td>
        <td>${entry.Hearts || '❤️'}</td>
      `;

      // Increment counters based on profile
      pledgeCount++;
      if (entry.Profile === 'Student') students++;
      if (entry.Profile === 'Working Professional') professionals++;
    });

    // Update live KPI counts
    document.getElementById('totalPledges').innerText = pledgeCount;
    document.getElementById('studentsCount').innerText = students;
    document.getElementById('professionalsCount').innerText = professionals;
  })
  .catch(err => {
    console.error("❌ Failed to load pledge wall from Google Sheet:", err);
  });

// ✅ Form submission handler
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = e.target[0].value;
  const email = e.target[1].value;
  const mobile = e.target[2].value;
  const state = e.target[3].value;
  const profile = e.target[4].value;

  const checkboxes = document.querySelectorAll('#form input[type="checkbox"]');
  const checkedItems = [...checkboxes].filter(cb => cb.checked);
  const checkedCount = checkedItems.length;
  const commitments = checkedItems.map(cb => cb.value).join(', ');
  const date = new Date().toLocaleDateString();
  const hearts = '❤️'.repeat(checkedCount || 1);

  pledgeCount++;
  if (profile === 'Student') students++;
  if (profile === 'Working Professional') professionals++;

  // ✅ Update KPI counters
  document.getElementById('totalPledges').innerText = pledgeCount;
  document.getElementById('studentsCount').innerText = students;
  document.getElementById('professionalsCount').innerText = professionals;

  // ✅ Generate Certificate
  const certificateSection = document.getElementById('certificate-section');
  const certificateContent = document.getElementById('certificate-content');
  certificateContent.innerHTML = `
    <h3>${name}</h3>
    <p><strong>Cool Enough to Care!</strong></p>
    <p style="font-size: 24px;">${hearts}</p>
  `;
  certificateSection.style.display = 'block';
  certificateSection.scrollIntoView({ behavior: 'smooth' });

  // ✅ Add to Pledge Wall
  const table = document.getElementById('pledgeTable');
  const row = table.insertRow();
  row.innerHTML = `
    <td>${pledgeCount}</td>
    <td>${name}</td>
    <td>${date}</td>
    <td>${state}</td>
    <td>${profile}</td>
    <td>${hearts}</td>
  `;

  // ✅ Send to Google Sheet via SheetDB
  fetch("https://sheetdb.io/api/v1/w5yc6sm59lyxo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        Name: name,
        Email: email,
        "Mobile Number": mobile,
        State: state,
        Profile: profile,
        Commitments: commitments,
        Date: date,
        Hearts: hearts
      }
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Data sent to Google Sheet", data);
    })
    .catch(err => {
      console.error("❌ Failed to send to Google Sheet", err);
    });

  // Optional: Reset form
  // e.target.reset();
});
