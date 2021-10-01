const { Telegraf } = require('telegraf');
const Axios = require('axios');
const Fs = require('fs')
const filePath = require('path');
const { default: axios } = require('axios');
const { Stream, finished } = require('stream');
const libre = require('libreoffice-convert');
const extend = '.pdf'


const bot = new Telegraf('441449130:AAEZDtUAkinhs7uaeVdmGnp9mjpYmmA63lk');


bot.start((ctx) => {
  ctx.reply('Теперь вы сучка Магомеда, ждите дальнейших указаний');
})

bot.on("document", (ctx) => {
  let url = `https://api.telegram.org/bot441449130:AAEZDtUAkinhs7uaeVdmGnp9mjpYmmA63lk/getFile?file_id=${ctx.message.document.file_id}`;
  let docname = ctx.message.document.file_name;
  var id= ctx.message.chat.id;
  let out = filePath.join(__dirname, `/files/${docname}${extend}`);
  console.log(out);
    async function getfile() {
    const response = await Axios({
      url,
      method: 'GET',
    });
    let path = `https://api.telegram.org/file/bot441449130:AAEZDtUAkinhs7uaeVdmGnp9mjpYmmA63lk/${response.data.result.file_path}`;
    async function getTo(p) {
      var filepath = filePath.resolve(__dirname, 'files', `${ctx.message.document.file_name}`);
      const writer = Fs.createWriteStream(filepath);
      const donwfile = await axios({
        method: 'get',
        url: path,
        responseType: 'stream'
      })
      .then(function (response) {
        response.data.pipe(writer)
        .on('error', () => {
          // log error and process 
        })
        .on('finish', () => {
          let enterPath = filePath.join(__dirname, `/files/${docname}`);
          let outputPath = filePath.join(__dirname, `/files/${docname}${extend}`);
          const file = Fs.readFileSync(enterPath);
          // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
          libre.convert(file, extend, undefined, (err, done) => {
            if (err) {
              console.log(`Error converting file: ${err}`);
            }
            // Here in done you have pdf file which you can save or transfer in another stream
            Fs.writeFileSync(outputPath, done);
          });
        });
      }).then( () =>{
        console.log(id)
        
        bot.telegram.sendDocument(id,filePath.join(__dirname, `/files/${docname}${extend}`))
      }
       
      )
       



    }
    getTo(path);
    

  }
  getfile();
})

bot.launch();