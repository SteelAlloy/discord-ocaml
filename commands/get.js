function get (author) {
  author.send('**Hi! Type `ocaml h` to show help.**')
  console.log(author)
}

module.exports = get
