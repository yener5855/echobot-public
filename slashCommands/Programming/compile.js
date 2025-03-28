const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('compile')
    .setDescription('Compile code')
    .addStringOption(option => 
      option.setName('code')
        .setDescription('The code to compile')
        .setRequired(true)),
  async execute(interaction) {
    const codeBlock = interaction.options.getString('code');
    let es = ee;
    try {
      const possiblecommands = {
        cpp: "g++ main.cpp -pthread -pedantic -Wall -Wextra && ./a.out",
        "c++": "g++ main.cpp -pthread -pedantic -Wall -Wextra && ./a.out",
        c: "mv main.cpp main.c && gcc main.c -pedantic -O2 -pthread -Wall -Wextra && ./a.out",
        ruby: "ruby main.cpp",
        rb: "ruby main.cpp",
        lua: "lua main.cpp",
        python: "python main.cpp",
        py: "python main.cpp",
        haskell: "runhaskell main.cpp",
        hs: "runhaskell main.cpp",
        bash: "bash main.cpp",
        sh: "sh main.cpp",
        shell: "sh main.cpp"
      };

      const { lang, code } = getCodeBlock(codeBlock);

      function getCodeBlock(txt) {
        const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
        if (!match) return { lang: null, code: txt };
        if (match[1] && !match[2]) return { lang: null, code: match[1] };
        return { lang: match[1], code: match[2] };
      }

      if (!lang || !code) 
        return interaction.reply({ embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle('Invalid Code Block')
          .setDescription('Please provide a valid code block with language and code.')] });

      if (!possiblecommands[lang]) 
        return interaction.reply({ embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle('Unsupported Language')
          .setDescription('The provided language is not supported for compilation.')] });

      const cmd = possiblecommands[lang];
      const src = code;
      const res = await fetch("http://coliru.stacked-crooked.com/compile", {
        method: "POST",
        body: JSON.stringify({ cmd, src })
      })
      .then((res) => res.text());

      async function post(interaction, { cmd, src }) {
        const id = await fetch("http://coliru.stacked-crooked.com/share", {
          method: "POST",
          body: JSON.stringify({ cmd, src })
        })
        .then((res) => res.text());
        return interaction.reply({ content: `Compilation result: http://coliru.stacked-crooked.com/a/${id}` });
      }

      if (res.length < 1990) return interaction.reply({ content: `\`\`\`${lang}\n${res}\n\`\`\`` });
      return post(interaction, { cmd, src });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      return interaction.reply({ embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle('An error occurred')
        .setDescription('Could not compile the code.')] });
    }
  }
};
