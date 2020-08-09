const subjects = [
    "Artes",
    "Biologia",
    "Ciencias",
    "Educação Fisica",
    "Geografia",
    "Historia",
    "Matematica",
    "Portugues",
    "Quimica"]

const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
]

function getSubject(subjectNumber) {
    const position = +subjectNumber -1
    return subjects[position]
}

function convertHoursToMinutes(time) {
    const [hour,minutes] = time.split(":")
    return Number((hour * 60) + minutes)
}

const express = require("express")
const server = express()

const database = require('./database/db')

//const {subjects,weekdays,getSubject,convertHoursToMinutes} = require('./utils/format')

function pageLanding(req,res) {
    return res.render("index.html")
}

async function  pageStudy(req,res) {
    const filters = req.query


    if (!filters.subject || !filters.weekday || !filters.time) {
        return res.render("study.html", {filters,subjects,weekdays})
    }

    // converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
    SELECT classes.*,proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE EXISTS (
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = classes.id
        AND class_schedule.weekday = ${filters.weekday}
        AND class_schedule.time_from <= ${timeToMinutes}
        AND class_schedule.time_to > ${timeToMinutes}   
        )
        AND classes.subject = '${filters.subject}'

    `

    try {
        const db = await database
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return  res.render('study.html', { proffys,subjects,filters,weekdays })

    } catch (error) {
        console.log(error)
    }


    
}

function pageGiveClasses(req,res) {
    
    //console.log(dados)
    
    return res.render("give-classes.html",{subjects,weekdays})
}

async function saveClasses(req,res) {
    const createProffy = require ("./database/createProffy")
    
    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }

    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map((weekday,index) => {

        return {
            weekday,
            time_from : convertHoursToMinutes(req.body.time_from[index]),
            time_to :  convertHoursToMinutes(req.body.time_to[index])
        }

    })

    try {
       const db = await database
       await createProffy(db,{proffyValue,classValue,classScheduleValues }) 

       let queryString = "?subject=" + req.body.subject
       queryString += "&weekday=" + req.body.weekday[0]
       queryString += "&time=" + req.body.time_from[0]

       return res.redirect("/study" + queryString)
    } catch (error) {
        console.log(error)
    }


    




    
 }



//configurar nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})

//Inicio e configuração do servidor
server
//receber os dados do req.body
.use(express.urlencoded({ extended: true}))

// configurar arquivos estátisticos (css,scripts,imagens)
server.use(express.static("public"))
// rotas da aplicação
.get("/" , pageLanding)
.get("/study",pageStudy)
.get("/give-classes",pageGiveClasses)
.post("/save-classes",saveClasses)
.listen(5500)

//console.log(__dirname) = "c/nlw/src"

//////////////// Comandos no git bash para gerar servido local usando npm //////////////////////////////

// npm init -y

// npm install express

// node src/server.js - roda javascript do servidor para parar usar CTRL+C 

// npm install nodemon -D - Instalar nodemon exclusivamente para desenvolvedores - nodemon
// é uma ferramenta que faz o servidor reiniciar automaticamente quando houver mudança no 
// serve.js sem precisar fazer na mão com comando node

// Alterar no package.json - test = dev - "nodemon src/server.js"

// npm run dev 

/////////////////////////////////////////////////////////////////////

// GET - verbo que o HTTP usa quando o usuario entra na pagina,consegue ser acessado pela
// proprio endereço do site (URL)

// POST - só consegue acessar por formulario ou uma pesquisa dentro do site

////////////////// Nunjuck - template engine ////////////////////////////////////////////////////////////

// npm install nunjucks