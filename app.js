// const { Client,List,MessageMedia,Buttons,LocalAuth,GroupChat,LegacySessionAuth } = require('whatsapp-web.js');
const { Client,List,MessageMedia,Buttons,LocalAuth,GroupChat } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const port = '3030';
const express = require('express');
const app = express();
var QRCode = require('qrcode')



const client = new Client({
    authStrategy: new LocalAuth()
});


app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname
    });
  });
  
// const client = new Client({
//     restartOnAuthFail:true,
//     puppeteer:{
//         headless:true,
//         args:[
//             '--no-sandbox',
//             '--disable-dev-shm-usage',
//             '--disable-accelerated-2d-canvas',
//             '--no-first-run',
//             '--no-zygote',
//             '--single-process',
//             '--disable-gpu'
//         ],
//     },
//     authStrategy: new LocalAuth()
// });

client.initialize();
   
        client.on('qr', (qr) => {
            // Generate and scan this code with your phone
            console.log('QR RECEIVED', qr);
            qrcode.generate(qr);
   
});






client.on('ready', () => {
  
 
    console.log('READY');
});
// client.on("authenticated", (session) =>{
//     console.log('AUTHENTICATED',session);
//     sessionCfg=session;
//     fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err){
//        if (err){
//         console.error(err);
//        }
//     });
// });



client.on('message', async msg => {
    
    if (msg.body === '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
    } 
    

    else if (msg.body === '!sticker' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        let chat = await msg.getChat();
        const result_sticker = client.formatImageToWebpSticker(attachmentData); 
        msg.reply(result_sticker);
    }
        else if(msg.body == "Crush_name"){
            var contact = await msg.getContact();
            const crush_array = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
            const crush = crush_array[Math.floor(Math.random()*crush_array.length)];
            client.sendMessage(msg.from,`${contact.pushname} crush name : ${crush}`);
        }
       
        else if (msg.body.startsWith('!subject ')) {
            // Change the group subject
            let chat = await msg.getChat();
            if (chat.isGroup) {
                let newSubject = msg.body.slice(9);
                chat.setSubject(newSubject);
            } else {
                msg.reply('This command can only be used in a group!');
            }
        }
        else if (msg.body.startsWith('!kick ')) {
            // Change the group subject
            let chat = await msg.getChat();
            if (chat.isGroup) {
                let id_b = msg.body.slice(6);
                var id = client.getNumberId(id_b+"@c.us"); 
                chat.removeParticipants(id) 
            } else {
                msg.reply('This command can only be used in a group!');
            }
        }
        else if (msg.body.startsWith('!sendto ')) {
            // Direct send a new message to specific id
            var contact = await msg.getContact();
            let number = msg.body.split(' ')[1];
            let messageIndex = msg.body.indexOf(number) + number.length;
            let message = msg.body.slice(messageIndex, msg.body.length);
            number = number.includes('@c.us') ? number : `${number}@c.us`;
       
            client.sendMessage(number, `${message} \n( *From ${contact.number} / ${contact.pushname}* ) `);
    
        } 
     
        else if (msg.body == "info"){
            let chat = await msg.getChat();
            const media = MessageMedia.fromFilePath('logo.jpg');
            let sections = [{title:'sectionTitle',rows:[{title:'Command'},{title:'Chat admin.'}]}];
            let list = new List('','Select menu',sections,'Action','footer');
            msg.reply(list);
            chat.sendMessage(media,{ caption: `Hi! Selamat datang!.\nIG : kristian_.sp\nWebsite : https://krisnet.xyz\n👋🏼👋🏼.\n` });
            

        }
        else if(msg.body == "aswin"){
            let chat = await msg.getChat();
            const media = MessageMedia.fromFilePath('aswin-4.jpg');
            chat.sendMessage(media,{ caption: 'Aswin.' });
        }
        else if(msg.body.startsWith("getpp ")){
            var id = msg.body.slice(6);
            var pict = await client.getProfilePicUrl(id+"@c.us") ;
            let chat = await msg.getChat();
            const pict_result = await MessageMedia.fromUrl(pict);
            chat.sendMessage(pict_result,{ caption: `Profile picture *${id}* .` });
        }
        else if (msg.body == '!list') {
            let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
            let list = new List('List body','Select menu',sections,'Title','footer');
            client.sendMessage(msg.from, list);
        }
        else if (msg.body == '!buttons') {
            let button = new Buttons('Button body', [{id:'customId',body:'button1'},{body:'button2'},{body:'button3'},{body:'button4'}],'title','footer');
            client.sendMessage(msg.from, "hi"+button);
        }
    console.log(msg.body);
    var contact = await msg.getContact();
        var i = 1;
        var tanggal = new Date();
        var chat_jsn =  `{
            "Username:":"${contact.pushname}",
            "Number":"${contact.number}",
            "chat":"${msg.body}",
            "tanggal":"${tanggal}"
        }`;
       
        // fs.writeFile(`file_chat/${tanggal}|${contact.pushname} : ${msg.body}.json`,chat_jsn, function(err) {
        //     if(err) {
        //         return console.log(err);
        //     }
        //     console.log("The file was saved!");
        // }); 
    // do something with the media data here
 
});
app.get('/gateway',(req,res)=>{
    res.sendFile('gate.html', {
        root: __dirname
      });
});

app.get('/api',(req,res)=>{
    let query_pesan = req.query.pesan;
    let query_nomor = req.query.nomor;
    
    client.sendMessage(query_nomor+"@c.us",query_pesan+"\n *Bot whatsapp gateway*");

});

app.listen(port, ()=>{
console.log(`App running. port : ${port}`);
});
