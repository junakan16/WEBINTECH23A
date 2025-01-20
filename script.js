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
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const subject = $("#subject").val();
    pdf.text(`Hasil Pembagian Kelompok ${subject}`, 10, 10);
    $("#groups .card").each(function (index) {
        pdf.text(`Kelompok ${index + 1}`, 10, 20 + index * 10);
    });
    pdf.save("groups.pdf");
}
$("#groupForm").on("submit", function (e) {
    e.preventDefault();
    const subject = $("#subject").val();
    const groupCount = $("#groupCount").val();
    shuffleArray(students);
    const groups = Array.from({ length: groupCount }, () => []);
    students.forEach((student, index) => groups[index % groupCount].push(student));
    savedGroups[subject] = groups;
    localStorage.setItem('savedGroups', JSON.stringify(savedGroups));
    displayGroups(groups);
});
$("#downloadPdf").on("click", generatePDF);
