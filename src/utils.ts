export const handleError = (err, res) => {
  if (err && err.data) {
    return res.status(500).send(err.data.error)
  } else if (typeof err === 'object') {
    return res.status(500).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  } else {
    return res.status(500).send(err)
  }
}
