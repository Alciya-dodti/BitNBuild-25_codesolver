document.getElementById('askBtn').addEventListener('click', function() {
    const question = document.getElementById('taxQuestion').value.trim().toLowerCase();
    const replyDiv = document.getElementById('taxReply');

    if (!question) {
        replyDiv.innerHTML = "Please type a question before asking!";
        return;
    }

    let reply = "Sorry, I’m not sure about that. Please ask something related to taxes.";

    // Context-based responses
    if (question.includes("deduction") || question.includes("80c") || question.includes("investment")) {
        reply = "You may be eligible for deductions under Section 80C for investments like PPF, ELSS, and life insurance. 💰";
    } else if (question.includes("deadline") || question.includes("due date")) {
        reply = "Make sure to file your taxes before the due date to avoid penalties. 🗓️";
    } else if (question.includes("form 16") || question.includes("salary slip")) {
        reply = "Form 16 is issued by your employer and is essential for filing your income tax return. 📄";
    } else if (question.includes("tax slab") || question.includes("rate")) {
        reply = "Check the current financial year’s tax slabs to calculate your tax liability accurately. 📊";
    } else if (question.includes("refund")) {
        reply = "If you’ve paid excess tax, you can claim a refund by filing your ITR. 💵";
    }

    replyDiv.innerHTML = `<strong>AI:</strong> ${reply}`;
});
