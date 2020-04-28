const babelParser= require('@babel/parser');
function generateCode (code) {
    const file = babelParser.parse(code);
    return file.program.body || [];
}
module.exports = function (babel) {
    return {
        pre(state) {
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
                                    generateCode(code).forEach((node) => {
                                        path.insertBefore(node);
                                    })
                                    pluginCtx.store[`${comment.start}_${comment.end}`] = true;
                                    return null;
                                }
                                return comment;
                            }).filter(Boolean);
                        }
                        if (trailingComments) {
                            let actions = [];
                            path.node.trailingComments = trailingComments.map((comment) => {
                                if (pluginCtx.store[`${comment.start}_${comment.end}`]) {
                                    return null;
                                }
                                if (comment.type == 'CommentLine' && comment.value.indexOf(' code>>') == 0) {
                                    const code = comment.value.replace(/^[ ]code>>/, '');
                                    actions = actions.concat(generateCode(code));
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
            this.store={};
        }
    }
}
