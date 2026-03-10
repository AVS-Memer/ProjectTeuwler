const problemList = document.getElementById("problemList");
const container = document.getElementById("pageContainer");
// Fetch problems from your backend
async function loadProblems() {
  try {
    // Replace with your backend endpoint URL
    const res = await fetch("https://project-teuwler-endpoints.vercel.app/api/problems");
    if (!res.ok) throw new Error("Failed to fetch problems");

    const problems = await res.json(); // this should be an array of {id, title, tags}
    const fragment = document.createDocumentFragment();

    problems.forEach(({ id, title, tags, difficulty }) => {
      const tr = document.createElement("tr");

      const idTd = document.createElement("td");
      idTd.textContent = id;
      tr.appendChild(idTd);

      const titleTd = document.createElement("td");
      const a = document.createElement("a");
      a.href = `./problems?problem=${id}`;
      a.textContent = title;
      titleTd.appendChild(a);
      tr.appendChild(titleTd);

      const tagsTd = document.createElement("td");
      tagsTd.textContent = tags.join(", ");
      tr.appendChild(tagsTd);

      const diffTd = document.createElement("td");
      diffTd.textContent = difficulty !== undefined ? difficulty : "-";
      tr.appendChild(diffTd);

      fragment.appendChild(tr);
    });

    problemList.appendChild(fragment);
    container.style.padding = "50px";
  } catch (error) {
    console.error("Error loading problems:", error);
    problemList.textContent = "Failed to load problems.";
  }
}

// Run on page load
loadProblems();
