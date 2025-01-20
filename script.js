const students = [
    { name: 'Fransiskus J. Khan', npm: '51230001' },
    { name: 'Adelia Mutiara', npm: '51230004' },
    { name: 'Kristiani Timo', npm: '210003' },
    { name: 'EPRY NUBON', npm: '210004' },
    { name: 'RINTO', npm: '210005' },
    { name: 'EPANG JAMPI', npm: '210006' },
    { name: 'BELA LESTARI', npm: '210007' },
    { name: 'HERY HATUMALE', npm: '210008' },
    { name: 'RIO ASER', npm: '210009' },
    { name: 'ANJELI PERMATA', npm: '210010' }
];

let savedGroups = JSON.parse(localStorage.getItem('savedGroups')) || {};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateResetTime() {
    const resetTime = new Date(Date.now() + 10 * 60 * 1000);
    const formattedTime = resetTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    $("#resetInfo").text(`Data akan direset pada: ${formattedTime}`);
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const subject = $("#subject").val();
    pdf.setFontSize(20);
    pdf.text(`Universitas Timor (Teknologi Informasi)`, 105, 20, { align: "center" });
    pdf.setFontSize(16);
    pdf.text(`Hasil Pembagian Kelompok INTECH 23 A`, 105, 30, { align: "center" });
    pdf.setFontSize(14);
    pdf.text(`Matakuliah: ${subject}`, 105, 40, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(`_________________________________________________________________________________`, 105, 40, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(`"Masa Depanmu adalah Hasil dari Usahamu"`, 105, 50, { align: "center" });
    pdf.setFontSize(8);
    const groups = $("#groups .card");
    let yOffset = 60;
    groups.each(function (index) {
        pdf.setFontSize(14);
        pdf.text(`Kelompok ${index + 1}`, 10, yOffset);
        yOffset += 10;
        $(this).find("li").each(function () {
            pdf.setFontSize(12);
            pdf.text($(this).text(), 15, yOffset);
            yOffset += 10;
        });
        yOffset += 10;
    });
    pdf.save(`pembagian_kelompok_${subject}.pdf`);
}

function displayGroups(groups) {
    const resultDiv = $("#groups");
    resultDiv.empty();
    groups.forEach((group, i) => {
        const groupHtml = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Kelompok ${i + 1}</h5>
                    <ul class="list-group">
                        ${group.map(student => `<li class="list-group-item">${student.name} (${student.npm})</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        resultDiv.append(groupHtml);
    });
    $("#downloadPdf").show();
}

$("#groupForm").on("submit", function (event) {
    event.preventDefault();
    const subject = $("#subject").val();
    const groupCount = parseInt($("#groupCount").val());
    if (groupCount <= 0 || groupCount > students.length) {
        alert("Jumlah kelompok tidak valid!");
        return;
    }
    if (savedGroups[subject]) {
        displayGroups(savedGroups[subject]);
        alert("Kelompok sudah ada sebelumnya, tidak diacak ulang.");
        return;
    }
    shuffleArray(students);
    const groups = Array.from({ length: groupCount }, () => []);
    students.forEach((student, index) => {
        groups[index % groupCount].push(student);
    });
    savedGroups[subject] = groups;
    localStorage.setItem('savedGroups', JSON.stringify(savedGroups));
    displayGroups(groups);
    const submitBtn = $("#submitBtn");
    submitBtn.prop("disabled", true);
    setTimeout(() => {
        submitBtn.prop("disabled", false);
        $("#subject").val('');
        $("#groupCount").val('');
        $("#groups").empty();
        $("#downloadPdf").hide();
    }, 15 * 60 * 1000);
});

$("#downloadPdf").on("click", generatePDF);

setInterval(() => {
    savedGroups = {};
    localStorage.removeItem('savedGroups');
    $("#groups").empty();
    $("#downloadPdf").hide();
    alert("Pembagian kelompok telah direset otomatis setelah 10 menit.");
    updateResetTime();
}, 10 * 60 * 1000);

$(document).ready(function () {
    updateResetTime();
});
