module.exports = function (babel) {
    return {
        pre(state) {
            this.count = 0;
            this.store = {};
        },
        visitor: {
            Program(path) {
                const pluginCtx = this;
                path.traverse({
                    enter(path) {
                        const leadingComments = path.node.leadingComments;
                        const trailingComments = path.node.trailingComments;
                        if (leadingComments) {
                            path.node.leadingComments = leadingComments.map((comment) => {
                                if (pluginCtx.store[`${comment.start}_${comment.end}`]) {
                                    return null;
                                }
                                if (comment.type == 'CommentLine' && comment.value.indexOf(' code>>') == 0) {
                                    const code = comment.value.replace(/^[ ]code>>/, '').replace('\r\n', '');
                                    path.insertBefore(babel.parse(code));
                                    pluginCtx.store[`${comment.start}_${comment.end}`] = true;
                                    pluginCtx.count = 0;
                                    return null;
                                }
                                return comment;
                            }).filter(Boolean);
                        }
                        if (trailingComments) {
                            const actions = [];
                            path.node.trailingComments = trailingComments.map((comment) => {
                                if (pluginCtx.store[`${comment.start}_${comment.end}`]) {
                                    return null;
                                }
                                if (comment.type == 'CommentLine' && comment.value.indexOf(' code>>') == 0) {
                                    const code = comment.value.replace(/^[ ]code>>/, '');
                                    actions.push(babel.parse(code));
                                    pluginCtx.store[`${comment.start}_${comment.end}`] = true;
                                    return null;
                                }
                                return comment;
                            }).filter(Boolean);
                            actions.reverse().forEach((ast) => {
                                path.insertAfter(ast)
                            })
                        }
                    }
                })
            }
        },
        post() {
            console.log(this.count);
            this.store={};
        }
    }
}
