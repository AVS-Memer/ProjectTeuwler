const problemList = document.getElementById("problemList");

// Fetch problems from your backend
async function loadProblems() {
  try {
    // Replace with your backend endpoint URL
    const res = await fetch("https://project-teuwler-endpoints.vercel.app/api/problems");
    if (!res.ok) throw new Error("Failed to fetch problems");

    const problems = await res.json(); // this should be an array of {id, title, tags}
    const fragment = document.createDocumentFragment();

    problems.forEach(({ id, title, tags }) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.textContent = `#${id}: ${title}`;
      a.href = `./problems?problem=${id}`;

      li.appendChild(a);
      li.append(` [${tags.join(", ")}]`);
      fragment.appendChild(li);
    });

    problemList.appendChild(fragment);
  } catch (error) {
    console.error("Error loading problems:", error);
    problemList.textContent = "Failed to load problems.";
  }
}

// Run on page load
loadProblems();
