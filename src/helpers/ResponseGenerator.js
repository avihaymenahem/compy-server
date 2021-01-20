const genSuccessRes = (data) => ({ status: 'ok', code: 200, data });
const genFailRes = (reason) => ({ status: 'failed', code: 400, reason });

module.exports = {
    genFailRes,
    genSuccessRes
}
