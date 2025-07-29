// js/features/comments.js
// No imports needed if only displaying/clearing
// No exports needed if no other module calls these functions

let commentForm;
let commentLog;

export function init(commentFormRef, commentLogRef) {
    commentForm = commentFormRef;
    commentLog = commentLogRef;

    setupCommentForm();
    displayComments(); // Display initial (empty, since no local storage) comments
}

function setupCommentForm() {
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = getElement('comment-name'); // getElement is global/from helpers
            const textInput = getElement('comment-text');

            if (!nameInput || !textInput) return;

            if (!nameInput.value.trim() || !textInput.value.trim()) {
                alert("Please enter both your name and a comment.");
                return;
            }

            // Comments are no longer saved, just clear the log
            displayComments(); 
            nameInput.value = '';
            textInput.value = '';
        });
    }
}

// Internal function for comments module
function displayComments() {
    if (!commentLog) return;
    commentLog.innerHTML = ''; // Always clear the log as comments are not stored
}

// You'd need to import getElement from helpers.js if it's not global
function getElement(id) {
    return document.getElementById(id);
}