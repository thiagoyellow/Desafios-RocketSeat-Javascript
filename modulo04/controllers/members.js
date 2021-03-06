const Intl = require('intl')
const fs = require('fs')
const data = require('../data.json')
const { age, date } = require("../utils.js")


exports.index =  function(req, res) { 
    return res.render("members/index", {members: data.members})
}

exports.show = function(req, res) {
    //req.params 
    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    }) 

    if (!foundMember) return res.send("Member not found!")


    const member = {
        ...foundMember,
        age: age(foundMember.birth),
    }


    return res.render("members/show", { member })
}

exports.create = function (req, res) {
    return res.render('members/create')
}

exports.post = function(req, res) {
    // req.query
    //req.body

    const keys = Object.keys(req.body)

    for (key of keys) {
        // req.body.key == ""
        if (req.body[key] == "") {
            return res.send('Por favor, preencha todos os campos!')
        }
    }

    let {avatar_url, birth, gender, services, name} = req.body


    // padronizar a data assim como no created_at
    birth = Date.parse(birth)

    //criar data no momento que esta sendo salvo
    const created_at = Date.now()

    //organizar por id
    const id = Number(data.members.length +1)




    // [{...}]
    data.members.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    }) // [{....}, {....}]

    //salvar na pasta data.json e organizar em espaços de 2 como diz na function
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Write File Error!")

        return res.redirect("/members")
    })


 //   return res.send(req.body)
}

exports.edit = function(req, res){
       //req.params 
       const { id } = req.params

       const foundMember = data.members.find(function(member){
           return member.id == id
       }) 
   
       if (!foundMember) return res.send("Member not found!")
   
       const member = {
           ...foundMember,
           birth: ''

       }
   

    return res.render('members/edit', { member })
}

exports.put = function(req, res) {

        const { id } = req.body
        let index = 0

        const foundMember = data.members.find(function(member, foundIndex){
           if (id == member.id) {
               index = foundIndex
               return true
           }
        }) 
    
        if (!foundMember) return res.send("Member not found!")

        const member = {
            ...foundMember,
            ...req.body,
            birth: Date.parse(req.body.birth),
            id: Number(req.body.id)
        }

        data.members[index] = member

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write error!")

            return res.redirect(`/members/${id}`)
        })
}

exports.delete = function(req, res) {
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member){
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/members")
    })
}