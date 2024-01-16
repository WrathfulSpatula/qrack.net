// arxivController.js

// Services
const SubmissionService = require('../service/submissionService')
const submissionService = new SubmissionService()

function sendResponse (res, code, m) {
  const body = JSON.stringify({ message: m })
  res.writeHead(code, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain'
  })
    .end(body)
}

async function routeWrapper (res, serviceFn, successMessage) {
  try {
    // Call the service function, to perform the intended action.
    const result = await serviceFn()
    if (result.success) {
      // If successful, pass the service function result as the API response.
      res.json({ message: successMessage, data: result.body }).end()
    } else {
      // The service function handled an error, but we can't perform the intended action.
      sendResponse(res, 404, result.error)
    }
  } catch (err) {
    // There was an unhandled exception.
    sendResponse(res, 500, err)
  }
}

exports.read = async function (req, res) {
  routeWrapper(res,
    async () => {
      return { success: true, body: {} }
    },
    'Retrieved job output and status by ID.')
}
