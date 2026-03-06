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
    const res = await fetch(`https://project-teuwler-endpoints.vercel.app/api/problem?id=${problemId}`);
    if (!res.ok) throw new Error("Failed to fetch problem");

    const data = await res.json();
    if (!data) {
      nameEl.textContent = "Problem not found";
      problemEl.textContent = "This problem ID does not exist.";
      checkBtn.disabled = true;
      return;
    }

    nameEl.textContent = data.title || `Problem ${problemId}`;
    problemEl.textContent = data.statement || "No statement provided.";
    checkBtn.disabled = false;

  } catch (err) {
    console.error("Error loading problem:", err);
    nameEl.textContent = "Error loading problem";
    problemEl.textContent = "Check console for details.";
    checkBtn.disabled = true;
  }
}

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
      solutionEl.textContent = result.solutionMDX || "Solution not available";
      alert("Correct!");
    } else {
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
