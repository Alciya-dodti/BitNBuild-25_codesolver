function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.getElementById('askBtn');
  const questionInput = document.getElementById('taxQuestion');
  const replyDiv = document.getElementById('taxReply');
  askBtn.addEventListener('click', function() {
    const question = questionInput.value.trim().toLowerCase();
    if (!question) {
      replyDiv.innerHTML = "⚠️ Please type a question before asking!";
      return;
    }
    let reply = "❓ Sorry, I’m not sure about that. Please ask something related to taxes.";
    if (question.includes("deduction") || question.includes("80c") || question.includes("investment")) {
        reply = "💰 Eligible for deductions under Section 80C: PPF, ELSS, Life Insurance.";
    } else if (question.includes("deadline") || question.includes("due date")) {
        reply = "🗓️ File your taxes before the deadline to avoid penalties.";
    } else if (question.includes("form 16") || question.includes("salary slip")) {
        reply = "📄 Form 16 is provided by your employer and is required for ITR.";
    } else if (question.includes("tax slab") || question.includes("rate")) {
        reply = "📊 Refer to current year’s tax slabs to know your liability.";
    } else if (question.includes("refund")) {
        reply = "💵 If you’ve overpaid, file your ITR to claim a refund.";
    }
    replyDiv.innerHTML = `<strong>AI:</strong> ${reply}`;
  });
});
