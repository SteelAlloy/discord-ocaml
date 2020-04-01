/* eslint-disable no-control-regex */
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const logger = require('./logger')

const processes = new Map()
const lastUses = new Map()
const funcsCalls = new Map()
const willEnd = new Set()
const writeStreams = new Map()

function runProcess (channel) {
  const id = channel.id
  const ocaml = spawn('ocaml', ['-noprompt'])

  const filePath = path.resolve(__dirname, '../generated/', new Date().getTime() + '-' + id + '.ml')
  const file = fs.createWriteStream(filePath)
  writeStreams.set(id, file)

  file.on('finish', () => {
    channel.send({ files: [filePath] }).then(() => {
      fs.unlink(filePath, (err) => {
        if (err) throw err
        logger.info({ message: `File deleted: ${filePath}`, id })
      })
    })
  })

  logger.verbose({ message: 'OCaml spawned.', id })

  ocaml.stdout.on('data', (data) => {
    const output = data.toString()

    logger.info({ message: `Data received from OCaml: ${output.trim()}`, id: channel.id })
    logger.debug({ message: `Last uses: ${lastUses.get(id)}, functions calls: ${funcsCalls.get(id)}, will end: ${willEnd.has(id)}`, id })

    lastUses.set(channel.id, new Date().getTime())
    funcsCalls.set(channel.id, funcsCalls.get(channel.id) + 1)

    if (output.match(/^\s*$/) !== null) return

    if (output.length >= 1500) {
      if (!willEnd.has(channel.id)) {
        logger.warn({ message: `The length of the result is too long. Shut down... [${output.length}]`, id: channel.id })
        channel.send(':infinity: **The length of the result is too long. Shut down...**')

        willEnd.add(channel.id)
        endProcess(processes.get(id))
      }
    } else {
      channel.send('```ocaml\n' + removeANSI(output) + '\n```')

      if (output.match(/Error/)) {
        const errorOutput = ANSItoMarkdown(output)
        if (errorOutput.match(/^\s*$/) !== null) return

        channel.send('**Here:**')
        channel.send(errorOutput)
      }
    }
  })

  ocaml.on('close', (code) => {
    const file = writeStreams.get(channel.id)
    file.end()

    processes.delete(channel.id)
    lastUses.delete(channel.id)
    funcsCalls.delete(channel.id)
    willEnd.delete(channel.id)
    writeStreams.delete(channel.id)

    if (code === 0 || code === null) {
      logger.verbose({ message: `Child process exited with code ${code}`, id })
      channel.send(':white_check_mark: **Process exited without errors.**')
    } else {
      logger.warn({ message: `Child process exited with code ${code}`, id })
      channel.send(`:warning: **Process exited with code ${code}.**`)
    }
  })

  return ocaml
}

function illegalKeywords (code) {
  return code.match(/in_channel|out_channel|stdin|stdout|stderr/) ||// Input/output
    code.match(/open_out|open_out_bin|open_out_gen|flush|flush_all|output_char|output_string|output_bytes|output|output_substring|output_byte|output_binary_int|output_value|seek_out|pos_out|out_channel_length|close_out|close_out_noerr|set_binary_mode_out/) ||// General output functions
    code.match(/open_in|open_in_bin|open_in_gen|input_char|input_line|input|really_input|really_input_string|input_byte|input_binary_int|input_value|seek_in|pos_in|in_channel_length|close_in|close_in_noerr|set_binary_mode_in/) || // General input functions
    code.match(/save_event_for_automatic_snapshots/) || // Spacetime
    code.match(/argv|executable_name|file_exists|is_directory|remove|rename|getenv|getenv_opt|command|time|chdir|getcwd|readdir|interactive|os_type|backend_type|backend_type|unix|win32|cygwin|word_size|int_size|big_endian|max_string_length|max_array_length|max_floatarray_length|runtime_variant|runtime_parameters/) || // Sys
    code.match(/signal_behavior|signal|set_signal/) || // Signal handling
    code.match(/add_channel|output_buffer/) || // Buffer
    code.match(/current_dir_name|parent_dir_name|dir_sep|concat|is_relative|is_implicit|check_suffix|chop_suffix|chop_suffix_opt|extension|remove_extension|chop_extension|basename|dirname|null|temp_file|open_temp_file|get_temp_dir_name|set_temp_dir_name|temp_dir_name|quote|quote_command/) || // Filename
    code.match(/minor_heap_size|major_heap_increment|space_overhead|verbose|max_overhead|stack_limit|allocation_policy|window_size|custom_major_ratio|custom_minor_ratio|custom_minor_max_size|stat|quick_stat|counters|minor_words|get|set|minor|major_slice|major|full_major|compact|print_stat|allocated_bytes|get_minor_free|get_bucket|get_credit|huge_fallback_count|finalise|finalise_last|finalise_release|create_alarm|delete_alarm/) // Gc
}

function input (channel, code) {
  const illegal = illegalKeywords(code)

  if (illegal) {
    logger.warn({ message: `Illegal keyword found: ${illegal}`, id: channel.id })
    channel.send(`:no_entry_sign: **Illegal keyword found: __${illegal[0]}__**`)
  } else {
    const process = processes.get(channel.id)
    const writeStream = writeStreams.get(channel.id)

    writeStream.write(`${code}\r\n`)
    process.stdin.write(`${code}\r\n`)

    funcsCalls.set(channel.id, 0)

    setTimeout(() => {
      const calls = funcsCalls.get(channel.id)
      if (calls > 20) {
        logger.warn({ message: `Too many echoes in 100 ms. Shut down... [${calls}]`, id: channel.id })
        channel.send(':infinity: **Too many echoes in 100 ms. Shut down...**')

        endProcess(process)
      }
    }, 100)
  }
}

function endProcess (process) {
  process.kill('SIGHUP')
}

function addSemicolon (code) {
  return code.replace(/(;;\s*$|;\s*$|\s*$)/, ';;')
}

function removeANSI (code) {
  return code
    .replace(/\x1b\[A/g, '')
    .replace(/\x1b\[4m/g, '')
    .replace(/\x1b\[24m/g, '')
}

function ANSItoMarkdown (code) {
  return code
    .replace(/\x1b\[A/g, '')
    .replace(/(\x1b\[4m)(.*)(\x1b\[24m)/gs, '__$2__')
    .replace(/\x1b\[24m/g, '')
    .replace(/Error:.*/gs, '')
}

module.exports = { runProcess, endProcess, input, addSemicolon, lastUses, processes }
