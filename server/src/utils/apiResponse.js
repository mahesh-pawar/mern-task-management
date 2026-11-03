// Every successful response uses the same envelope:
// { status: 'success', message, data }
function sendSuccess(res, statusCode, message, data) {
    const body = { status: 'success', message };
    if (data !== undefined) {
        body.data = data;
    }

    return res.status(statusCode).json(body);
}

module.exports = { sendSuccess };
