// fetch specific problem from database at start
// fetch answer or send answer to firebase to have it check for correctness
// if correct receive object with solution data and show it, if incorrect send that

const nameEl = document.getElementById("name");
const problemEl = document.getElementById("problem");
const answerInput = document.getElementById("answer");
const checkBtn = document.getElementById("check");
const solutionEl = document.getElementById("solution");

// Get problem ID from URL (?problem=...)
function getProblemIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("problem");
}

// Load specific problem metadata at start
async function loadProblem() {
  const problemId = getProblemIdFromUrl();
  if (!problemId) {
    nameEl.textContent = "No problem selected";
    problemEl.textContent = "Add ?problem=ID to the URL.";
    checkBtn.disabled = true;
    return;
  }

  try {
    // Fetch only title and statement (tags optional) from backend
    const res = await fetch(`https://project-teuwler-endpoints.vercel.app/api/problems?id=${problemId}`);
    if (!res.ok) throw new Error("Failed to fetch problem");

    const data = await res.json();
    if (!data) {
      nameEl.textContent = "Problem not found";
      problemEl.textContent = "This problem ID does not exist.";
      checkBtn.disabled = true;
      return;
    }

    nameEl.textContent = data.title || `Problem ${problemId}`;

    problemEl.innerHTML = marked.parse(data.mdx || "No statement provided.");
    // render math inside problem
    renderMathInElement(problemEl, {
      throwOnError: false,
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "$", right: "$", display: false}
      ]
    });

    checkBtn.disabled = false;

  } catch (err) {
    console.error("Error loading problem:", err);
    nameEl.textContent = "Error loading problem";
    problemEl.textContent = "Check console for details.";
    checkBtn.disabled = true;
  }
}

// When check button is clicked
async function checkAnswer() {
  const problemId = getProblemIdFromUrl();
  if (!problemId) return;

  const userAnswerRaw = answerInput.value;
  if (userAnswerRaw === "") {
    alert("Please enter an answer.");
    return;
  }
  const userAnswer = Number(userAnswerRaw);

  try {
    const res = await fetch("https://project-teuwler-endpoints.vercel.app/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, userAnswer })
    });

    if (!res.ok) throw new Error("Failed to check answer");

    const result = await res.json();

    if (result.correct) {
      // Show solution if correct
      solutionEl.innerHTML = marked.parse(result.solutionMDX || "Solution not available");
      // render math inside solution
      renderMathInElement(solutionEl, {
        throwOnError: false,
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display: false}
        ]
      });

      alert("Correct!");
    } else {
      answerInput.value = "";
      solutionEl.textContent = "";
      alert(result.message || "Incorrect, try again.");
    }
  } catch (err) {
    console.error("Error checking answer:", err);
    alert("Error checking answer. See console.");
  }
}

// Wire up events
checkBtn.addEventListener("click", checkAnswer);

// Run on page load
loadProblem();
