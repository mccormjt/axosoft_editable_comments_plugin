(function() {
    console.log('Axosoft Editable Comments Plugin Running!');

    var CANCEL_EDIT_BTN_CLASS = 'cancel-editing';
    var BASE_CANCEL_EDIT_BTN_CLASSES = 'button button--neutral button--small cancel formaction';

    var self = {
        cancelEditBtn: buildCancelEditBtn(),
        lastCommentItem: null,
        lastCommentEditor: null,
        $: function(qs) { return document.querySelector(qs) }
    };

    onCommentEvent('dblclick', startEditingComment);

    function onCommentEvent(eventType, callback) {
        window.addEventListener(eventType, function(event) {
            var commentBody = event.target.closest('.comment-body');
            commentBody && callback(commentBody.parentElement);
        })
    }

    function buildCancelEditBtn() {
        var btn = document.createElement('button');
        btn.setAttribute('class', BASE_CANCEL_EDIT_BTN_CLASSES + ' ' + CANCEL_EDIT_BTN_CLASS);
        btn.innerText = 'Cancel';
        btn.onclick = stopEditingLastComment;
        btn.style['float'] = 'left';
        return btn;
    }

    function startEditingComment(commentItem) {
        // Switch Focus to editing new comment
        if (getEditorTextArea(commentItem)) return;
        stopEditingLastComment();
        self.lastCommentItem = commentItem;

        // Get content of current element and hide
        toggleElm(commentItem, false);
        var commentText = commentItem.querySelector('.comment-text').innerHTML;

        // Replace current comment with editor (fill with current comment text)
        var commentEditor = buildCommentEditor(commentText);
        commentItem.before(commentEditor);
    }

    function stopEditingLastComment() {
        if (!self.lastCommentItem) return;
        try { self.lastCommentEditor.remove() } catch(e) {};
        self.lastCommentEditor = null;
        toggleAddCommentBtn(true);
        toggleElm(self.lastCommentItem, true);
        self.lastCommentItem = null;
    }

    function toggleAddCommentBtn(isShown) {
        var commentAddBtn = toggleElm(self.$('#commentAdd a'), isShown);
        return commentAddBtn;
    }

    function buildCommentEditor(commentText) {
        toggleAddCommentBtn(false).click();
        var editor = self.$('.axo-lightgrid-item.comment-add');
        editor.querySelector('.comment-add-count').before(self.cancelEditBtn);
        editor.querySelector('.comment-add-addButton').onclick = handleCommentSave;
        textArea = getEditorTextArea(editor)
        textArea.innerHTML = commentText;
        textArea.dispatchEvent(new Event('keyup')); // To update Char counter
        self.lastCommentEditor = editor
        return editor;
    }

    function getEditorTextArea(editor) {
        return editor.querySelector('.comment-add-textarea');
    }

    function handleCommentSave() {
        // We need to remove old comment since the new one is being saved.
        self.lastCommentItem.querySelector('.comment-delete').click();
        self.$('.axo-popup-content .button.save').click();
        stopEditingLastComment();
    }

    function toggleElm(elm, isShown) {
        displayProp = isShown ? '' : 'none';
        elm.style['display'] = displayProp;
        return elm;
    }
})();
