// Escapes user input so it is matched literally inside a RegExp
// (prevents regex injection / ReDoS through the search box).
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = escapeRegex;
